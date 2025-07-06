"use client";

import { useAccount } from "wagmi";
import ExplorerDAOS from "./components/ExplorerDAOS";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useStore } from "@/app/store";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function Home() {
	const { chainId } = useAccount();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { checkUpkeep, fetchingCheckUpkeep, daos, fetchingDaos, queuedProposals, getCheckUpkeep, getDaos, setNetwork } = useStore();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [upkeepHistory, setUpkeepHistory] = useState([false, false]);

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const res = await getCheckUpkeep();
				console.log("Polling Check Upkeep:", res);

				// Extract the condition from the response
				const currentCondition = res?.performData !== "0x" && !res?.upkeepNeeded;

				setUpkeepHistory((prevHistory) => {
					const newHistory = [prevHistory[1], currentCondition];

					// Check if we should trigger confetti
					if (newHistory[0] === true && newHistory[1] === false) {
						confetti({
							particleCount: 200,
							spread: 100,
							origin: { y: 0.6 },
						});
					}

					return newHistory;
				});
			} catch (err) {
				console.error("Error al hacer polling", err);
			}
		}, 5000); // cada 5 segundos

		return () => clearInterval(interval);
	}, [getCheckUpkeep]);

	useEffect(() => {
		// Set default network if no wallet is connected
		const network = chainId ? (chainId === 11155111 ? "sepolia" : "fuji") : "sepolia";
		setNetwork(network);

		const fetchData = async () => {
			if (daos.length === 0) {
				await Promise.all([getDaos()]);
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
