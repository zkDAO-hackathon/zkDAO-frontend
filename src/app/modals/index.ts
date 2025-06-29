import { Address, Hex } from "viem";

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

export interface Dao {
  id: number;
  createdAt: Date;
  creator: Address;
  token: Address;
  timelock: Address;
  governor: Address;
  name: string;
  description: string;
  logo: string;
  proposals: Proposal[];
}

export interface ProposalStruct {
  id: bigint;
  proposalNumber: bigint;
  createdAt: bigint;
  proposer: Address;
  description: string;
}

export interface ProposalDto {
  id: bigint;
  proposalNumber: bigint;
  createdAt: bigint;
  proposer: Address;
  description: string;
  cid: string;
  zkVotes: bigint[];
  state: number;
  timeForVoting: bigint;
}

export interface Proposal {
  id: number;
  proposalNumber: number;
  createdAt: Date;
  proposer: Address;
  description: string;
  cid: string;
  state: number;
  timeForVoting: Date;
  tally: Tally;
}

export interface TallyStruct {
  againstVotes: bigint;
  forVotes: bigint;
  abstainVotes: bigint;
}

export interface Tally {
  againstVotes: string;
  forVotes: string;
  abstainVotes: string;
}

export interface CheckUpkeep {
  upkeepNeeded: boolean;
  performData: Hex;
}
