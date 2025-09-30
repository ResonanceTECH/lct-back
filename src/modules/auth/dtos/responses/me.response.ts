import { createZodDto } from "nestjs-zod";
import { idDto } from "src/common/dtos/id";
import { roleSchema } from "src/common/dtos/role.schema";
import { ClientErrors } from "src/common/error-messages";
import z from "zod";

const schema = z
	.object({
		// id: idSchema,
		firstName: z
			.string()
			.min(2, ClientErrors.BadRequest.StringToShort)
			.max(24, ClientErrors.BadRequest.StringToLong)
			.trim(),
		lastName: z
			.string()
			.min(2, ClientErrors.BadRequest.StringToShort)
			.max(24, ClientErrors.BadRequest.StringToLong),
		phone: z.string().regex(/^\+79\d{9}$/, ClientErrors.BadRequest.InvalidFormat),
		role: roleSchema
	})
	.merge(idDto);

export class MeResponse extends createZodDto(schema) {}

export type MeResponseType = z.infer<typeof schema>;
