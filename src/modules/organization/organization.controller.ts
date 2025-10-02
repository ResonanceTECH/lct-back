import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUser } from "src/common/decorators/request";
import { IdDto } from "src/common/dtos/id";
import { ClientErrors } from "src/common/error-messages";
import { IJwt } from "src/common/types/jwt";
import { CreateOrganizationDto } from "./dtos/requests/create.dto";
import { OrganizationService } from "./organization.service";

@ApiTags("Organization")
@Controller("organization")
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	public async createOrganization(@GetUser() user: IJwt, @Body() body: CreateOrganizationDto): Promise<IdDto> {
		const status = await this.organizationService.getByName(body);
		if (status) throw new BadRequestException(ClientErrors.BadRequest.OrganizationAlreadyExists);

		const id = await this.organizationService.create(body, user.id);
		return { id };
	}
}
