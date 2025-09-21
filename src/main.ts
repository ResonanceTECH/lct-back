import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { initScalar } from "./core/http/documentation";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ trustProxy: true }), {
		cors: {
			origin: true,
			credentials: true,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
		}
	});

	const configService = app.get(ConfigService);
	const appName = configService.get("APP_NAME");
	const httpDocs = initScalar(app, appName);

	app.use("/docs", httpDocs);
	await app.listen(3000, "0.0.0.0");
}

bootstrap();
