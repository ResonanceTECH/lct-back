import { CanActivate, ExecutionContext, Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastifyRequest } from "fastify";
import moment from "moment";
import { IS_PUBLIC_KEY } from "src/common/decorators/request";
import { IJwt } from "src/common/types/jwt";
import { RedisService } from "src/core/database/redis/redis.service";

export const TOKEN_TYPES = {
	RefreshToken: "refresh-token",
	AccessToken: "access-token"
} as const satisfies Record<string, string>;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

@Injectable()
export class AuthGuard implements CanActivate {
	private accessTtl: number;

	private refreshTtl: number;

	private accessSecret: string;

	private refreshSecret: string;

	constructor(
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private reflector: Reflector
	) {
		this.accessTtl = this.configService.getOrThrow<number>("ACCESS_TOKEN_TTL");
		this.refreshTtl = this.configService.getOrThrow<number>("REFRESH_TOKEN_TTL");
		this.accessSecret = this.configService.get<string>(`ACCESS_TOKEN_SECRET`) || "SomeSecret";
		this.refreshSecret = this.configService.get<string>(`REFRESH_TOKEN_SECRET`) || "SomeSecret";
	}

	public async createToken(payload: IJwt) {
		const expires = moment(new Date()).add(this.refreshTtl, "s").toDate();
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: this.refreshSecret,
			expiresIn: `${this.refreshTtl}s`
		});
		const accessToken = await this.jwtService.signAsync(payload, {
			secret: this.accessSecret,
			expiresIn: `${this.accessTtl}s`
		});

		await this.redisService.setValue(`us:${payload.id}:sess:${payload.session}`, "1", this.refreshTtl);
		return { refreshToken, accessToken, expires };
	}

	async decodeToken(token: string, tokenType: TokenType = TOKEN_TYPES.AccessToken) {
		try {
			const payload: IJwt = await this.jwtService.verifyAsync(token, {
				secret: tokenType === TOKEN_TYPES.AccessToken ? this.accessSecret : this.refreshSecret
			});

			const sessionExists = await this.redisService.exists(`us:${payload.id}:sess:${payload.session}`);
			if (!sessionExists) throw new UnauthorizedException("Session expired or invalid");

			return payload;
		} catch (error) {
			if (error instanceof UnauthorizedException) throw error;
			throw new UnauthorizedException("Invalid token or session");
		}
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (isPublic) return true;

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) throw new UnauthorizedException("Token not found");
		request.user = await this.decodeToken(token);
		return true;
	}

	private extractTokenFromHeader(@Req() request: FastifyRequest): string | undefined {
		const authHeader = request.headers.authorization;
		if (!authHeader) return undefined;

		const [type, token] = authHeader.split(" ");
		return type === "Bearer" ? token : undefined;
	}

	public async destroySession(payload: IJwt) {
		await this.redisService.deleteValue(`user:${payload.id}:sess:${payload.session}`);
	}
}
