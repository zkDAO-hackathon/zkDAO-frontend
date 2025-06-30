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
