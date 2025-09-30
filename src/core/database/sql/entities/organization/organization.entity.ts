import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Membership } from "../membership/membership.entity";
import { User } from "../user/user.entity";

@Entity("organizations")
export class Organization {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ type: "varchar", length: 255 })
	name: string;

	@Index({ unique: true })
	@Column({ type: "varchar", length: 32 })
	inn: string;

	@Column({ type: "varchar", length: 512, nullable: true })
	address: string | null;

	@Column({ type: "integer" })
	createdById: number;

	@ManyToOne(() => User, (u) => u.createdOrganizations, { nullable: false })
	@JoinColumn({ name: "createdById" })
	createdBy?: Partial<User>;

	@OneToMany(() => Membership, (m) => m.organization, { cascade: ["insert", "update"] })
	members: Membership[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
