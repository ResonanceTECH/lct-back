import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const COOKIES_FIELDS = {
	RefreshToken: "refresh-token"
} as const satisfies Record<string, string>;

export type CookiesField = (typeof COOKIES_FIELDS)[keyof typeof COOKIES_FIELDS];

export const Cookies = createParamDecorator((key: CookiesField, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return key ? request.cookies?.[key] : request.cookies;
});
