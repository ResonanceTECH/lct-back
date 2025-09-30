import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { IJwt } from "../types/jwt";

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): IJwt => {
	const request = ctx.switchToHttp().getRequest();
	return request.user;
});

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
