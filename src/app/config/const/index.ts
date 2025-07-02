import { avalancheFuji, sepolia } from "viem/chains";
import ZkDaoJson from "../../assets/json/contracts/ZKDAO.json";
import GovernorJson from "../../assets/json/contracts/Governor.json";
import GovernorTokenJson from "../../assets/json/contracts/GovernorToken.json";

export const TOKENS = {
	sepolia: {
		USDC: {
			symbol: "USDC",
			address: "0xf661043d9Bc1ef2169Ef90ad3b2285Cf8Bfc0AE2",
			icon: "https://d2f70xi62kby8n.cloudfront.net/tokens/usdc.webp",
		},
		CCIP_BNM: {
			symbol: "CCIP-BnM",
			address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
			icon: "https://d2f70xi62kby8n.cloudfront.net/tokens/ccip-lnm.webp",
		},
		CCIP_LNM: {
			symbol: "CCIP-LnM",
			address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
			icon: "https://d2f70xi62kby8n.cloudfront.net/tokens/ccip-lnm.webp",
		},
	},

	fuji: {
		USDC: {
			symbol: "USDC",
			address: "0x7bA2e5c37C4151d654Fcc4b41ffF3Fe693c23852",
			icon: "https://d2f70xi62kby8n.cloudfront.net/tokens/usdc.webp",
		},
		CCIP_BNM: {
			symbol: "CCIP-BnM",
			address: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
			icon: "https://d2f70xi62kby8n.cloudfront.net/tokens/ccip-lnm.webp",
		},
		CCIP_LNM: {
			symbol: "CCIP-LnM",
			address: "0x70F5c5C40b873EA597776DA2C21929A8282A3b35",
			icon: "https://d2f70xi62kby8n.cloudfront.net/tokens/ccip-lnm.webp",
		},
		MyToken: {
			symbol: "MTK",
			address: "0x5F7Df19eDEf1fF2B83bc263D1F6954B1bB46DF55",
			icon: "https://docs.chain.link/assets/chains/ethereum.svg",
		},
	},
};

export const NETWORKS_BY_CHAIN_ID: Record<number, keyof typeof TOKENS> = {
	11155111: "sepolia",
	43113: "fuji",
};

export const CHAINS = {
	sepolia,
	avalanche: avalancheFuji,
} as const;

export const LINK_ADDRESS = {
	sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
	avalanche: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
} as const;

export const RPCS = {
	sepolia: "https://eth-sepolia.g.alchemy.com/v2/UmqgPqCsA4TgEqnMvObDS",
	avalanche: "https://avax-fuji.g.alchemy.com/v2/UmqgPqCsA4TgEqnMvObDS",
};

export const ZKDAO_JSON = ZkDaoJson;
export const GOVERNON_JSON = GovernorJson;
export const GOVERNOR_TOKEN_JSON = GovernorTokenJson;
