import { createZodDto } from "nestjs-zod";
import z from "zod";

const schema = z.object({
	id: z.number(),
	name: z.string(),
	startAt: z.date(),
	endAt: z.date(),
	city: z.string().nullable(),
	appointment: z.string().nullable(),
	supervisorId: z.number().nullable(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable()
});

export class ProjectListResponse extends createZodDto(schema) {}

export type ProjectListItem = z.infer<typeof schema>;
