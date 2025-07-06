"use client";

import { useAccount } from "wagmi";
import ExplorerDAOS from "./components/ExplorerDAOS";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useStore } from "@/app/store";
import { useEffect } from "react";
import Image from "next/image";
import ZKDAO_LOGO from "@/app/assets/zkDAOLogo.svg";

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	// if (fetchingDaos && fetchingCheckUpkeep) return <div>Loading DAOs...</div>;

	if (daos.length !== 0) console.log("DAOs:", daos, "Queued Proposals:", queuedProposals, "Check Upkeep:", checkUpkeep);

	return (
		<>
			<Navbar />
			{fetchingDaos && fetchingCheckUpkeep ? (
				// skeleton loading
				<div className='flex items-center justify-center h-screen flex-col space-y-4'>
					<Image src={ZKDAO_LOGO} alt='zkDAO Logo' width={100} height={100} className='animate-pulse' />
					{/* <span className='loading loading-infinity loading-xl'></span> */}
					<span>Loading Daos...</span>
				</div>
			) : (
				<ExplorerDAOS />
			)}

			<Footer />
		</>
	);
}
