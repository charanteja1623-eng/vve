'use client';

import React, {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode
} from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface ScrollStackItemProps {
  children?: ReactNode;
  itemClassName?: string;
  style?: CSSProperties;
}

export interface ScrollStackProps {
  children?: ReactNode;
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: number | string;
  itemScale?: number;
  baseScale?: number;
  dimAmount?: number;
  blurAmount?: number;
  tiltAmount?: number;
  rotationAmount?: number;
  holdDistance?: number;
  smoothScroll?: boolean;
  snap?: boolean;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface StackSettings {
  itemDistance: number;
  itemStackDistance: number;
  stackPosition: number | string;
  itemScale: number;
  baseScale: number;
  dimAmount: number;
  blurAmount: number;
  tiltAmount: number;
  rotationAmount: number;
  holdDistance: number;
  smoothScroll: boolean;
  snap: boolean;
  onStackComplete?: () => void;
}

const resolveOffset = (value: number | string, size: number) => {
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text.endsWith('%')) return (parseFloat(text) / 100) * size;
  return parseFloat(text) || 0;
};

const toLength = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const scrollsInside = (node: Element | null, stop: Element, delta: number) => {
  for (let element: Element | null = node; element && element !== stop; element = element.parentElement) {
    if (element.scrollHeight <= element.clientHeight + 1) continue;
    const overflow = getComputedStyle(element).overflowY;
    if (overflow !== 'auto' && overflow !== 'scroll') continue;
    if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) {
      return true;
    }
  }
  return false;
};

// VVE Luxury Card Shadow: Subtle antique gold rim with deep imperial burgundy drop shadow
const CARD_SHADOW = [
  '0 0 0 1px rgba(201, 161, 90, 0.22)',
  '0 -12px 40px -16px rgba(0, 0, 0, 0.45)',
  '0 24px 48px -24px rgba(0, 0, 0, 0.65)'
].join(', ');

