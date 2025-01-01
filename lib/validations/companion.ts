import * as z from "zod";

export const companionSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  instructions: z.string().min(10, {
    message: "Instructions must be at least 10 characters.",
  }),
  seed: z.string().min(10, {
    message: "Seed messages must be at least 10 characters.",
  }),
});