import { Address } from "viem";

export interface IProposal {
	title?: string;
	description: string;
	state?: ProposalState;
	encodedFunctionData?: string;
	targets: Address[];
	values: bigint[];
}

enum ProposalState {
	Pending,
	Active,
	Canceled,
	Defeated,
	Succeeded,
	Queued,
	Expired,
	Executed,
}
