import { z } from "zod";

export const promptSchema = z.object({
  prompt: z
    .string()
    .min(10, "Please provide a more detailed prompt.")
    .max(400, "Prompt is too long.")
});

export type PromptInput = z.infer<typeof promptSchema>;
