import { UUID } from "./id";

export interface IJwt {
	id: number;
	session: UUID;
	iat?: number;
	exp?: number;
}
