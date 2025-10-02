export const ClientErrors = {
	BadRequest: {
		code: 400,
		UserExists: "USER-EXISTS",
		PasswordMustContainAtLeastOneUppercaseLetter: "PASSWORD-MUST-CONTAIN-AT-LEAST-ONE-UPPERCASE-LETTER",
		PasswordMustContainAtLeastOneLowercaseLetter: "PASSWORD-MUST-CONTAIN-AT-LEAST-ONE-LOWERCASE-LETTER",
		PasswordMustContainAtLeastOneNumber: "PASSWORD-MUST-CONTAIN-AT-LEAST-ONE-NUMBER",
		StringToShort: "STRING-TO-SHORT",
		StringToLong: "STRING-TO-LONG",
		InvalidFormat: "INVALID-FORMAT",
		ValueNotInEnum: "VALUE-NOT-IN-ENUM",
		OrganizationAlreadyExists: "ORGANIZATION-ALREADY-EXISTS"
	},
	Forbidden: {
		NotEnoughPermissions: "NOT-ENOUGH-PERMISSIONS",
		CannotSetAdmin: "CANNOT-SET-ADMIN",
		code: 403
	},
	NotFound: {
		code: 404,
		TokenNotFound: "TOKEN-NOT-FOUND",
		UserNotFound: "USER-NOT-FOUND"
	},
	NotAuthorized: {
		code: 401,
		TokenExpired: "TOKEN-EXPIRED",
		SessionExpiredOrINvalid: "SESSION-EXPIRED-OR-INVALID"
	}
} as const satisfies Record<string, Record<string, string> | { code: number }>;
