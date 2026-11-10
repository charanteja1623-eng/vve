"use client";

import React, { useRef, useId } from "react";
import { getTomorrowDateString, isValidFutureEventDate } from "@/lib/dates";

export interface DatePickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  sublabel?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: "light" | "dark";
  min?: string;
  className?: string;
  inputClassName?: string;
  "aria-label"?: string;
}

/**
 * Global accessible DatePicker component enforcing Vintage Vibe Events' future-date policy.
 * - Dynamic minimum date set strictly to tomorrow in Asia/Kolkata timezone.
 * - Native desktop and mobile calendar opening via showPicker() and calendar icon trigger.
 * - Instant clearing for optional date fields.
 * - Dual aesthetic styling variants ("light" for ivory contact forms, "dark" for palatial cards).
 * - Real-time inline validation feedback for invalid/past dates.
 */
export default function DatePicker({
  id: explicitId,
  name,
  value,
  onChange,
  label,
  sublabel,
  placeholder,
  required = false,
  disabled = false,
  variant = "dark",
  min,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabelProp,
}: DatePickerProps) {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic minimum date strictly calculated in destination timezone (Asia/Kolkata)
  const minDate = min || getTomorrowDateString();

  // Validate current value if present
  const validation = value ? isValidFutureEventDate(value) : { valid: true };
  const hasError = Boolean(value && !validation.valid);
  const errorMessage = hasError ? validation.error : undefined;

  const handleOpenPicker = () => {
    if (disabled || !inputRef.current) return;
    if (typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
      } catch {
        inputRef.current.focus();
      }
    } else {
      inputRef.current.focus();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange("");
    inputRef.current?.focus();
  };

  const isDark = variant === "dark";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-sans ${
            isDark
              ? "text-[10px] text-ivory/70 mb-1"
              : "text-xs font-bold uppercase tracking-widest text-burgundy-deep mb-2"
          }`}
        >
          {label}
          {required ? (
            <span className={isDark ? "text-gold ml-1" : "text-burgundy/60 ml-1"}>*</span>
          ) : sublabel ? (
            <span
              className={`ml-1 text-[10px] font-normal lowercase ${
                isDark ? "text-gold-light/60" : "text-burgundy/40"
              }`}
            >
              {sublabel}
            </span>
          ) : (
            <span
              className={`ml-1 text-[10px] font-normal lowercase ${
                isDark ? "text-ivory/50" : "text-burgundy/40"
              }`}
            >
              (optional)
            </span>
          )}
        </label>
      )}

      <div
        onClick={handleOpenPicker}
        className={`group relative flex items-center transition-all ${
          isDark
            ? `bg-burgundy-deep/90 border ${
                hasError ? "border-amber-400" : "border-gold/30 hover:border-gold/60"
              } rounded p-1.5 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/50 cursor-pointer`
            : `border-b ${
                hasError ? "border-amber-600" : "border-burgundy/30 hover:border-burgundy/60"
              } bg-transparent py-2.5 focus-within:border-gold focus-within:ring-0 cursor-pointer`
        }`}
      >
        <input
          ref={inputRef}
          type="date"
          id={id}
          name={name}
          min={minDate}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabelProp || label || "Select event date"}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          style={{ colorScheme: isDark ? "dark" : "light" }}
          className={`w-full bg-transparent font-sans focus:outline-none disabled:opacity-50 cursor-pointer ${
            isDark
              ? "text-xs text-ivory placeholder:text-ivory/40"
              : "text-sm text-burgundy-deep placeholder:text-burgundy-deep/40"
          } ${inputClassName}`}
        />

        {/* Clear Button (shown when a date is selected and field is not required) */}
        {value && !required && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selected date"
            title="Clear date"
            className={`p-1 mr-1 transition-colors rounded hover:bg-white/10 ${
              isDark ? "text-ivory/60 hover:text-gold" : "text-burgundy/50 hover:text-burgundy-deep"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Calendar Picker Trigger Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPicker();
          }}
          disabled={disabled}
          aria-label="Open calendar"
          title="Open calendar"
          className={`p-1 transition-colors rounded ${
            isDark ? "text-gold/80 hover:text-gold" : "text-burgundy/60 hover:text-burgundy-deep"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {hasError && errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          className={`font-sans text-[11px] mt-1 ${
            isDark ? "text-amber-300" : "text-amber-700"
          }`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
