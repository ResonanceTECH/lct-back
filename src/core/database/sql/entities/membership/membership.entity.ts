import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn
} from "typeorm";
import { Organization } from "../organization/organization.entity";
import { User } from "../user/user.entity";

@Entity("membership")
@Unique(["organizationId", "userId"])
export class Membership {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ type: "integer" })
	organizationId: number;

	@Index()
	@Column({ type: "integer" })
	userId: number;

	@ManyToOne(() => Organization, (o) => o.members, { onDelete: "CASCADE" })
	organization: Partial<Organization>;

	@ManyToOne(() => User, (u) => u.memberships, { onDelete: "CASCADE" })
	user: Partial<User>;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
