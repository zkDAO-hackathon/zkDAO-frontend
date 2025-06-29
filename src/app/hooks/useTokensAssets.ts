import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Address } from "viem";
import { TOKENS } from "@/app/services/blockchain/contracts/tokens";
import { ERC20TokenService } from "@/app/services/blockchain/ERC20TokenService";

type TokenDisplay = {
  symbol: string;
  formatted: string;
  icon?: string;
};

export function useTokenAssets() {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [balances, setBalances] = useState<TokenDisplay[]>([]);
  const [network, setNetwork] = useState<keyof typeof TOKENS | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAssets = async () => {
    if (!address || !chainId || !walletClient) return;

    const chainName = NETWORKS_BY_CHAIN_ID[chainId];
    setNetwork(chainName);

    const service = new ERC20TokenService(chainName, walletClient);

    const tokenKeys = Object.keys(TOKENS[chainName]);

    const results: TokenDisplay[] = [];

    for (const tokenKey of tokenKeys) {
      const info = await service.getTokenInfo(tokenKey, address as Address);
      if (info) {
        results.push({
          symbol: info.symbol,
          formatted: info.formatted,
          icon: TOKENS[chainName][
            tokenKey as keyof (typeof TOKENS)[typeof chainName]
          ].icon,
        });
      }
    }

    setBalances(results);
    setLoading(false);
  };

  useEffect(() => {
    loadAssets();
  }, [address, chainId, walletClient]);

  return {
    address,
    network,
    balances,
    loading,
    refetch: loadAssets,
  };
}
