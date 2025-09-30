import { ConfigService } from "@nestjs/config";
// eslint-disable-next-line import/no-extraneous-dependencies
import { config } from "dotenv";
import type { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";
import { entities } from "./entities";

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: configService.get<string>("PG_HOST"),
	port: configService.get<number>("PG_PORT", 5432),
	username: configService.get<string>("PG_USER"),
	password: configService.get<string>("PG_PASSWORD"),
	database: configService.get<string>("DB_NAME"),
	synchronize: true,
	entities,
	// migrations: ["dist/src/core/database/sql/migrations/*.js"],
	// migrationsRun: false,
	logging: false
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
