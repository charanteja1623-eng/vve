import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  // Evaluate position and parent overflow
  const diagnostics = await page.evaluate(() => {
    const section = document.querySelector('#events');
    const slots = Array.from(document.querySelectorAll('[data-stack-slot]')) as HTMLElement[];
    
    // Check parent overflow properties up to document
    const parents: { tag: string; id: string; className: string; overflow: string; overflowY: string }[] = [];
    let curr: HTMLElement | null = section as HTMLElement;
    while (curr && curr !== document.body) {
      const style = window.getComputedStyle(curr);
      parents.push({
        tag: curr.tagName,
        id: curr.id,
        className: curr.className,
        overflow: style.overflow,
        overflowY: style.overflowY
      });
      curr = curr.parentElement;
    }

    const slotInfo = slots.map((s, idx) => {
      const style = window.getComputedStyle(s);
      const rect = s.getBoundingClientRect();
      const card = s.firstElementChild as HTMLElement | null;
      return {
        idx,
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height },
        position: style.position,
        top: style.top,
        zIndex: style.zIndex,
        marginBottom: style.marginBottom,
        cardTransform: card?.style.transform || 'none'
      };
    });

    return { parents, slotInfo };
  });

  console.log('=== PARENT OVERFLOW CHAIN ===');
  console.log(JSON.stringify(diagnostics.parents, null, 2));

  console.log('=== SLOTS AT INITIAL VIEWPORT ===');
  console.log(JSON.stringify(diagnostics.slotInfo, null, 2));

  await browser.close();
}

main().catch(console.error);

