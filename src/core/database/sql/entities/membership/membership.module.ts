import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Membership } from "./membership.entity";
import { MembershipRepository } from "./membership.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Membership])],
	providers: [MembershipRepository],
	exports: [MembershipRepository]
})
export class MembershipRepositoryModule {}
