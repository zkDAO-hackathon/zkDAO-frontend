import { Address } from "viem";
export interface CardDAOProps {
	daoName: string;
	daoDescription: string;
	token: Address;
	daoLogo: string;
	governor: Address;
	creator: Address;
	daoId: string;
	createdAt?: Date;
}

export interface DaoStruct {
	id: bigint;
	createdAt: bigint;
	creator: Address;
	token: Address;
	timelock: Address;
	governor: Address;
	name: string;
	description: string;
	logo: string;
}
