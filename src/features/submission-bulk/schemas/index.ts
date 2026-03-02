import { z } from "zod";

export const bulkUploadSchema = z.object({
    file: z.any()
});
