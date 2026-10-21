"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { weddingStructure, artisanalServices } from "@/lib/site";
import DatePicker from "@/components/ui/DatePicker";

export default function WeddingPackageExplorer() {
  const router = useRouter();

  // 1. Home Events & Pujas selections
  const [selectedHomeEvents, setSelectedHomeEvents] = useState<string[]>([]);
  const [homeEventsDate, setHomeEventsDate] = useState("");
  const [homeCustomsNote, setHomeCustomsNote] = useState("");

  // 2. Bride & Groom services selections
  const [selectedBrideGroom, setSelectedBrideGroom] = useState<string[]>([]);
  const [brideGroomDate, setBrideGroomDate] = useState("");

  // 3. Wedding Functions (Independent selections: Haldi, Sangeet, Reception)
  const [selectedFunctions, setSelectedFunctions] = useState<Record<string, boolean>>({
    haldi: false,
    sangeet: false,
    reception: false,
  });

  // Function details
  const [functionDetails, setFunctionDetails] = useState<Record<string, {
    date?: string;
    venue?: string;
    guestCount?: string;
    decorPref?: string[];
    specialInstructions?: string;
  }>>({
    haldi: { decorPref: [] },
    sangeet: { decorPref: [] },
    reception: { decorPref: [] },
  });

  // 4. Add-on services selections
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Toggles
  const toggleHomeEvent = (id: string) => {
    setSelectedHomeEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBrideGroom = (id: string) => {
    setSelectedBrideGroom((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFunction = (fnId: string) => {
    setSelectedFunctions((prev) => ({
      ...prev,
      [fnId]: !prev[fnId],
    }));
  };

  const toggleFunctionDecorPref = (fnId: string, opt: string) => {
    setFunctionDetails((prev) => {
      const current = prev[fnId] || { decorPref: [] };
      const currentPrefs = current.decorPref || [];
      const updatedPrefs = currentPrefs.includes(opt)
        ? currentPrefs.filter((p) => p !== opt)
        : [...currentPrefs, opt];
      return {
        ...prev,
        [fnId]: { ...current, decorPref: updatedPrefs },
      };
    });
  };

  const updateFunctionField = (fnId: string, field: string, value: string) => {
    setFunctionDetails((prev) => ({
      ...prev,
      [fnId]: {
        ...prev[fnId],
        [field]: value,
      },
    }));
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Build prefill text for contact form
  const handleProceedToEnquiry = () => {
    const parts: string[] = [];

    // Functions
    const activeFns = Object.entries(selectedFunctions)
      .filter(([, active]) => active)
      .map(([id]) => id);

    if (activeFns.length > 0) {
      parts.push(`Selected Wedding Functions: ${activeFns.map((f) => f.toUpperCase()).join(", ")}`);
      activeFns.forEach((fn) => {
        const details = functionDetails[fn];
        const subParts: string[] = [];
        if (details?.date) subParts.push(`Date: ${details.date}`);
        if (details?.venue) subParts.push(`Venue: ${details.venue}`);
        if (details?.guestCount) subParts.push(`Guests: ${details.guestCount}`);
        if (details?.decorPref && details.decorPref.length > 0) {
          subParts.push(`Decor preferences: ${details.decorPref.join("; ")}`);
        }
        if (details?.specialInstructions) {
          subParts.push(`Notes: ${details.specialInstructions}`);
        }
        if (subParts.length > 0) {
          parts.push(`  • ${fn.toUpperCase()}: ${subParts.join(" | ")}`);
        }
      });
    }

    // Home Events
    if (selectedHomeEvents.length > 0) {
      const labels = weddingStructure.homeEventsAndPujas.services
        .filter((s) => selectedHomeEvents.includes(s.id))
        .map((s) => s.label);
      parts.push(`Home Events & Pujas: ${labels.join(", ")}`);
      if (homeEventsDate) {
        parts.push(`  Preferred Date: ${homeEventsDate}`);
      }
      if (homeCustomsNote) {
        parts.push(`  Family Customs & Traditions: ${homeCustomsNote}`);
      }
    }

    // Bride & Groom
    if (selectedBrideGroom.length > 0) {
      const labels = weddingStructure.brideAndGroomServices.services
        .filter((s) => selectedBrideGroom.includes(s.id))
        .map((s) => s.label);
      parts.push(`Bride & Groom Services: ${labels.join(", ")}`);
      if (brideGroomDate) {
        parts.push(`  Preferred Date: ${brideGroomDate}`);
      }
    }

    // Addons
    if (selectedAddons.length > 0) {
      const labels = artisanalServices
        .filter((a) => selectedAddons.includes(a.id))
        .map((a) => a.title);
      parts.push(`Coordinated Add-Ons: ${labels.join(", ")}`);
    }

    const compiledServices = encodeURIComponent(parts.join("\n\n"));
    const primaryAddon = selectedAddons[0] || "";
    const addonParam = primaryAddon ? `&addon=${primaryAddon}` : "";

    // Extract earliest or primary selected date across functions and services
    const activeDates = [
      ...activeFns.map((fn) => functionDetails[fn]?.date),
      homeEventsDate,
      brideGroomDate,
    ].filter(Boolean) as string[];
    const primaryDate = activeDates[0] || "";
    const dateParam = primaryDate ? `&date=${encodeURIComponent(primaryDate)}` : "";

    router.push(`/contact?eventType=wedding-packages&services=${compiledServices}${addonParam}${dateParam}#enquiry-form`);
  };

  const totalSelectionsCount =
    (selectedFunctions.haldi ? 1 : 0) +
    (selectedFunctions.sangeet ? 1 : 0) +
    (selectedFunctions.reception ? 1 : 0) +
    selectedHomeEvents.length +
    selectedBrideGroom.length +
    selectedAddons.length;

  return (
    <section id="explore-wedding-packages" className="py-20 px-5 sm:px-8 lg:px-12 bg-burgundy-deep border-b border-gold/20 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gold block mb-3 px-3.5 py-1 rounded-full bg-burgundy-deep/80 backdrop-blur-md border border-gold/30 w-fit mx-auto shadow-sm">
            Wedding Packages & Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory mb-5 leading-tight">
            Build Your Wedding Package
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-5" />
          <p className="font-sans text-base text-ivory/80 leading-relaxed">
            Choose the home rituals, bride & groom services, wedding functions, and add-ons you need. We will prepare a clear quotation based on your choices.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {/* =========================================================
              PART A: Home Events & Pujas (Combined Category)
              ========================================================= */}
          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-white/[0.08] via-burgundy-deep/45 to-[#120102]/65 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Image & Overview */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/50 shadow-md">
                  <Image
                    src={weddingStructure.homeEventsAndPujas.image}
                    alt={weddingStructure.homeEventsAndPujas.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/85 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 font-sans text-xs font-semibold px-3 py-1 bg-burgundy-deep/80 text-gold border border-gold/30 rounded backdrop-blur-md">
                    {weddingStructure.homeEventsAndPujas.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory mb-2">
                    {weddingStructure.homeEventsAndPujas.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-ivory/80 leading-relaxed mb-3">
                    {weddingStructure.homeEventsAndPujas.description}
                  </p>
                  <p className="font-sans text-[11px] text-gold-light/90 italic bg-gold/10 p-3 rounded border border-gold/20">
                    ✦ {weddingStructure.homeEventsAndPujas.customizationNote}
                  </p>
                </div>
              </div>

              {/* Selectable Services */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block">
                  Select Required Home Ceremonies & Rituals:
                </span>

                <div className="space-y-3.5">
                  {weddingStructure.homeEventsAndPujas.services.map((srv) => {
                    const isSelected = selectedHomeEvents.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => toggleHomeEvent(srv.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleHomeEvent(srv.id);
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                          isSelected
                            ? "bg-gold/15 border-gold shadow-[0_0_18px_rgba(201,161,90,0.25)]"
                            : "bg-white/[0.04] border-gold/20 hover:border-gold/40 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                            isSelected
                              ? "bg-gold border-gold text-burgundy-deep font-bold"
                              : "border-gold/40 bg-burgundy-deep/60"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-lg text-ivory leading-snug">
                            {srv.label}
                          </h4>
                          <p className="font-sans text-xs text-ivory/70 mt-1 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Family Customs & Preferred Date Details */}
                <div className="pt-4 border-t border-gold/20 flex flex-col gap-4">
                  <div className="max-w-xs">
                    <DatePicker
                      id="date-home-events"
                      value={homeEventsDate}
                      onChange={setHomeEventsDate}
                      variant="dark"
                      label="Preferred Date for Pujas & Ceremonies:"
                      aria-label="Preferred date for Home Events & Pujas"
                    />
                  </div>
                  <div>
                    <label htmlFor="home-customs-note" className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-2">
                      Family Customs & Special Ceremony Instructions:
                    </label>
                    <textarea
                      id="home-customs-note"
                      rows={2}
                      value={homeCustomsNote}
                      onChange={(e) => setHomeCustomsNote(e.target.value)}
                      placeholder="Specify particular traditions (Telugu, Tamil, Marwari, etc.), preferred muhurtham dates, or specific puja items needed..."
                      className="w-full bg-burgundy-deep/70 border border-gold/30 rounded-lg p-3 text-xs font-sans text-ivory focus:border-gold focus:outline-none placeholder:text-ivory/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              PART B: Bride & Groom Services
              ========================================================= */}
          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-white/[0.08] via-burgundy-deep/45 to-[#120102]/65 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Image & Overview */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/50 shadow-md">
                  <Image
                    src={weddingStructure.brideAndGroomServices.image}
                    alt={weddingStructure.brideAndGroomServices.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/85 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 font-sans text-xs font-semibold px-3 py-1 bg-burgundy-deep/80 text-gold border border-gold/30 rounded backdrop-blur-md">
                    {weddingStructure.brideAndGroomServices.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory mb-2">
                    {weddingStructure.brideAndGroomServices.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-ivory/80 leading-relaxed mb-3">
                    {weddingStructure.brideAndGroomServices.description}
                  </p>
                  <p className="font-sans text-[11px] text-gold-light/90 italic bg-gold/10 p-3 rounded border border-gold/20">
                    ✦ {weddingStructure.brideAndGroomServices.customizationNote}
                  </p>
                </div>
              </div>

              {/* Selectable Services */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block">
                  Select Desired Styling & Beauty Coordination:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {weddingStructure.brideAndGroomServices.services.map((srv) => {
                    const isSelected = selectedBrideGroom.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => toggleBrideGroom(srv.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleBrideGroom(srv.id);
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-gold/15 border-gold shadow-[0_0_15px_rgba(201,161,90,0.22)]"
                            : "bg-white/[0.04] border-gold/20 hover:border-gold/35 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-xs transition-colors ${
                            isSelected
                              ? "bg-gold border-gold text-burgundy-deep font-bold"
                              : "border-gold/40 bg-burgundy-deep/60"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-ivory leading-snug">
                            {srv.label}
                          </h4>
                          <p className="font-sans text-[11px] text-ivory/70 mt-1 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Preferred Date for Bride & Groom Services */}
                <div className="pt-4 border-t border-gold/20 max-w-xs">
                  <DatePicker
                    id="date-bride-groom"
                    value={brideGroomDate}
                    onChange={setBrideGroomDate}
                    variant="dark"
                    label="Preferred Date for Styling & Trials:"
                    aria-label="Preferred date for Bride and Groom Services"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              PART C: Wedding Functions — Three Independent Selections
              Haldi, Sangeet, and Reception are strictly independent!
              ========================================================= */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                Independent Function Architecture
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-ivory">
                Wedding Functions
              </h3>
              <p className="font-sans text-xs sm:text-sm text-ivory/70 mt-2">
                Select any combination independently. Selecting Haldi and Reception does not require Sangeet.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {weddingStructure.functions.map((fn) => {
                const isSelected = selectedFunctions[fn.id];
                const details = functionDetails[fn.id] || { decorPref: [] };

                return (
                  <div
                    key={fn.id}
                    className={`rounded-2xl border transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "border-gold bg-gradient-to-br from-gold/[0.12] via-burgundy-deep/80 to-[#120102] shadow-[0_16px_50px_rgba(201,161,90,0.25)] ring-1 ring-gold/40"
                        : "border-gold/25 bg-gradient-to-br from-white/[0.07] via-burgundy-deep/45 to-[#120102]/70 hover:border-gold/45 shadow-[0_12px_36px_rgba(0,0,0,0.55)]"
                    }`}
                  >
                    <div>
                      {/* Image Header with Full-Bleed Coverage */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-gold/20">
                        <Image
                          src={fn.image}
                          alt={fn.imageAlt}
                          fill
                          className="object-cover object-center"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/40 to-transparent pointer-events-none" />
                        <span className="absolute top-3 left-3 font-sans text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-burgundy-deep/85 text-gold border border-gold/30 backdrop-blur-md">
                          {fn.tag}
                        </span>

                        {/* Selection status chip */}
                        <div className="absolute bottom-3 right-3">
                          <button
                            type="button"
                            onClick={() => toggleFunction(fn.id)}
                            className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                              isSelected
                                ? "bg-gold text-burgundy-deep hover:bg-gold-light border border-gold-light"
                                : "bg-burgundy-deep/90 text-ivory/80 border border-gold/40 hover:border-gold hover:text-gold"
                            }`}
                          >
                            {isSelected ? "✓ Function Selected" : "+ Add Function"}
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h4 className="font-serif text-2xl text-ivory mb-2">
                          {fn.title}
                        </h4>
                        <p className="font-sans text-xs text-ivory/80 leading-relaxed mb-4">
                          {fn.description}
                        </p>

                        {/* Core Focus Areas */}
                        <div className="space-y-1.5 mb-5">
                          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-gold/90 block">
                            Key Production Inclusions:
                          </span>
                          {fn.focusAreas.map((area, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[11px] font-sans text-ivory/75">
                              <span className="text-gold text-[8px]">✦</span>
                              <span>{area}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Detail Fields — Shown when function is selected */}
                        {isSelected && (
                          <div className="pt-4 border-t border-gold/25 space-y-3.5 bg-burgundy-deep/60 p-3.5 rounded-xl border border-gold/20">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold block">
                              Customize {fn.title}:
                            </span>

                            {/* Preferred Date & Guest Count / Venue */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <DatePicker
                                  id={`date-${fn.id}`}
                                  value={details.date || ""}
                                  onChange={(val) => updateFunctionField(fn.id, "date", val)}
                                  variant="dark"
                                  label="Preferred Date:"
                                  aria-label={`Preferred date for ${fn.title}`}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-sans text-ivory/70 block mb-1">
                                  {fn.id === "reception" ? "Guest Count:" : "Venue / Location:"}
                                </label>
                                <input
                                  type="text"
                                  placeholder={fn.id === "reception" ? "e.g. 500 Guests" : "e.g. Lawn or Hall"}
                                  value={fn.id === "reception" ? details.guestCount || "" : details.venue || ""}
                                  onChange={(e) =>
                                    updateFunctionField(
                                      fn.id,
                                      fn.id === "reception" ? "guestCount" : "venue",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-burgundy-deep/90 border border-gold/30 rounded p-1.5 text-xs font-sans text-ivory focus:border-gold focus:outline-none placeholder:text-ivory/40"
                                />
                              </div>
                            </div>

                            {/* Selectable Decor & Setup Options */}
                            <div>
                              <label className="text-[10px] font-sans text-ivory/70 block mb-1.5">
                                Select Decor & Setup Preferences:
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {fn.selectableOptions.map((opt, oIdx) => {
                                  const isOptSelected = (details.decorPref || []).includes(opt);
                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => toggleFunctionDecorPref(fn.id, opt)}
                                      className={`text-[10px] font-sans px-2.5 py-1 rounded-full border transition-all ${
                                        isOptSelected
                                          ? "bg-gold text-burgundy-deep border-gold font-semibold shadow-sm"
                                          : "bg-burgundy-deep/60 text-ivory/75 border-gold/20 hover:border-gold/40"
                                      }`}
                                    >
                                      {isOptSelected ? `✓ ${opt}` : `+ ${opt}`}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-6 pt-0">
                      <button
                        type="button"
                        onClick={() => toggleFunction(fn.id)}
                        className={`w-full py-2.5 rounded font-sans text-xs font-bold uppercase tracking-wider transition-all border ${
                          isSelected
                            ? "bg-gold/20 border-gold text-gold hover:bg-gold/30"
                            : "bg-burgundy-deep/50 border-gold/30 text-ivory/80 hover:text-gold hover:border-gold"
                        }`}
                      >
                        {isSelected ? "Configured in Package" : "Select This Function"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              PART D: 7 Reusable Add-On Services
              ========================================================= */}
          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-white/[0.08] via-burgundy-deep/45 to-[#120102]/65 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-1">
                  Comprehensive Event Services
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
                  Incorporate Add-On Services
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-ivory/70 max-w-md">
                Select any of our 7 verified add-on services to manage alongside your wedding ceremonies.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {artisanalServices.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => toggleAddon(addon.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleAddon(addon.id);
                      }
                    }}
                    className={`group relative rounded-xl overflow-hidden border p-3.5 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-gold/15 border-gold shadow-[0_0_16px_rgba(201,161,90,0.25)] ring-1 ring-gold/40"
                        : "bg-white/[0.04] border-gold/20 hover:border-gold/40 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="relative h-24 w-full rounded overflow-hidden mb-2.5 border border-gold/15">
                      <Image
                        src={addon.image}
                        alt={addon.imageAlt}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-burgundy-deep/90 border border-gold/40 flex items-center justify-center text-[10px]">
                        {isSelected ? <span className="text-gold font-bold">✓</span> : <span className="text-ivory/40">+</span>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-ivory group-hover:text-gold transition-colors leading-snug">
                        {addon.title}
                      </h4>
                      <p className="font-sans text-[10px] text-ivory/65 line-clamp-1 mt-0.5">
                        {addon.highlights[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM DOCK: Interactive Summary & Proceed to Enquiry
            ========================================================= */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-gold/35 bg-gradient-to-r from-burgundy-deep/95 via-burgundy/80 to-burgundy-deep/95 backdrop-blur-2xl shadow-[0_16px_50px_rgba(15,1,2,0.9),_inset_0_1px_0_rgba(227,201,133,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-serif text-2xl text-gold font-light">
                {totalSelectionsCount}
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">
                Services & Functions Selected
              </span>
            </div>
            <p className="font-sans text-xs text-ivory/75 max-w-xl">
              Proceed to our enquiry form with your selections prefilled. Our team will prepare a clear quotation for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleProceedToEnquiry}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs rounded hover:shadow-[0_0_25px_rgba(201,161,90,0.45)] hover:-translate-y-0.5 transition-all shadow-lg text-center cursor-pointer"
            >
              Enquire with Selected Services →
            </button>
            <a
              href="#explore-wedding-packages"
              className="w-full sm:w-auto px-5 py-4 border border-gold/30 text-ivory font-sans text-xs font-semibold uppercase tracking-wider rounded hover:border-gold hover:bg-gold/10 transition-colors text-center"
            >
              Review Selections ↑
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
