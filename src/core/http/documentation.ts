import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { patchNestJsSwagger } from "nestjs-zod";
import { ClientErrors } from "../../common/error-messages";

export const initScalar = async (app: NestFastifyApplication, appName: string) => {
	patchNestJsSwagger();

	const errorGroups = Object.entries(ClientErrors)
		.map(([groupName, { code, ...errors }]) => {
			const errorItems = Object.values(errors)
				.map((e) => `<li>${e}</li>`)
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

	await app.register(apiReference, {
		routePrefix: "/docs",
		content: document,
		withFastify: true
	});
};
