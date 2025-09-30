import { USER_ROLES } from "src/core/database/sql/entities/user/user.enums";
import z from "zod";
import { ClientErrors } from "../error-messages";

export const roleSchema = z
	.nativeEnum(USER_ROLES, { message: ClientErrors.BadRequest.ValueNotInEnum })
	.refine((value) => value !== USER_ROLES.ADMIN, ClientErrors.Forbidden.CannotSetAdmin);
