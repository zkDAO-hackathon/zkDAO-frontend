"use client";

import { useAccount } from "wagmi";
import ExplorerDAOS from "./components/ExplorerDAOS";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useStore } from "@/app/store";
import { useEffect } from "react";

export default function Home() {
	const { chainId } = useAccount();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { checkUpkeep, fetchingCheckUpkeep, daos, fetchingDaos, queuedProposals, getCheckUpkeep, getDaos, setNetwork } = useStore();

	useEffect(() => {
		// Set default network if no wallet is connected
		const network = chainId ? (chainId === 11155111 ? "sepolia" : "fuji") : "sepolia";
		setNetwork(network);

		const fetchData = async () => {
			if (daos.length === 0) {
				await Promise.all([getCheckUpkeep(), getDaos()]);
			}
		};

		fetchData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	// if (daos.length !== 0) console.log("DAOs:", daos, "Queued Proposals:", queuedProposals, "Check Upkeep:", checkUpkeep);

	return (
		<>
			<Navbar />
			<ExplorerDAOS />
			<Footer />
		</>
	);
}
