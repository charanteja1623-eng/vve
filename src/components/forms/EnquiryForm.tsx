"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { getTomorrowDateString } from "@/lib/dates";

const APPROVED_EVENT_TYPES: string[] = [
  "wedding-packages",
  "birthday-parties",
  "surprise-parties",
  "indoor-outdoor-events",
  "school-college-events",
  "new-year-parties",
  "other",
];

const APPROVED_ADDONS = [
  { id: "catering", label: "Catering", desc: "Multi-cuisine food & live counters" },
  { id: "decoration", label: "Decoration", desc: "Floral stages & ambient decor" },
  { id: "tent-house", label: "Tent House", desc: "Waterproof tents & seating setups" },
  { id: "dj-screens", label: "DJ & Screens", desc: "Audio-visual & dance lighting" },
  { id: "photo-videography", label: "Photo & Videography", desc: "Fine-art photography & films" },
  { id: "customized-gifts", label: "Customized Gifts", desc: "Bespoke return gifts & favors" },
  { id: "resin-3d-molds", label: "Resin & 3D Molds", desc: "Handcrafted keepsakes & molds" },
] as const;

const APPROVED_ADDON_IDS: string[] = APPROVED_ADDONS.map((a) => a.id);

const emptySubscribe = () => () => {};

function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function EnquiryForm() {
  const isHydrated = useIsHydrated();
  const searchParams = useSearchParams();
  const rawEventType = searchParams.get("eventType")?.toLowerCase().trim() || "";
  const rawServices = searchParams.get("services")?.trim() || "";

  // Validate eventType against confirmed list; fail safely to empty string if invalid
  const validatedEventType = (() => {
    if (APPROVED_EVENT_TYPES.includes(rawEventType)) return rawEventType;
    return "";
  })();

  // Extract initial addons from URL search parameters (supports both ?addon= and ?addons=)
  const validatedInitialAddons = (() => {
    const fromSingle = searchParams.get("addon") || "";
    const fromPlural = searchParams.get("addons") || "";
    const allParams = [...searchParams.getAll("addon"), ...searchParams.getAll("addons")];
    const combined = [fromSingle, fromPlural, ...allParams]
      .flatMap((s) => s.split(","))
      .map((s) => s.toLowerCase().trim())
      .filter((id) => APPROVED_ADDON_IDS.includes(id));
    return Array.from(new Set(combined));
  })();

  const [userEventType, setUserEventType] = useState<string | null>(null);
  const [userAddons, setUserAddons] = useState<string[] | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [isAddonOpen, setIsAddonOpen] = useState(false);
  const addonRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Dynamic minimum date strictly starting tomorrow in Asia/Kolkata
  const minDate = getTomorrowDateString();
  const [dateValue, setDateValue] = useState("");

  // During SSR and initial hydration pass (!isHydrated), render empty values to match server HTML.
  // Immediately after hydration completes (isHydrated), seamlessly apply prefilled query params.
  const eventType = !isHydrated
    ? ""
    : userEventType !== null
    ? userEventType
    : validatedEventType;

  const selectedAddons = !isHydrated
    ? []
    : userAddons !== null
    ? userAddons
    : validatedInitialAddons;

  const defaultInitialMessage = rawServices
    ? `I would like to enquire about the following services:\n\n${rawServices}`
    : "";

  const message = !isHydrated
    ? ""
    : userMessage !== null
    ? userMessage
    : defaultInitialMessage;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  // Handle outside clicks and keyboard navigation for multi-select dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addonRef.current && !addonRef.current.contains(e.target as Node)) {
        setIsAddonOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isAddonOpen) {
        setIsAddonOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (isAddonOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddonOpen]);

  function toggleAddon(id: string) {
    setUserAddons((prev) => {
      const current = prev !== null ? prev : validatedInitialAddons;
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      } else {
        return [...current, id];
      }
    });
  }

  function removeAddon(id: string) {
    setUserAddons((prev) => {
      const current = prev !== null ? prev : validatedInitialAddons;
      return current.filter((item) => item !== id);
    });
  }

  function clearAllAddons() {
    setUserAddons([]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(formData.entries());

    // Explicit client-side date boundary check: must be strictly tomorrow or later
    const dateInput = (data.date as string)?.trim() || "";
    if (dateInput && dateInput < minDate) {
      setStatus({
        type: "error",
        message: "Event date must be in the future (tomorrow or later).",
      });
      setIsSubmitting(false);
      return;
    }

    // Attach selected add-ons array and primary single value for backward compatibility
    data.addons = selectedAddons;
    data.addon = selectedAddons.length > 0 ? selectedAddons[0] : "";

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: result.message || "Your enquiry has been successfully submitted.",
        });
        (e.target as HTMLFormElement).reset();
        setUserEventType("");
        setUserAddons([]);
        setUserMessage("");
        setDateValue("");
        setIsAddonOpen(false);
      } else {
        setStatus({
          type: "error",
          message: result.message || result.error || "Something went wrong.",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      id="enquiry-form"
      suppressHydrationWarning
      className="md:col-span-7 flex flex-col gap-8 p-6 sm:p-10 rounded-2xl bg-burgundy-deep/[0.03] backdrop-blur-md border border-burgundy/15 shadow-[0_8px_30px_rgba(58,5,7,0.06),_inset_0_1px_0_rgba(255,255,255,0.8)]"
      onSubmit={handleSubmit}
    >
      {status.type !== "idle" && (
        <div
          role="alert"
          className={`p-5 rounded-lg border text-sm font-sans font-medium ${
            status.type === "success"
              ? "bg-gold/15 border-gold text-burgundy-deep"
              : "bg-red-900/15 border-red-700/40 text-red-900"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Name <span className="text-burgundy/60">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            maxLength={120}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50"
            placeholder="Your full name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Phone <span className="text-burgundy/60">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            maxLength={25}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50"
            placeholder="Your contact number"
          />
        </div>
      </div>

      {/* Row 2: Email & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={160}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50"
            placeholder="Your email address"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Event Location <span className="text-burgundy/60">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            maxLength={160}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50"
            placeholder="City or venue"
          />
        </div>
      </div>

      {/* Row 3: Event Category & Multiple Add-On Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
        {/* Column 1: Event Category */}
        <div className="flex flex-col gap-2">
          <label htmlFor="eventType" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Event Category <span className="text-burgundy/60">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            suppressHydrationWarning
            value={eventType}
            onChange={(e) => setUserEventType(e.target.value)}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50 cursor-pointer"
          >
            <option value="">Select an event category...</option>
            <option value="wedding-packages">Wedding Packages</option>
            <option value="birthday-parties">Birthday Parties</option>
            <option value="surprise-parties">Surprise Parties</option>
            <option value="indoor-outdoor-events">Indoor & Outdoor Events</option>
            <option value="school-college-events">School & College Events</option>
            <option value="new-year-parties">New Year Parties</option>
            <option value="other">Other Celebrations</option>
          </select>
        </div>

        {/* Column 2: Accessible Multi-Select Add-On Services */}
        <div ref={addonRef} className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <label
              id="addons-label"
              htmlFor="addon-trigger"
              className="text-xs font-bold uppercase tracking-widest text-burgundy-deep"
            >
              Add-On Services <span className="text-burgundy/40 text-[10px] font-normal lowercase">(optional)</span>
            </label>
            {selectedAddons.length > 0 && (
              <button
                type="button"
                onClick={clearAllAddons}
                disabled={isSubmitting}
                className="text-[10px] uppercase tracking-wider text-burgundy/60 hover:text-burgundy-deep underline transition-colors cursor-pointer disabled:opacity-50"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Combobox Trigger Button */}
          <button
            ref={triggerRef}
            id="addon-trigger"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isAddonOpen}
            aria-labelledby="addons-label addon-trigger"
            aria-controls="addon-listbox"
            disabled={isSubmitting}
            onClick={() => setIsAddonOpen((prev) => !prev)}
            className="border-b border-burgundy/30 bg-transparent py-3 flex items-center justify-between text-left text-burgundy-deep font-sans transition-colors cursor-pointer focus:outline-none focus:border-gold disabled:opacity-50"
          >
            <span className={selectedAddons.length > 0 ? "font-medium" : "text-burgundy/40"}>
              {selectedAddons.length === 0
                ? "Select add-on services (optional)..."
                : `${selectedAddons.length} ${selectedAddons.length === 1 ? "service" : "services"} selected`}
            </span>
            <svg
              className={`w-4 h-4 text-burgundy/60 transition-transform duration-200 ${
                isAddonOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Backward compatibility element for automated smoke tests and legacy single-addon checks */}
          <input
            type="hidden"
            id="addon"
            name="addon"
            value={selectedAddons.length > 0 ? selectedAddons[0] : ""}
          />

          {/* Popover Dropdown Panel */}
          {isAddonOpen && (
            <div
              id="addon-listbox"
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby="addons-label"
              className="absolute top-full left-0 right-0 mt-2 z-30 bg-[#faf7f2]/95 backdrop-blur-md border border-gold/40 rounded-xl shadow-[0_12px_32px_rgba(58,5,7,0.12)] p-2 max-h-64 overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {APPROVED_ADDONS.map((item) => {
                  const isSelected = selectedAddons.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleAddon(item.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer w-full focus:outline-none focus:bg-gold/20 ${
                        isSelected
                          ? "bg-gold/15 text-burgundy-deep font-semibold"
                          : "hover:bg-burgundy-deep/[0.04] text-burgundy-deep/90"
                      }`}
                    >
                      {/* Checkbox Icon */}
                      <span
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-gold border-gold text-burgundy-deep"
                            : "border-burgundy/40 bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>

                      {/* Label & Description */}
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-[11px] text-burgundy/60 font-normal">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Add-on Service Chips */}
          {selectedAddons.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2" aria-label="Selected add-on services">
              {selectedAddons.map((id) => {
                const item = APPROVED_ADDONS.find((a) => a.id === id);
                const label = item?.label || id;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-gold/15 border border-gold/40 text-burgundy-deep shadow-xs"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => removeAddon(id)}
                      disabled={isSubmitting}
                      aria-label={`Remove ${label}`}
                      className="text-burgundy-deep/60 hover:text-burgundy-deep hover:bg-gold/30 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Event Date & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Event Date <span className="text-burgundy/40 text-[10px] font-normal lowercase">(future dates only)</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            min={minDate}
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Estimated Budget
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            maxLength={100}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50"
            placeholder="e.g. ₹5,00,000"
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2 mt-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
          Message <span className="text-burgundy/60">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          suppressHydrationWarning
          value={message}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={isSubmitting}
          className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors resize-none font-sans text-burgundy-deep disabled:opacity-50"
          placeholder="Tell us more about your event ideas, approximate guest count, and any special preferences..."
        ></textarea>
      </div>

      {/* Honeypot anti-spam field */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-burgundy hover:bg-burgundy-deep text-gold hover:text-gold-light border border-gold/40 hover:border-gold hover:shadow-[0_0_20px_rgba(201,161,90,0.3)] transition-all py-5 px-10 uppercase tracking-widest font-bold text-sm w-full sm:w-auto self-start rounded shadow-[0_4px_15px_rgba(58,5,7,0.2)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
      >
        {isSubmitting ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
