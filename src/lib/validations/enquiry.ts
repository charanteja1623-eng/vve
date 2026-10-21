import { z } from "zod";
import { isValidFutureEventDate } from "@/lib/dates";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(120, "Name cannot exceed 120 characters."),
  phone: z.string().min(10, "Please enter a valid phone number.").max(25, "Phone number cannot exceed 25 characters."),
  email: z.string().email("Please enter a valid email address.").max(160, "Email cannot exceed 160 characters.").optional().or(z.literal("")),
  location: z.string().min(2, "Please provide an event location.").max(160, "Location cannot exceed 160 characters."),
  eventType: z.string().min(2, "Please select an event type.").max(100, "Event type is invalid."),
  addon: z.string().max(120, "Add-on value is invalid.").optional().or(z.literal("")),
  addons: z.union([z.array(z.string().max(120)), z.string().max(500)]).optional(),
  date: z
    .string()
    .max(50)
    .optional()
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
  budget: z.string().max(100, "Budget cannot exceed 100 characters.").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000, "Message cannot exceed 2000 characters."),
});

export type EnquiryData = z.infer<typeof enquirySchema>;
