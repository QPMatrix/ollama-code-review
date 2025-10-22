import{ z} from "zod";

export const SeveritySchema = z.enum(['error', 'warning', 'info']);
