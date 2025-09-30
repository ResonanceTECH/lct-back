import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Membership } from "../membership/membership.entity";
import { Organization } from "../organization/organization.entity";
import { UserRole } from "./user.enums";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", nullable: false })
	firstName: string;

	@Column({ type: "varchar", nullable: false })
	lastName: string;

	@Column({ type: "varchar", nullable: false })
	phone: string;

	@Column({ type: "varchar", nullable: false })
	password: string;

	@Column({ type: "integer", nullable: false })
	role: UserRole;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Organization, (o) => o.createdBy)
	createdOrganizations: Organization[];

	@OneToMany(() => Membership, (m) => m.user)
	memberships: Membership[];
}
