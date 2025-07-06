import { create } from "zustand";
import { WalletClient } from "viem";
import { CheckUpkeep, Dao, Proposal } from "@/app/modals";
import { ZkDaoContract } from "@/app/services/blockchain/contracts/zk-dao.ts";

type Store = {
	network: string;
	checkUpkeep: CheckUpkeep | null;
	fetchingCheckUpkeep: boolean;
	dao: Dao | null;
	daos: Dao[];
	fetchingDaos: boolean;
	queuedProposals: Proposal[];
	zkDao: ZkDaoContract;
	getCheckUpkeep: () => Promise<CheckUpkeep | null>;
	getDao: (daoId: number) => Promise<Dao | null>;
	getDaos: () => Promise<Dao[]>;
	setWalletClient: (walletClient: WalletClient) => void;
	setNetwork: (network: string) => void;
};

export const useStore = create<Store>((set) => {
	const network = "sepolia"; // Default network
	const zkDao = new ZkDaoContract(network);

	return {
		network,
		checkUpkeep: null,
		fetchingCheckUpkeep: true,
		dao: null,
		daos: [],
		fetchingDaos: true,
		queuedProposals: [],
		zkDao,
		getCheckUpkeep: async () => {
			set({ fetchingCheckUpkeep: true });
			const upkeep = await zkDao.checkUpkeep();
			set({ checkUpkeep: upkeep, fetchingCheckUpkeep: false });
			return upkeep;
		},
		getDao: async (daoId: number) => {
			const dao = await zkDao.getDao(daoId);
			if (dao) {
				const queuedProposals = dao.proposals.filter((proposal) => proposal.timeForVoting > new Date()) || [];
				set({ dao, queuedProposals });
				return dao;
			}
			return null;
		},
		getDaos: async () => {
			set({ fetchingDaos: true });

			try {
				const [daos, quotesProposalWithTimeLeft] = await Promise.all([zkDao.getDaos(), zkDao.getQueueWithTimeLeftFunction()]);

				let queuedProposals: Proposal[] = [];

				if (daos.length > 0) {
					const allProposals = daos.flatMap((dao: Dao) => dao.proposals);

					// Filtrar y actualizar los proposals que están en cola con su timeDelay
					queuedProposals = allProposals
						.filter((proposal) => quotesProposalWithTimeLeft.some((q) => q.proposalId === proposal.id))
						.map((proposal) => {
							const queueItem = quotesProposalWithTimeLeft.find((q) => q.proposalId === proposal.id);
							return {
								...proposal,
								timeDelay: queueItem?.timeLeft ? Number(queueItem.timeLeft) : undefined,
							};
						});

					console.log("✅ Propuestas en cola:", queuedProposals);

					set({ daos, fetchingDaos: false, queuedProposals });
					return daos;
				}

				set({ fetchingDaos: false });
				return daos;
			} catch (error) {
				console.error("❌ Error obteniendo DAOs:", error);
				set({ fetchingDaos: false });
				return [];
			}
		},
		setWalletClient: (walletClient: WalletClient) => {
			zkDao.setWalletClient(walletClient);
			set({ zkDao });
		},
		setNetwork: (network: string) => {
			set({ network });
		},
	};
});
