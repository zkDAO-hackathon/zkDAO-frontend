import { Address, Hex, WalletClient, createPublicClient, getContract, http } from "viem";
import { ZKDAO_JSON } from "@/app/config/const";
import { CheckUpkeep, Dao, DaoStruct } from "@/app/modals";
import { avalancheFuji, sepolia } from "viem/chains";
import { GovernorContract } from "../governor";
import { GovernorParams, GovernorTokenParams } from "@/app/types/form.dao.types";

export class ZkDaoContract {
	private network: string;
	private publicClient: ReturnType<typeof createPublicClient>;
	private walletClient: WalletClient | null;

	constructor(network: string, walletClient?: WalletClient) {
		this.publicClient = createPublicClient({
			chain: network === "sepolia" ? sepolia : avalancheFuji,
			transport: http(
				network === "sepolia"
					? "https://eth-sepolia.g.alchemy.com/v2/UmqgPqCsA4TgEqnMvObDS"
					: "https://avax-fuji.g.alchemy.com/v2/UmqgPqCsA4TgEqnMvObDS"
			),
		});

		this.network = network;
		this.walletClient = walletClient ?? null;
	}

	setWalletClient(walletClient: WalletClient) {
		this.walletClient = walletClient;
	}

	private getReadContract() {
		return getContract({
			address: ZKDAO_JSON.address as Address,
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
			address: ZKDAO_JSON.address as Address,
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

	async checkUpkeep(): Promise<CheckUpkeep | null> {
		try {
			const contract = this.getReadContract();
			const checkUpkeep = (await contract.read.checkUpkeep([""])) as [boolean, Hex];

			return {
				upkeepNeeded: checkUpkeep[0],
				performData: checkUpkeep[1],
			};
		} catch (error) {
			console.error("❌", error);
			return null;
		}
	}

	async getDaoCounter(): Promise<number> {
		try {
			const contract = this.getReadContract();
			const dto = (await contract.read.getDaoCounter()) as bigint;
			return Number(dto);
		} catch (error) {
			console.error("❌", error);
			return 0;
		}
	}

	async getDao(id: number): Promise<Dao | null> {
		try {
			const contract = this.getReadContract();
			const dto = (await contract.read.getDao([BigInt(id)])) as DaoStruct;

			const governor = new GovernorContract(this.network, dto.governor);
			const proposals = await governor.getProposals();
			const dao = mapDaoStructToDao(dto);

			return {
				...dao,
				proposals,
			};
		} catch (error) {
			console.error("❌", error);
			return null;
		}
	}

	async getDaos(): Promise<Dao[]> {
		try {
			const counter = await this.getDaoCounter();

			const daoPromises = [];
			for (let i = 1; i <= counter; i++) {
				const daoPromise = this.getDao(i);
				daoPromises.push(daoPromise);
			}

			const daos = await Promise.all(daoPromises);
			return daos.filter((dao): dao is Dao => dao !== null);
		} catch (error) {
			console.error("❌", error);
			return [];
		}
	}
	// =========================
	//        WRITE METHODS
	// =========================

	async createDao(
		governorTokenParams: GovernorTokenParams,
		governor_params: GovernorParams,
		to: Address[],
		amounts: bigint[],
		price: bigint
	): Promise<boolean> {
		try {
			if (!this.walletClient) {
				throw new Error("walletClient not set. Call setWalletClient() first.");
			}

			const account = this.walletClient.account;
			if (!account) {
				throw new Error("Wallet account not found. Make sure the wallet is connected.");
			}
			const zkContract = getContract({
				address: ZKDAO_JSON.address as Address,
				abi: ZKDAO_JSON.abi,
				client: {
					public: this.publicClient,
					wallet: this.walletClient,
				},
			});

			const createDaoTx = await zkContract.write.payForDaoCreation([governorTokenParams, 0, governor_params, to, amounts, price], {
				account,
				chain: this.publicClient.chain,
			});

			const tx = await this.publicClient.waitForTransactionReceipt({
				hash: createDaoTx,
			});

			if (tx.status !== "success") {
				throw new Error("Transaction failed");
			}
			console.log("✅ DAO created successfully:", tx);
			return true;
		} catch (error) {
			console.error("❌", error);
			throw new Error(`Failed to create DAO: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
}

function mapDaoStructToDao(dto: DaoStruct): Dao {
	return {
		id: Number(dto.id),
		createdAt: new Date(Number(dto.createdAt) * 1000),
		creator: dto.creator,
		token: dto.token,
		timelock: dto.timelock,
		governor: dto.governor,
		name: dto.name,
		description: dto.description,
		logo: dto.logo,
		proposals: [],
	};
}
