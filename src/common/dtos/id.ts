import { ApiParamOptions, ApiQueryOptions } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ClientErrors } from "../error-messages";
import { unique } from "../functions/array-factory";

export const idSchema = z
	.number()
	.min(0, ClientErrors.BadRequest.MustBePositive)
	.int(ClientErrors.BadRequest.MustBeInteger);
export const idArrayString = z.array(idSchema).transform((list) => unique(list));

export const idDto = z.object({ id: idSchema });

export class IdDto extends createZodDto(idDto) {}

export const idOpenApiParams: ApiParamOptions = { type: "number", name: "id", required: true };
export const idOpenApiQuery: ApiQueryOptions = { type: "number", name: "id", required: true };
