import { Address } from "viem";
export interface IDAO {
	chain: string;
	daoName: string;
	daoDescription: string;
	logo: File | string;
	//step 2
	tokenName: string;
	tokenSymbol: string;
	tokenRecipients: ITokenRecipients[];

	//step 3
	timeToVote: ITimeToVote;
	proposalThreshold: number;
	quorumFraction: number;
}

export interface ITokenRecipients {
	address: Address | string;
	amount: number;
}

export interface ITimeToVote {
	days: number;
	hours: number;
	minutes: number;
}
