import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Organization } from "../organization/organization.entity";
import { User } from "../user/user.entity";
import { ProjectStatus } from "./project.enums";

@Entity("projects")
export class Project {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 255, nullable: false })
	name: string;

	@Index()
	@Column({ type: "date", default: () => "CURRENT_DATE" })
	startAt: Date;

	@Index()
	@Column({ type: "date", default: () => "CURRENT_DATE" })
	endAt: Date;

	@Column({ type: "integer", default: 0 })
	status: ProjectStatus;

	@Column({ type: "varchar", length: 255, nullable: false })
	city: string;

	@Column({ type: "integer", nullable: false })
	appointment: string;

	@Column({ type: "integer", nullable: false })
	supervisorId: number;

	@Column({ type: "integer", nullable: false })
	organizationId: number;

	@Column({ type: "varchar", length: 255, nullable: true })
	photoUrl: string | null;

	@Column({ type: "double precision", nullable: true })
	latitude: number | null;

	@Column({ type: "double precision", nullable: true })
	longitude: number | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: "supervisorId" })
	supervisor: Partial<User>;

	@ManyToOne(() => Organization, { nullable: true })
	@JoinColumn({ name: "organizationId" })
	organization: Partial<Organization>;
}
