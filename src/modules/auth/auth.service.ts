/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as argon2 from "argon2";
import { ClientErrors } from "src/common/error-messages";
import { User } from "src/core/database/sql/entities/user/user.entity";
import { UserRepository } from "../../core/database/sql/entities/user/user.repository";
import { SignUpDtoType } from "./dtos/requests/sign-up.dto";

@Injectable()
export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	public async isPhoneHasBeenUsed(phone: string): Promise<void> {
		const isUsersExists = await this.userRepository.getByKey("phone", phone);
		if (isUsersExists.length) throw new BadRequestException(ClientErrors.BadRequest.UserExists);
	}

	public async isUserExists(phone: string) {
		const [isUsersExists] = await this.userRepository.getByKey("phone", phone);
		if (!isUsersExists) throw new BadRequestException(ClientErrors.NotFound.UserNotFound);

		return isUsersExists;
	}

	public createUser(doc: SignUpDtoType) {
		return this.userRepository.create(doc);
	}

	public hashPassword(password: string): Promise<string> {
		return argon2.hash(password, { type: argon2.argon2d });
	}

	public verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
		return argon2.verify(hashedPassword, plainPassword);
	}

	public async getUserById(id: number): Promise<Omit<User, "password">> {
		const user = await this.userRepository.getById(id);
		if (!user) throw new NotFoundException(ClientErrors.NotFound.UserNotFound);
		delete user.password;
		return user;
	}
}
