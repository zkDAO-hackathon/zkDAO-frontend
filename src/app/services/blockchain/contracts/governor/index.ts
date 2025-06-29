import {
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
  formatEther,
} from "viem";
import { GOVERNON_JSON, ZKDAO_JSON } from "@/app/config/const";
import { Proposal, ProposalDto, ProposalStruct, Tally } from "@/app/modals";
import { avalancheFuji, sepolia } from "viem/chains";

export class GovernorContract {
  private address: Address;
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: WalletClient | null;

  constructor(network: string, address: Address, walletClient?: WalletClient) {
    this.publicClient = createPublicClient({
      chain: network === "sepolia" ? sepolia : avalancheFuji,
      transport: http(
        network === "sepolia"
          ? "https://eth-sepolia.g.alchemy.com/v2/UmqgPqCsA4TgEqnMvObDS"
          : "https://avax-fuji.g.alchemy.com/v2/UmqgPqCsA4TgEqnMvObDS"
      ),
    });

    this.walletClient = walletClient ?? null;
    this.address = address;
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  private getReadContract() {
    return getContract({
      address: this.address,
      abi: GOVERNON_JSON.abi,
      client: {
        public: this.publicClient,
      },
    });
  }

  private getWriteContract() {
    if (!this.walletClient) {
      throw new Error("walletClient not set. Call setWalletClient() first.");
    }

    return getContract({
      address: this.address,
      abi: ZKDAO_JSON.abi,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    });
  }

  // =========================
  //        READ METHODS
  // =========================

  async getProposalCounter(): Promise<number> {
    try {
      const contract = this.getReadContract();
      const dto = (await contract.read.getProposalCounter()) as bigint;
      return Number(dto);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  async getProposal(id: number): Promise<Proposal | null> {
    try {
      const contract = this.getReadContract();
      const proposal = (await contract.read.getProposal([
        BigInt(id),
      ])) as ProposalStruct;

      const cidPromise = contract.read.getCid([
        BigInt(proposal.id),
      ]) as Promise<string>;

      const zkVotesPromise = contract.read.getZKVote([
        BigInt(proposal.id),
      ]) as Promise<bigint[]>;

      const statePromise = contract.read.state([
        BigInt(proposal.id),
      ]) as Promise<number>;

      const timeForVotingPromise = contract.read.timeLeft([
        BigInt(proposal.id),
      ]) as Promise<bigint>;

      const [cid, zkVotes, state, timeForVoting] = await Promise.all([
        cidPromise,
        zkVotesPromise,
        statePromise,
        timeForVotingPromise,
      ]);

      const dto = {
        ...proposal,
        cid,
        zkVotes,
        state,
        timeForVoting,
      };

      return mapProposalDtoToProposal(dto);
    } catch (error) {
      console.error("❌", error);
      return null;
    }
  }

  async getProposals(): Promise<Proposal[]> {
    try {
      const counter = await this.getProposalCounter();

      const proposalPromises = [];
      for (let i = 1; i <= counter; i++) {
        const proposalPromise = this.getProposal(i);
        proposalPromises.push(proposalPromise);
      }

      const proposals = await Promise.all(proposalPromises);
      const filteredProposals = proposals.filter(
        (proposal): proposal is Proposal => proposal !== null
      );

      return filteredProposals;
    } catch (error) {
      console.error("❌", error);
      return [];
    }
  }
  // =========================
  //        WRITE METHODS
  // =========================
}

function mapProposalDtoToProposal(dto: ProposalDto): Proposal {
  return {
    id: Number(dto.id),
    proposalNumber: Number(dto.proposalNumber),
    createdAt: new Date(Number(dto.createdAt) * 1000),
    proposer: dto.proposer,
    description: dto.description,
    cid: dto.cid,
    state: dto.state,
    timeForVoting: new Date(Number(dto.timeForVoting) * 1000),
    tally: mapZkVotesToTally(dto.zkVotes),
  };
}

function mapZkVotesToTally(dto: bigint[]): Tally {
  return {
    againstVotes: formatEther(dto[0]),
    forVotes: formatEther(dto[1]),
    abstainVotes: formatEther(dto[2]),
  };
}