export const ScrollStackItem = ({ children, itemClassName = '', style }: ScrollStackItemProps) => (
  <div
    className={`relative box-border w-full origin-top rounded-2xl will-change-transform ${itemClassName}`.trim()}
    style={{ boxShadow: CARD_SHADOW, ...style }}
  >
    {children}
    {/* Subtle imperial burgundy dim overlay as card sinks deeper into stack */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[#120102] opacity-[var(--scroll-stack-dim,0)] transition-opacity duration-200"
    />
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemStackDistance = 24,
  stackPosition = '15%',
  itemScale = 0.05,
  baseScale = 0.8,
  dimAmount = 0.2,
  blurAmount = 0,
  tiltAmount = 0,
  rotationAmount = 0,
  holdDistance = 200,
  smoothScroll = false,
  snap = false,
  useWindowScroll = false,
  onStackComplete
}: ScrollStackProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<StackSettings | null>(null);
  const scheduleRef = useRef<(() => void) | null>(null);
  const items = Children.toArray(children);

  useIsomorphicLayoutEffect(() => {
    settingsRef.current = {
      itemDistance,
      itemStackDistance,
      stackPosition,
      itemScale,
      baseScale,
      dimAmount,
      blurAmount,
      tiltAmount,
      rotationAmount,
      holdDistance,
      smoothScroll,
      snap,
      onStackComplete
    };
    scheduleRef.current?.();
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const end = endRef.current;
    if (!root || !inner || !end) return undefined;

    const windowed = useWindowScroll;
    const target = windowed ? window : root;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new Map<string, string | number>();
    let frame = 0;
    let glide = 0;
    let rest = 0;
    let complete = false;
    let gliding = false;
    let pressed = false;
    let current = 0;
    let goal = 0;
    let written = 0;
    let last = 0;
    let points: number[] = [];
    let reach = 0;

    const readScroll = () => (windowed ? window.scrollY : root.scrollTop);
    const maxScroll = () =>
      windowed ? document.documentElement.scrollHeight - window.innerHeight : root.scrollHeight - root.clientHeight;
    const writeScroll = (value: number) => {
      written = value;
      target.scrollTo({ top: value, behavior: 'instant' });
    };

    const write = <T extends string | number>(key: string, value: T, apply: (value: T) => void) => {
      if (cache.get(key) === value) return false;
      cache.set(key, value);
      apply(value);
      return true;
    };

    const update = () => {
      frame = 0;
      const settings = settingsRef.current;
      const slots = (Array.from(inner.children) as HTMLElement[]).filter(child =>
        child.hasAttribute('data-stack-slot')
      );
      if (!settings || !slots.length) return;

      const viewHeight = windowed ? window.innerHeight : root.clientHeight;
      const viewWidth = windowed ? window.innerWidth : root.clientWidth;
      const isMobile = viewWidth < 768;
      const isTablet = viewWidth >= 768 && viewWidth < 1024;

      // Responsive adjustments: Desktop full, tablet reduced, mobile minimal overlap
      const offset = isMobile
        ? Math.min(settings.itemStackDistance, 12)
        : isTablet
        ? Math.min(settings.itemStackDistance, 18)
        : settings.itemStackDistance;

      const scaleStep = isMobile ? settings.itemScale * 0.4 : isTablet ? settings.itemScale * 0.7 : settings.itemScale;

      const viewTop = windowed ? 0 : root.getBoundingClientRect().top + root.clientTop;
      const stackTop = resolveOffset(settings.stackPosition, viewHeight);
      const heights = slots.map(slot => slot.offsetHeight);
      const tops = slots.map(slot => slot.getBoundingClientRect().top);
      const lastPin = stackTop + (slots.length - 1) * offset;
      const padTop = windowed ? 0 : stackTop;
      const endHeight =
        settings.holdDistance + (windowed ? 0 : Math.max(0, viewHeight - lastPin - heights[heights.length - 1]));

      let moved = write('padTop', padTop, value => {
        inner.style.paddingTop = `${value}px`;
      });
      moved =
        write('endHeight', endHeight, value => {
          end.style.height = `${value}px`;
        }) || moved;

      let flow = inner.getBoundingClientRect().top - viewTop + readScroll() + padTop;
      points = heights.map((height, i) => {
        const point = flow - stackTop - i * offset;
        flow += height + settings.itemDistance;
        return point;
      });
      reach = Math.max(40, (heights[0] + settings.itemDistance - offset) / 2);

      const depths = slots.map(() => 0);
      let lastCover = 0;
      for (let j = 1; j < slots.length; j++) {
        const pinBefore = viewTop + stackTop + (j - 1) * offset;
        const start = pinBefore + heights[j - 1];
        const span = Math.max(1, start - pinBefore - offset);
        const cover = Math.min(1, Math.max(0, (start - tops[j]) / span));
        for (let i = 0; i < j; i++) depths[i] += cover;
        lastCover = cover;
      }

      const dimStep = Math.min(Math.max(settings.dimAmount, 0), 1);
      slots.forEach((slot, i) => {
        const card = slot.firstElementChild as HTMLElement | null;
        if (!card) return;
        const depth = depths[i];
        const lean = Math.min(depth, 1);
        const scale = Math.max(Math.min(settings.baseScale, 1), 1 - depth * scaleStep);
        const tilt = -lean * settings.tiltAmount;
        const turn = lean * settings.rotationAmount * (i % 2 ? -1 : 1);
        const blur = depth * settings.blurAmount;
        const dim = 1 - Math.pow(1 - dimStep, depth);
        const translateY = isMobile ? -depth * 6 : -depth * 14;
        const transform =
          depth < 0.0005
            ? ''
            : `perspective(1200px) translateY(${translateY.toFixed(1)}px) rotateX(${tilt.toFixed(2)}deg) rotate(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        write(`transform${i}`, transform, value => {
          card.style.transform = value;
        });
        write(`filter${i}`, blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '', value => {
          card.style.filter = value;
        });
        write(`dim${i}`, dim.toFixed(3), value => {
          card.style.setProperty('--scroll-stack-dim', value);
        });
      });

      const done = slots.length > 1 && lastCover >= 0.999;
      if (done !== complete) {
        complete = done;
        if (done) settings.onStackComplete?.();
      }

      if (moved) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (Math.abs(readScroll() - written) > 2) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      current += (goal - current) * (1 - Math.pow(0.82, dt * 60));
      if (Math.abs(goal - current) < 0.6) current = goal;
      writeScroll(current);
      if (current === goal) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      glide = requestAnimationFrame(step);
    };

    const glideTo = (value: number) => {
      goal = Math.min(Math.max(value, 0), maxScroll());
      if (motion.matches) {
        writeScroll(goal);
        return;
      }
      gliding = true;
      current = readScroll();
      written = current;
      last = performance.now();
      cancelAnimationFrame(glide);
      glide = requestAnimationFrame(step);
    };

    const settle = () => {
      rest = 0;
      if (!settingsRef.current?.snap || gliding || pressed || !points.length) return;
      const now = readScroll();
      const nearest = points.reduce((best, point) => (Math.abs(point - now) < Math.abs(best - now) ? point : best));
      const gap = Math.abs(nearest - now);
      if (gap > 1 && gap < reach) glideTo(nearest);
    };

    const settleSoon = () => {
      window.clearTimeout(rest);
      rest = window.setTimeout(settle, 140);
    };

    const onScroll = () => {
      schedule();
      if (!gliding) settleSoon();
    };

    let gestureLockUntil = 0;

    const onWheel = (input: Event) => {
      const event = input as WheelEvent;
      if (motion.matches || event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (scrollsInside(event.target as Element | null, windowed ? document.body : root, event.deltaY)) return;

      if (!points.length) return;

      const currentScroll = readScroll();
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      const stackEntryBound = firstPoint - 25;
      const stackExitBound = lastPoint + 25;

      // If outside stack bounds, allow standard free page scrolling
      if (currentScroll < stackEntryBound || currentScroll > stackExitBound) {
        return;
      }

      // Inside stack: find closest active card
      let activeIndex = 0;
      let minDiff = Infinity;
      for (let i = 0; i < points.length; i++) {
        const diff = Math.abs(points[i] - currentScroll);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = i;
        }
      }

      const now = performance.now();
      // Trackpad momentum / rapid events guard: if within cooldown, prevent skipping
      if (now < gestureLockUntil) {
        event.preventDefault();
        return;
      }

      // Check intentional vertical gesture
      if (event.deltaY > 18) {
        // Downward gesture -> Advance to next card
        if (activeIndex < points.length - 1) {
          event.preventDefault();
          gestureLockUntil = now + 380;
          glideTo(points[activeIndex + 1]);
        }
        // If activeIndex === points.length - 1: at last card, release to normal page scrolling
      } else if (event.deltaY < -18) {
        // Upward gesture -> Return to previous card
        if (activeIndex > 0) {
          event.preventDefault();
          gestureLockUntil = now + 380;
          glideTo(points[activeIndex - 1]);
        }
        // If activeIndex === 0: at first card, release to upward page scrolling
      }
    };

    let touchStartY = 0;
    let touchStartTime = 0;

    const onTouchStart = (event: Event) => {
      const te = event as TouchEvent;
      if (te.touches && te.touches.length === 1) {
        touchStartY = te.touches[0].clientY;
        touchStartTime = performance.now();
      }
    };

    const onTouchEnd = (event: Event) => {
      const te = event as TouchEvent;
      if (!te.changedTouches || te.changedTouches.length !== 1 || !points.length) return;
      const touchEndY = te.changedTouches[0].clientY;
      const diffY = touchEndY - touchStartY;
      const elapsed = performance.now() - touchStartTime;

      if (Math.abs(diffY) > 40 && elapsed < 550) {
        const currentScroll = readScroll();
        const stackEntryBound = points[0] - 30;
        const stackExitBound = points[points.length - 1] + 30;

        if (currentScroll >= stackEntryBound && currentScroll <= stackExitBound) {
          let activeIndex = 0;
          let minDiff = Infinity;
          for (let i = 0; i < points.length; i++) {
            const diff = Math.abs(points[i] - currentScroll);
            if (diff < minDiff) {
              minDiff = diff;
              activeIndex = i;
            }
          }

          if (diffY < -40 && activeIndex < points.length - 1) {
            glideTo(points[activeIndex + 1]);
          } else if (diffY > 40 && activeIndex > 0) {
            glideTo(points[activeIndex - 1]);
          }
        }
      }
    };

    const onPress = () => {
      pressed = true;
      window.clearTimeout(rest);
    };

    const onRelease = () => {
      if (!pressed) return;
      pressed = false;
      settleSoon();
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(inner);
    target.addEventListener('scroll', onScroll, { passive: true });
    target.addEventListener('wheel', onWheel, { passive: false });
    target.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    target.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });
    window.addEventListener('pointercancel', onRelease, { passive: true });
    window.addEventListener('resize', schedule);
    scheduleRef.current = schedule;
    update();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(glide);
      window.clearTimeout(rest);
      observer.disconnect();
      target.removeEventListener('scroll', onScroll);
      target.removeEventListener('wheel', onWheel);
      target.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      target.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
      window.removeEventListener('resize', schedule);
      scheduleRef.current = null;
    };
  }, [useWindowScroll]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${useWindowScroll ? '' : 'h-full overflow-x-hidden overflow-y-auto'} ${className}`.trim()}
    >
      <div ref={innerRef} className="relative w-full">
        {items.map((child, index) => {
          const gap = itemDistance - (items.length - index) * itemStackDistance;
          return (
            <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
              {index > 0 && (
                <div
                  aria-hidden="true"
                  style={{ height: Math.max(0, gap), marginTop: Math.min(0, gap) }}
                />
              )}
              <div
                data-stack-slot=""
                className="sticky"
                style={{
                  top: `calc(${toLength(stackPosition)} + ${index * itemStackDistance}px)`,
                  marginBottom: (items.length - 1 - index) * itemStackDistance,
                  zIndex: index + 1
                }}
              >
                {child}
              </div>
            </Fragment>
          );
        })}
        <div ref={endRef} aria-hidden="true" />
      </div>
    </div>
  );
};

export default ScrollStack;
