import { createZodDto } from "nestjs-zod";
import { ClientErrors } from "src/common/error-messages";
import z from "zod";

function isValidINN(inn: string): boolean {
	const digits = inn.split("").map(Number);

	const sum = (coeffs: number[]) => coeffs.reduce((acc, c, i) => acc + c * digits[i], 0);
	if (inn.length === 10) {
		const coeff = [2, 4, 10, 3, 5, 9, 4, 6, 8];
		const control = (sum(coeff) % 11) % 10;
		return control === digits[9];
	}

	if (inn.length === 12) {
		const coeff11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
		const coeff12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
		const n11 = (sum(coeff11) % 11) % 10;
		const n12 = (sum(coeff12) % 11) % 10;
		return n11 === digits[10] && n12 === digits[11];
	}

	return false;
}

const schema = z.object({
	name: z.string(),
	inn: z
		.string()
		.regex(/^(?!00)\d{2}(?:\d{8}|\d{10})$/, ClientErrors.BadRequest.InvalidFormat)
		.refine(isValidINN, ClientErrors.BadRequest.InvalidFormat),
	ceo: z.string(),
	address: z.string()
});

export class CreateOrganizationDto extends createZodDto(schema) {}

export type CreateOrganizationType = z.infer<typeof schema>;
