import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, avalancheFuji } from "@reown/appkit/networks";

export const projectId = process.env.NEXT_PROJECT_ID;

if (!projectId) {
	throw new Error("Project ID is not defined");
}

export const networks = [sepolia, avalancheFuji];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	projectId,
	networks,
});

export const config = wagmiAdapter.wagmiConfig;
