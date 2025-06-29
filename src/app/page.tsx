"use client";

import { useAccount } from "wagmi";
import ExplorerDAOS from "./components/ExplorerDAOS";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useStore } from "@/store";
import { useEffect } from "react";

export default function Home() {
  const { chainId } = useAccount();
  const { daos, fetchingDaos, getDaos, setNetwork } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      if (daos.length === 0) {
        await getDaos();
      }
    };

    if (chainId) {
      setNetwork(chainId === 11155111 ? "sepolia" : "fuji");
      fetchData();
    }
  }, [chainId]);

  if (fetchingDaos) return <div>Loading DAOs...</div>;

  if (daos.length !== 0) console.log("DAOs:", daos);

  return (
    <>
      <Navbar />
      <ExplorerDAOS />
      <Footer />
    </>
  );
}
