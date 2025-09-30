export const USER_ROLES = {
	CUSTOMER: 0,
	FOREMAN: 1,
	INSPECTOR: 2,
	ADMIN: 3
} as const satisfies Record<string, number>;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
