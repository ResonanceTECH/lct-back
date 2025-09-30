import { createZodDto } from "nestjs-zod";
import { passwordFullRegex, passwordSpecialSymbol } from "src/common/constants/regex";
import { roleSchema } from "src/common/dtos/role.schema";
import { ClientErrors } from "src/common/error-messages";
import z from "zod";

const schema = z.object({
	firstName: z
		.string()
		.min(2, ClientErrors.BadRequest.StringToShort)
		.max(24, ClientErrors.BadRequest.StringToLong)
		.trim(),
	lastName: z.string().min(2, ClientErrors.BadRequest.StringToShort).max(24, ClientErrors.BadRequest.StringToLong),
	phone: z.string().regex(/^\+79\d{9}$/, ClientErrors.BadRequest.InvalidFormat),
	password: z
		.string()
		.min(6, ClientErrors.BadRequest.StringToShort)
		.max(24, ClientErrors.BadRequest.StringToLong)
		.regex(/[A-Z]/, ClientErrors.BadRequest.PasswordMustContainAtLeastOneUppercaseLetter)
		.regex(/[a-z]/, ClientErrors.BadRequest.PasswordMustContainAtLeastOneLowercaseLetter)
		.regex(/[0-9]/, ClientErrors.BadRequest.PasswordMustContainAtLeastOneNumber)
		.regex(passwordSpecialSymbol, ClientErrors.BadRequest.InvalidFormat)
		.regex(passwordFullRegex, ClientErrors.BadRequest.InvalidFormat),
	role: roleSchema
});

export class SignUpDto extends createZodDto(schema) {}

export type SignUpDtoType = z.infer<typeof schema>;
