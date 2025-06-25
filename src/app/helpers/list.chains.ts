export const CHAINS = [
	{
		id: "1",
		name: "Ethereum Mainnet",
		symbol: "ETH",
		rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
		blockExplorerUrl: "https://etherscan.io",
		logo: "https://img.icons8.com/fluent/512/ethereum.png",
		isTesnet: false,
	},
	{
		id: "137",
		name: "Polygon",
		symbol: "MATIC",
		rpcUrl: "https://polygon-rpc.com",
		blockExplorerUrl: "https://polygonscan.com",
		logo: "https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo.png",
		isTesnet: false,
	},

	//avalanche
	{
		id: "43114",
		name: "Avalanche C-Chain",
		symbol: "AVAX",
		rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
		blockExplorerUrl: "https://snowtrace.io",
		logo: "https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png",
		isTesnet: false,
	},
	//avalanche testnet
	{
		id: "43113",
		name: "Avalanche Fuji Testnet",
		symbol: "AVAX",
		rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
		blockExplorerUrl: "https://testnet.snowtrace.io",
		logo: "https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png",
		isTesnet: true,
	},
];
