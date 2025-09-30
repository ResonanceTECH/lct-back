export type UUID = string;

export type ID = UUID | number;

export interface IPrimaryKey {
	id: ID;
}
