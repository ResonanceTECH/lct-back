import { createZodDto } from "nestjs-zod";
import z from "zod";

const schema = z.object({ phone: z.string(), password: z.string() });

export class SignInDto extends createZodDto(schema) {}

export type SignInDtoType = z.infer<typeof schema>;
