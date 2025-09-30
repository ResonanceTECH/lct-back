export const stringArrayBuilder = (strings: string[]) => strings.map((str) => `'${str}'`).join(",");

export const numberArrayBuilder = (numbers: number[]) => numbers.join(",");
