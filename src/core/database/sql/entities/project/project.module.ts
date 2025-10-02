import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./project.entity";
import { ProjectRepository } from "./project.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Project])],
	providers: [ProjectRepository],
	exports: [ProjectRepository]
})
export class ProjectRepositoryModule {}
