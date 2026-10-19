"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const APPROVED_EVENT_TYPES: string[] = [
  "wedding-packages",
  "birthday-parties",
  "surprise-parties",
  "indoor-outdoor-events",
  "school-college-events",
  "new-year-parties",
  "other",
];

const APPROVED_ADDONS: string[] = [
  "catering",
  "decoration",
  "tent-house",
  "dj-screens",
  "photo-videography",
  "customized-gifts",
  "resin-3d-molds",
  "corporate-gifting",
];

export default function EnquiryForm() {
  const searchParams = useSearchParams();
  const rawEventType = searchParams.get("eventType")?.toLowerCase().trim() || "";
  const rawAddon = searchParams.get("addon")?.toLowerCase().trim() || "";

  // Validate eventType against confirmed list; fail safely to empty string if invalid
  const validatedEventType = (() => {
    if (APPROVED_EVENT_TYPES.includes(rawEventType)) return rawEventType;
    return "";
  })();

  // Validate addon against confirmed list; fail safely to empty string if invalid
  const validatedAddon = (() => {
    if (APPROVED_ADDONS.includes(rawAddon)) return rawAddon;
    return "";
  })();

  const [userEventType, setUserEventType] = useState<string | null>(null);
  const [userAddon, setUserAddon] = useState<string | null>(null);

  const eventType = userEventType !== null ? userEventType : validatedEventType;
  const addon = userAddon !== null ? userAddon : validatedAddon;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
        setUserAddon("");
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
    <form id="enquiry-form" className="md:col-span-7 flex flex-col gap-8 p-6 sm:p-10 rounded-2xl bg-burgundy-deep/[0.03] backdrop-blur-md border border-burgundy/15 shadow-[0_8px_30px_rgba(58,5,7,0.06),_inset_0_1px_0_rgba(255,255,255,0.8)]" onSubmit={handleSubmit}>
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

      {/* Row 3: Event Category & Add-On Service */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="eventType" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Event Category <span className="text-burgundy/60">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            required
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

        <div className="flex flex-col gap-2">
          <label htmlFor="addon" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Add-On Service <span className="text-burgundy/40 text-[10px] font-normal lowercase">(optional)</span>
          </label>
          <select
            id="addon"
            name="addon"
            value={addon}
            onChange={(e) => setUserAddon(e.target.value)}
            disabled={isSubmitting}
            className="border-b border-burgundy/30 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50 cursor-pointer"
          >
            <option value="">Select an add-on service (optional)...</option>
            <option value="catering">Catering</option>
            <option value="decoration">Decoration</option>
            <option value="tent-house">Tent House</option>
            <option value="dj-screens">DJ & Screens</option>
            <option value="photo-videography">Photo & Videography</option>
            <option value="customized-gifts">Customized Gifts</option>
            <option value="resin-3d-molds">Resin & 3D Molds</option>
            <option value="corporate-gifting">Corporate Gifting</option>
          </select>
        </div>
      </div>

      {/* Row 4: Event Date & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
            Event Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
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
        className="mt-4 bg-burgundy hover:bg-burgundy-deep text-gold hover:text-gold-light border border-gold/40 hover:border-gold hover:shadow-[0_0_20px_rgba(201,161,90,0.3)] transition-all py-5 px-10 uppercase tracking-widest font-bold text-sm w-full sm:w-auto self-start rounded shadow-[0_4px_15px_rgba(58,5,7,0.2)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold"
      >
        {isSubmitting ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
