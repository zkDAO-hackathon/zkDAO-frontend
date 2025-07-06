import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Address } from "viem";
import { TOKENS } from "@/app/config/const";
import { ERC20TokenService } from "@/app/services/blockchain/ERC20TokenService";

const NETWORKS_BY_CHAIN_ID: Record<number, keyof typeof TOKENS> = {
	11155111: "sepolia",
	43113: "fuji",
};

type TokenDisplay = {
	symbol: string;
	formatted: string;
	icon?: string;
};

interface IUseTokens {
	addressDao: Address;
	defaultChainId?: number; // Nuevo parámetro opcional
}

export function useTokenAssets({ addressDao, defaultChainId = 11155111 }: IUseTokens) {
	const { address, chainId: connectedChainId } = useAccount();
	const { data: walletClient } = useWalletClient();

	const [balances, setBalances] = useState<TokenDisplay[]>([]);
	const [network, setNetwork] = useState<keyof typeof TOKENS | null>(null);
	const [loading, setLoading] = useState(false);

	// Usar chainId conectado o el valor por defecto
	const chainId = connectedChainId || defaultChainId;

	const loadAssets = async () => {
		if (!chainId) return;

		setLoading(true);
		const chainName = NETWORKS_BY_CHAIN_ID[chainId] || "sepolia";
		console.log("Loading assets for chain:", chainName);
		setNetwork(chainName);

		const service = new ERC20TokenService(chainName, walletClient);

		const tokenKeys = Object.keys(TOKENS[chainName]);
		const results: TokenDisplay[] = [];

		for (const tokenKey of tokenKeys) {
			const info = await service.getTokenInfo(tokenKey, addressDao as Address);
			if (info) {
				results.push({
					symbol: info.symbol,
					formatted: info.formatted,
					icon: TOKENS[chainName][tokenKey as keyof (typeof TOKENS)[typeof chainName]].icon,
				});
			}
		}

		setBalances(results);
		setLoading(false);
	};

	useEffect(() => {
		loadAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, chainId, walletClient, addressDao]);

	return {
		address,
		network,
		balances,
		loading,
		refetch: loadAssets,
	};
}
