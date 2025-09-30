import { generateApiKey } from "generate-api-key";

interface RandomOptions {
	prefix?: string;
	batch?: number;
}
export const makeRandomName = (options?: RandomOptions) =>
	generateApiKey({ method: "base62", prefix: options?.prefix, batch: options?.batch });

export const makeUUID = () => generateApiKey({ method: "uuidv4" }).toString();

export const makeSimpleCode = (length = 4) =>
	generateApiKey({ method: "string", length, pool: "0123456789" }).toString();
