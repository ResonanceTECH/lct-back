import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	Res,
	UnauthorizedException
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastifyReply } from "fastify";
import { GetUser, Public } from "src/common/decorators/request";
import { ClientErrors } from "src/common/error-messages";
import { Cookies, COOKIES_FIELDS } from "src/common/functions/cookie-factory";
import { makeUUID } from "src/common/functions/generation-factory";
import { IJwt } from "src/common/types/jwt";
import { RedisService } from "src/core/database/redis/redis.service";
import { AuthGuard, TOKEN_TYPES } from "./auth.guard";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dtos/requests/sign-in.dto";
import { SignUpDto } from "./dtos/requests/sign-up.dto";
import { JwtResponse } from "./dtos/responses/jwt.response";
import { MeResponse } from "./dtos/responses/me.response";

@ApiTags("Auth")
@Controller("sign")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly redisService: RedisService,
		private readonly guardService: AuthGuard
	) {}

	@Public()
	@Post("/up")
	public async signUp(
		@Body() body: SignUpDto,
		@Res({ passthrough: true }) reply: FastifyReply
	): Promise<JwtResponse> {
		await this.authService.isPhoneHasBeenUsed(body.phone);

		const hashedPassword = await this.authService.hashPassword(body.password);

		const user = await this.authService.createUser({ ...body, password: hashedPassword });
		const sessionPayload: IJwt = { id: user.id, session: makeUUID() };

		const { accessToken, refreshToken, expires } = await this.guardService.createToken(sessionPayload);

		reply.setCookie(COOKIES_FIELDS.RefreshToken, refreshToken, { expires });

		return { jwt: accessToken };
	}

	@Public()
	@Post("/in")
	@HttpCode(200)
	public async signIn(
		@Body() body: SignInDto,
		@Res({ passthrough: true }) reply: FastifyReply
	): Promise<JwtResponse> {
		const user = await this.authService.isUserExists(body.phone);

		const isPasswordVerified = await this.authService.verifyPassword(user.password, body.password);
		if (!isPasswordVerified) throw new BadRequestException(ClientErrors.NotFound.UserNotFound);

		const sessionPayload: IJwt = { id: user.id, session: makeUUID() };
		const { accessToken, refreshToken, expires } = await this.guardService.createToken(sessionPayload);

		reply.setCookie(COOKIES_FIELDS.RefreshToken, refreshToken, { expires });

		return { jwt: accessToken };
	}

	@Public()
	@Post("/refresh")
	public async refresh(
		@Cookies(COOKIES_FIELDS.RefreshToken) oldRefreshToken: string,
		@Res({ passthrough: true }) reply: FastifyReply
	): Promise<JwtResponse> {
		const sessionPayload = await this.guardService.decodeToken(oldRefreshToken, TOKEN_TYPES.RefreshToken);

		const isValidToken = await this.redisService.exists(`us:${sessionPayload.id}:sess:${sessionPayload.session}`);
		if (!isValidToken) throw new UnauthorizedException(ClientErrors.NotAuthorized.SessionExpiredOrINvalid);

		delete sessionPayload.exp;
		delete sessionPayload.iat;

		const { accessToken, refreshToken, expires } = await this.guardService.createToken(sessionPayload);
		reply.setCookie("refresh-token", refreshToken, { expires });

		return { jwt: accessToken };
	}

	@Get("/me")
	@ApiResponse({ status: 200, type: MeResponse })
	public getMe(@GetUser() user: IJwt) {
		return this.authService.getUserById(user.id);
	}

	@Delete("/out")
	@ApiBearerAuth()
	@HttpCode(204)
	public async signOut(
		@Cookies(COOKIES_FIELDS.RefreshToken) refreshToken: string,
		@Res({ passthrough: true }) response: FastifyReply
	): Promise<void> {
		if (!refreshToken) throw new UnauthorizedException("TOKEN-NOT-FOUND");
		const sessionPayload = await this.guardService.decodeToken(refreshToken);
		await this.guardService.destroySession(sessionPayload);
		response.clearCookie(COOKIES_FIELDS.RefreshToken);
	}

	@Delete("/out/all")
	@ApiBearerAuth()
	@HttpCode(204)
	public async signOutAll(@GetUser() user: IJwt): Promise<void> {
		const keys = await this.redisService.getKeys(`us:${user.id}:sess:*`);
		await this.redisService.deleteValue(...keys);
	}
}
