import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { patchNestJsSwagger } from "nestjs-zod";
import { ClientErrors } from "../../common/error-messages";

export const initScalar = (app: INestApplication, appName: string) => {
	patchNestJsSwagger();

	const errorGroups = Object.entries(ClientErrors)
		.map(([groupName, { code, ...errors }]) => {
			const errorItems = Object.values(errors)
				.map((error) => `<li>${error}</li>`)
				.join("");
			return `<li><b>${code} - ${groupName}</b><ul>${errorItems}</ul></li>`;
		})
		.join("");

	const swaggerConfig = new DocumentBuilder()
		.setTitle(`${appName} API`)
		.addBearerAuth()
		.setDescription(`<h3>The REST API documentation.</h3> <b>Available client errors:</b><ul>${errorGroups}</ul>`)
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	return apiReference({ content: document, withFastify: true });
};
