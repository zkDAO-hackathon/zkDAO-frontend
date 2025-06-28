"use client";

import { wagmiAdapter, projectId } from "@/app/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { avalancheFuji, sepolia } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
	throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
	name: "zkDao",
	description: "",
	url: "https://appkitexampleapp.com",
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
export const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [sepolia, avalancheFuji],

	metadata: metadata,
	features: {
		analytics: false,
	},
	themeMode: "dark",
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
	const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}

export default ContextProvider;
