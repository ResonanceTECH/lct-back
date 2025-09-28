import fastifyCookie from "@fastify/cookie";
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
	const cookieSecret = configService.get<string>("COOKIE_SECRET") || "SomeSecret";
	const port = Number(configService.get("APP_PORT")) || 3000;

	const httpDocs = initScalar(app, appName);
	await app.register(httpDocs, { prefix: "/docs" });

	await app.register(fastifyCookie, { secret: cookieSecret });
	await app.listen(port, "0.0.0.0");
}

bootstrap();
