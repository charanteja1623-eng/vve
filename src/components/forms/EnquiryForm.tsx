"use client";

import { useState } from "react";

export default function EnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent duplicate submissions
    
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: result.message || 'Your enquiry has been successfully submitted.' });
        // Optionally reset form here
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({ type: 'error', message: result.message || result.error || 'Something went wrong.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form id="enquiry-form" className="md:col-span-7 flex flex-col gap-8 pt-4" onSubmit={handleSubmit}>
      
      {status.type !== 'idle' && (
        <div className={`p-4 rounded border text-sm font-sans ${status.type === 'success' ? 'bg-gold/10 border-gold/30 text-gold-light' : 'bg-red-900/30 border-red-500/30 text-red-200'}`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Name <span className="text-burgundy/50">*</span></label>
          <input type="text" id="name" name="name" required disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans disabled:opacity-50" placeholder="Your full name" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Phone <span className="text-burgundy/50">*</span></label>
          <input type="tel" id="phone" name="phone" required disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans disabled:opacity-50" placeholder="Your contact number" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Email</label>
          <input type="email" id="email" name="email" disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans disabled:opacity-50" placeholder="Your email address" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Event Location <span className="text-burgundy/50">*</span></label>
          <input type="text" id="location" name="location" required disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans disabled:opacity-50" placeholder="City or venue" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="eventType" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Event Type <span className="text-burgundy/50">*</span></label>
          <select id="eventType" name="eventType" required disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50">
            <option value="">Select an event type...</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday Party</option>
            <option value="surprise">Surprise Party</option>
            <option value="anniversary">Anniversary</option>
            <option value="corporate">Corporate Event</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Event Date</label>
          <input type="date" id="date" name="date" disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans text-burgundy-deep disabled:opacity-50" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Estimated Budget</label>
          <input type="text" id="budget" name="budget" disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors font-sans disabled:opacity-50" placeholder="e.g. ₹5,00,000" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">Message <span className="text-burgundy/50">*</span></label>
        <textarea id="message" name="message" rows={5} required disabled={isSubmitting} className="border-b border-burgundy/20 bg-transparent py-3 focus:border-gold focus:outline-none transition-colors resize-none font-sans disabled:opacity-50" placeholder="Tell us more about your event location, guest count, and ideas..."></textarea>
      </div>

      {/* Honeypot field */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button type="submit" disabled={isSubmitting} className="mt-4 bg-burgundy text-gold hover:text-gold-light hover:bg-burgundy-deep transition-all py-5 px-10 uppercase tracking-widest font-bold text-sm w-full sm:w-auto self-start shadow-[0_4px_15px_rgba(58,5,7,0.2)] disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
      </button>
    </form>
  );
}
