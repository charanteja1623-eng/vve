import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  location: z.string().min(2, "Please provide an event location."),
  eventType: z.string().min(2, "Please select an event type."),
  date: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type EnquiryData = z.infer<typeof enquirySchema>;
