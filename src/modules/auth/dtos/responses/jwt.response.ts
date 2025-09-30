import { createZodDto } from "nestjs-zod";
import z from "zod";

const schema = z.object({ jwt: z.string().jwt() });

export class JwtResponse extends createZodDto(schema) {}

export type JwtResponseType = z.infer<typeof schema>;
