import { createZodDto } from "nestjs-zod";
import { idSchema } from "src/common/dtos/id";
import z from "zod";

const schema = z.object({
	organizationId: idSchema,
	name: z.string().min(2).max(255),
	startAt: z.date(),
	endAt: z.date(),
	city: z.string().min(2).max(255).optional(),
	appointment: z.string().min(2).max(255).optional(),
	supervisorId: idSchema.optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional()
});

export class CreateProjectDto extends createZodDto(schema) {}

export type CreateProjectType = z.infer<typeof schema>;
