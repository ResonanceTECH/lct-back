import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetUser } from "src/common/decorators/request";
import { IdDto } from "src/common/dtos/id";
import { IJwt } from "src/common/types/jwt";
import { CreateProjectDto } from "./dtos/requests/create";
import { ProjectListResponse } from "./dtos/responses/list";
import { ProjectService } from "./project.service";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	async create(@GetUser() user: IJwt, @Body() body: CreateProjectDto): Promise<IdDto> {
		const id = await this.projectService.create(body, user.id);
		return { id };
	}

	@Get("/list")
	@ApiResponse({ type: ProjectListResponse })
	async list(@GetUser() user: IJwt) {
		const data = await this.projectService.list(user.id, { limit: 10, offset: 0 });

		return data;
	}
}
