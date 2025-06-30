"use client";

import { useAccount } from "wagmi";
import ExplorerDAOS from "./components/ExplorerDAOS";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useStore } from "@/app/store";
import { useEffect } from "react";

export default function Home() {
	const { chainId } = useAccount();
	const { checkUpkeep, fetchingCheckUpkeep, daos, fetchingDaos, queuedProposals, getCheckUpkeep, getDaos, setNetwork } = useStore();

	useEffect(() => {
		const fetchData = async () => {
			if (daos.length === 0) {
				await Promise.all([getCheckUpkeep(), getDaos()]);
			}
		};

		if (chainId) {
			setNetwork(chainId === 11155111 ? "sepolia" : "fuji");
			fetchData();
		}
	}, [chainId]);

	if (fetchingDaos && fetchingCheckUpkeep) return <div>Loading DAOs...</div>;

	if (daos.length !== 0) console.log("DAOs:", daos, "Queued Proposals:", queuedProposals, "Check Upkeep:", checkUpkeep);

	return (
		<>
			<Navbar />

			<ExplorerDAOS />
			<Footer />
		</>
	);
}
