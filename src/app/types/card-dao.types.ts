import { Address } from "viem";
export interface CardDAOProps {
	daoName: string;
	daoDescription: string;
	daoAddresses: Address[] | string[];
	daoLogo: string;
	daoChain: string;
	daoChainId: string;
	daoId: string;
}
