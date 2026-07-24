import { z } from "zod";

export const checkVoucherSchema = z.object({
  flightNumber: z.string().trim().min(1, "Flight number is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const generateVoucherSchema = z.object({
  name: z.string().trim().min(1, "Crew name is required"),
  id: z.string().trim().min(1, "Crew ID is required"),
  flightNumber: z.string().trim().min(1, "Flight number is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  aircraft: z.enum(["ATR", "Airbus 320", "Boeing 737 Max"], {
    errorMap: () => ({ message: "Aircraft must be one of: ATR, Airbus 320, Boeing 737 Max" }),
  }),
});

export type CheckVoucherInput = z.infer<typeof checkVoucherSchema>;
export type GenerateVoucherInput = z.infer<typeof generateVoucherSchema>;
