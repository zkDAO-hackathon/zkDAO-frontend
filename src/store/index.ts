import { create } from "zustand";
import { WalletClient } from "viem";
import { Dao } from "@/app/modals";
import { ZkDaoContract } from "@/app/services/blockchain/contracts/zk-dao.ts";

type Store = {
  network: string;
  dao: Dao | null;
  daos: Dao[];
  fetchingDaos: boolean;
  zkDao: ZkDaoContract;
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
    dao: null,
    daos: [],
    fetchingDaos: false,
    zkDao,
    getDao: async (daoId: number) => {
      const dao = await zkDao.getDao(daoId);
      if (dao) {
        set({ dao });
        return dao;
      }
      return null;
    },
    getDaos: async () => {
      set({ fetchingDaos: true });
      const daos = await zkDao.getDaos();
      set({ daos, fetchingDaos: false });
      return daos;
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
