import {
	Address,
	WalletClient,
	createPublicClient,
	getContract,
	http,
	formatEther,
	erc20Abi,
	encodeFunctionData,
	keccak256,
	toBytes,
	recoverPublicKey,
	getAddress,
	parseEther,
} from "viem";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GOVERNON_JSON, ZKDAO_JSON, GOVERNOR_TOKEN_JSON, CCIP_BNM_TOKEN, FACTORY, AMOUNT, LINK_TOKEN } from "@/app/config/const";
import { DaoStruct, Proposal, ProposalDto, ProposalStruct, Tally } from "@/app/modals";
import { avalancheFuji, sepolia } from "viem/chains";
import { LINK_ADDRESS } from "@/app/config/const";
import { MerkleProofAPIClient } from "@/app/services/http/merkle-proof";
// import { CircuitAPIClient } from "@/app/services/http/circuit-proof";

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
	private getReadContractZKDAO() {
		return getContract({
			address: this.address,
			abi: ZKDAO_JSON.abi,
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

	async getFee(account: Address, token: Address, amount: number): Promise<bigint> {
		try {
			const contract = this.getReadContractZKDAO();
			const fee = (await contract.read.getCcipFee([account, token, BigInt(amount)])) as bigint;
			return fee;
		} catch (error) {
			console.error("❌", error);
			return BigInt(0);
		}
	}

	async hasVoted(account: Address, proposalId: bigint): Promise<boolean> {
		try {
			const contract = this.getReadContract();
			const hasVoted = (await contract.read.getNullifierUsedByAddress([proposalId, account])) as boolean;
			return hasVoted;
		} catch (error) {
			console.error("❌", error);
			return false;
		}
	}

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
			const proposal = (await contract.read.getProposal([BigInt(id)])) as ProposalStruct;

			const cidPromise = contract.read.getCid([BigInt(proposal.id)]) as Promise<string>;

			const zkVotesPromise = contract.read.getZKVote([BigInt(proposal.id)]) as Promise<bigint[]>;

			const statePromise = contract.read.state([BigInt(proposal.id)]) as Promise<number>;

			const timeForVotingPromise = contract.read.timeLeft([BigInt(proposal.id)]) as Promise<bigint>;

			const [cid, zkVotes, state, timeForVoting] = await Promise.all([cidPromise, zkVotesPromise, statePromise, timeForVotingPromise]);

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
			const filteredProposals = proposals.filter((proposal): proposal is Proposal => proposal !== null);

			return filteredProposals;
		} catch (error) {
			console.error("❌", error);
			return [];
		}
	}
	// =========================
	//        WRITE METHODS
	// =========================

	async createProposal(proposer: Address, description: string, amount: bigint): Promise<boolean> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}

			const zkDAO = getContract({
				address: ZKDAO_JSON.address as `0x${string}`,
				abi: ZKDAO_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});
			const daoCounter = await zkDAO.read.getDaoCounter();
			const dao = (await zkDAO.read.getDao([daoCounter])) as DaoStruct;

			const tokenGovernor = getContract({
				address: dao.token,
				abi: GOVERNOR_TOKEN_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});
			const governor = getContract({
				address: dao.governor,
				abi: GOVERNON_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});
			const AMOUNT = parseEther(amount.toString());
			const targets = [getAddress(tokenGovernor.address)];
			const values = [BigInt(0)];

			const mintCallData = encodeFunctionData({
				abi: tokenGovernor.abi,
				functionName: "mintBatch",
				args: [[proposer], [AMOUNT]],
			});

			const calldatas = [mintCallData];
			const description = `Transfer 1 token (1000000000000000000 in wei) of the CCIP-BnM Token from the Treasury to the Governor Contract via CCIP, specifically to the Governor Contract on the Avalanche Fuji network as the destination chain.`;

			const proposeTx = await governor.write.propose([targets, values, calldatas, description], { account });

			const receipt = await this.publicClient.waitForTransactionReceipt({ hash: proposeTx });

			if (receipt.status !== "success") {
				throw new Error(`Transaction failed with status: ${receipt.status}`);
			}

			return true;
		} catch (error) {
			throw error instanceof Error ? error : new Error("Unknown error");
		}
	}

	async castVoteZK(proposalId: string | number, option: 0 | 1 | 2): Promise<void> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}

			const merkleProofAPI = new MerkleProofAPIClient();
			// const circuitAPIClient = new CircuitAPIClient();

			const zkDAO = getContract({
				address: ZKDAO_JSON.address as `0x${string}`,
				abi: ZKDAO_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const daoCounter = await zkDAO.read.getDaoCounter();
			const dao = (await zkDAO.read.getDao([daoCounter])) as DaoStruct;

			const governor = getContract({
				address: dao.governor,
				abi: GOVERNON_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const proposalCounter = await governor.read.getProposalCounter();

			const proposal = (await governor.read.getProposal([proposalCounter])) as ProposalStruct;

			const hashedMessage = keccak256(toBytes(`Add ${this.address} to the DAO and give them ${AMOUNT} tokens`));

			// const proposalIdString = (proposal.id as string | number | bigint).toString();

			const signature = await this.walletClient.signMessage({
				message: { raw: hashedMessage },
				account: account,
			});

			const pubKey = await recoverPublicKey({
				signature,
				hash: hashedMessage,
			});

			const pubKeyBytes = pubKey.slice(2);
			const pubKeyX = pubKeyBytes.slice(0, 64);
			const pubKeyY = pubKeyBytes.slice(64, 128);

			function hexToByteArray(hex: string): number[] {
				return Array.from(Buffer.from(hex, "hex"));
			}
			const fullSigBytes = hexToByteArray(signature.slice(2));
			const sig64 = fullSigBytes.slice(0, 64);
			const ECDSA = {
				_pub_key_x: hexToByteArray(pubKeyX),
				_pub_key_y: hexToByteArray(pubKeyY),
				_signature: sig64,
				_hashed_message: hexToByteArray(hashedMessage.slice(2)),
			};

			const merkleProof = await merkleProofAPI.getMerkleProof(getAddress(dao.governor), proposalId.toString(), account.address);

			const response = await fetch("/api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					_proposalId: proposalId.toString(),
					_secret: merkleProof.secret,
					_voter: getAddress(account.address),
					_weight: merkleProof.weight.toString(),
					_choice: option,
					_snapshot_merkle_tree: merkleProof.snapshotMerkleTree,
					_leaf: merkleProof.leaf,
					_index: merkleProof.index.toString(),
					_path: merkleProof.path,
					...ECDSA,
				}),
			});
			const zkproof = await response.json();

			// const zkproof = await circuitAPIClient.generateZKProof({
			// 	_proposalId: proposalId.toString(),
			// 	_secret: merkleProof.secret,
			// 	_voter: getAddress(account.address),
			// 	_weight: merkleProof.weight.toString(),
			// 	_choice: option,
			// 	_snapshot_merkle_tree: merkleProof.snapshotMerkleTree,
			// 	_leaf: merkleProof.leaf,
			// 	_index: merkleProof.index.toString(),
			// 	_path: merkleProof.path,
			// 	...ECDSA,
			// });
			const castZKVoteTx = await governor.write.castZKVote([proposal.id, zkproof.proofBytes, zkproof.publicInputs], { account: account });

			await this.publicClient.waitForTransactionReceipt({
				hash: castZKVoteTx,
			});
		} catch (error) {
			throw new Error(`Failed to cast ZK vote: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	async quequeProposal(): Promise<void> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}

			const zkDAO = getContract({
				address: ZKDAO_JSON.address as `0x${string}`,
				abi: ZKDAO_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const daoCounter = await zkDAO.read.getDaoCounter();
			const dao = (await zkDAO.read.getDao([daoCounter])) as DaoStruct;
			const chain = this.publicClient.chain === sepolia ? "sepolia" : "fuji";

			const governor = getContract({
				address: dao.governor,
				abi: GOVERNON_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const proposalCounter = await governor.read.getProposalCounter();
			const proposal = (await governor.read.getProposal([proposalCounter])) as ProposalStruct;

			const targets = [dao.governor];
			const values = [BigInt(0)];

			const transferCallData = encodeFunctionData({
				abi: governor.abi,
				functionName: "transferCrosschainTreasury",
				args: [dao.governor, CCIP_BNM_TOKEN(chain), BigInt(AMOUNT)],
			});
			const calldatas = [transferCallData];
			console.log("amount", AMOUNT);
			const description = `Transfer 1 token (1000000000000000000 in wei) of the CCIP-BnM Token from the Treasury to the Governor Contract via CCIP, specifically to the Governor Contract on the Avalanche Fuji network as the destination chain.`;

			const descriptionHash = keccak256(toBytes(description));

			console.log("zkAddres", zkDAO.address);
			console.log("description", description);
			console.log("target", targets);
			console.log("values", values);
			console.log("calldatas", calldatas);
			console.log("descriptionHash", descriptionHash);

			const queueTx = await governor.write.queue([targets, values, calldatas, descriptionHash], { account });

			const txTransaction = await this.publicClient.waitForTransactionReceipt({
				hash: queueTx,
			});

			if (txTransaction.status !== "success") {
				throw new Error(`Transaction failed with status: ${txTransaction.status}`);
			}

			console.log(`✅ Queued proposal ${proposal.id}. tx hash: ${queueTx}`);
		} catch (error) {
			throw new Error(`Failed to queque proposal: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
	async execute(): Promise<Address> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}

			const zkDAO = getContract({
				address: ZKDAO_JSON.address as `0x${string}`,
				abi: ZKDAO_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const daoCounter = await zkDAO.read.getDaoCounter();
			const dao = (await zkDAO.read.getDao([daoCounter])) as DaoStruct;

			const governor = getContract({
				address: dao.governor,
				abi: GOVERNON_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});
			// const chain = this.publicClient.chain === sepolia ? "sepolia" : "fuji";
			// const proposalCounter = await governor.read.getProposalCounter();
			// const proposal = (await governor.read.getProposal([proposalCounter])) as ProposalStruct;

			const targets = [dao.governor];
			const values = [BigInt(0)];
			// const fee = await this.getFee(FACTORY, LINK_TOKEN(chain), Number(AMOUNT));
			// console.log("fee", fee);

			const chainName = this.publicClient.chain === sepolia ? "sepolia" : "avalancheFuji";
			const transferCallData = encodeFunctionData({
				abi: governor.abi,
				functionName: "transferCrosschainTreasury",
				args: [dao.governor, CCIP_BNM_TOKEN(chainName), BigInt(AMOUNT)],
			});
			const calldatas = [transferCallData];

			const description = `Transfer 1 token (1000000000000000000 in wei) of the CCIP-BnM Token from the Treasury to the Governor Contract via CCIP, specifically to the Governor Contract on the Avalanche Fuji network as the destination chain.`;
			const descriptionHash = keccak256(toBytes(description));
			console.log({
				targets: targets,
				values: values,
				// fee: fee,
				descriptionHash: descriptionHash,
			});

			const executeTx = await governor.write.execute([targets, values, calldatas, descriptionHash], { account });

			const txTransaction = await this.publicClient.waitForTransactionReceipt({
				hash: executeTx,
			});
			if (txTransaction.status !== "success") {
				throw new Error(`Transaction failed with status: ${txTransaction.status}`);
			}
			return executeTx;
		} catch (error) {
			throw new Error(`Failed to execute proposal: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	async delegateVotes(address: Address): Promise<void> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}

			const zkDAO = getContract({
				address: ZKDAO_JSON.address as `0x${string}`,
				abi: ZKDAO_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const daoCounter = await zkDAO.read.getDaoCounter();
			const dao = (await zkDAO.read.getDao([daoCounter])) as DaoStruct;

			// const governor = getContract({
			// 	address: dao.governor,
			// 	abi: GOVERNON_JSON.abi,
			// 	client: {
			// 		public: this.publicClient,
			// 		wallet: this.walletClient,
			// 	},
			// });

			const tokenGovernor = getContract({
				address: dao.token,
				abi: GOVERNOR_TOKEN_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const delegateTx = await tokenGovernor.write.delegate([address], { account });

			await this.publicClient.waitForTransactionReceipt({
				hash: delegateTx,
			});
		} catch (error) {
			console.error("❌", error);
			throw new Error(`Failed to delegate votes: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	async approveLink(amount: bigint, zkAddress: Address): Promise<boolean> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}

			const link_address = this.publicClient.chain === sepolia ? LINK_ADDRESS.sepolia : LINK_ADDRESS.fuji;

			const linkContract = getContract({
				address: link_address,
				abi: erc20Abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const approveTxHash = await linkContract.write.approve([zkAddress, amount], {
				account,
				chain: this.publicClient.chain,
			});

			const txResult = await this.publicClient.waitForTransactionReceipt({
				hash: approveTxHash,
			});
			if (!txResult.status) {
				throw new Error("Transaction failed");
			}
			return true;
		} catch (error) {
			throw new Error(`Failed to approve LINK: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
}

function mapProposalDtoToProposal(dto: ProposalDto): Proposal {
	console.log("Mapping Proposal DTO to Proposal:", dto);
	return {
		id: dto.id,
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
