import { z } from "zod";
import { isValidFutureEventDate } from "@/lib/dates";

export const enquirySchema = z.object({
  name: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name cannot exceed 120 characters."),
  phone: z
    .string({ error: "Please enter a valid phone number." })
    .trim()
    .min(10, "Please enter a valid phone number (at least 10 digits).")
    .max(25, "Phone number cannot exceed 25 characters.")
    .superRefine((val, ctx) => {
      const digits = val.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid phone number with 10 to 15 digits.",
        });
        return;
      }
      if (!/^[\d\s+\-()]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number contains invalid characters.",
        });
      }
    }),
  email: z
    .string()
    .trim()
    .max(160, "Email cannot exceed 160 characters.")
    .nullish()
    .or(z.literal(""))
    .superRefine((val, ctx) => {
      if (!val || !val.trim()) return;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address.",
        });
      }
    }),
  location: z
    .string({ error: "Please provide an event location." })
    .trim()
    .min(2, "Please provide an event location.")
    .max(160, "Location cannot exceed 160 characters."),
  eventType: z
    .string({ error: "Please select an event type." })
    .trim()
    .min(2, "Please select an event type.")
    .max(100, "Event type is invalid."),
  addon: z
    .string()
    .max(120, "Add-on value is invalid.")
    .nullish()
    .or(z.literal("")),
  addons: z
    .union([
      z.array(z.string({ error: "Each add-on service must be text." }).max(120)),
      z.string().max(500),
    ])
    .nullish()
    .or(z.literal("")),
  addOnServices: z
    .union([
      z.array(z.string({ error: "Each add-on service must be text." }).max(120)),
      z.string().max(500),
    ])
    .nullish()
    .or(z.literal("")),
  date: z
    .string()
    .max(50)
    .nullish()
    .or(z.literal(""))
    .superRefine((val, ctx) => {
      if (!val || !val.trim()) return;
      const res = isValidFutureEventDate(val);
      if (!res.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: res.error || "Event date must be in the future (tomorrow or later).",
        });
      }
    }),
  budget: z
    .union([z.string(), z.number()])
    .nullish()
    .or(z.literal(""))
    .superRefine((val, ctx) => {
      if (val === null || val === undefined) return;
      if (typeof val === "number") {
        if (isNaN(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid numeric budget.",
          });
          return;
        }
        if (val < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Budget cannot be negative.",
          });
          return;
        }
        if (val > 1_000_000_000) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a realistic estimated budget (up to ₹100 Crore).",
          });
          return;
        }
        return;
      }

      const trimmed = val.trim();
      if (!trimmed) return;

      if (trimmed.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Budget cannot exceed 100 characters.",
        });
        return;
      }

      if (/^-\s*₹?/.test(trimmed) || /-\d+/.test(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Budget cannot be negative.",
        });
        return;
      }

      const numericOnly = trimmed.replace(/[^\d.]/g, "");
      if (numericOnly) {
        const num = parseFloat(numericOnly);
        if (!isNaN(num) && num > 1_000_000_000) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a realistic estimated budget (up to ₹100 Crore).",
          });
          return;
        }
      }
    }),
  message: z
    .string({ error: "Please enter your message." })
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message cannot exceed 2000 characters."),
});

export type EnquiryData = z.infer<typeof enquirySchema>;
