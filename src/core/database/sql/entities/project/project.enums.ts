export const PROJECT_STATUSES = {
	PLANING: 0,
	IN_PROGRESS: 1,
	COMPLETED: 2
} as const satisfies Record<string, number>;

export type ProjectStatus = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];
