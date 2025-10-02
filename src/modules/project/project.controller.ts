import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUser } from "src/common/decorators/request";
import { IdDto } from "src/common/dtos/id";
import { IJwt } from "src/common/types/jwt";
import { CreateProjectDto } from "./dtos/requests/create";
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
}
