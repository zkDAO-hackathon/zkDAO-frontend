import { Address } from "viem";

export interface IProposal {
	// title?: string;
	description: string;
	proposer?: Address;
	// state?: ProposalState;
	// encodedFunctionData?: string;
	// targets: Address[];
	// values: bigint[];
	amount?: bigint;
}

export enum ProposalState {
	Pending,
	Active,
	Canceled,
	Defeated,
	Succeeded,
	Queued,
	Expired,
	Executed,
}
