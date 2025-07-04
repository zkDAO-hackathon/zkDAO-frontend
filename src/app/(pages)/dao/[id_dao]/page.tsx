"use client";
import Assets from "@/app/components/DashboardDAO/Assets";
import ContractInfo from "@/app/components/DashboardDAO/ContractInfo";
import HeroDAO from "@/app/components/DashboardDAO/HeroDAO";
// import Members from "@/app/components/DashboardDAO/Members";
import ModalDelegateTokens from "@/app/components/DashboardDAO/ModalDelegateTokens";
import Proposals from "@/app/components/DashboardDAO/Proposals";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dao } from "@/app/modals/index";

import { useEffect, useState, unstable_ViewTransition as ViewTransition } from "react";
import { IoMdPaper } from "react-icons/io";
import { useStore } from "@/app/store";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { NETWORKS_BY_CHAIN_ID } from "@/app/config/const";
import Breadcrumbs from "@/app/components/Breadcrumbs";

const DashboardPage = () => {
	const { getDao } = useStore();
	const { id_dao } = useParams();
	const [daoFront, setDaoFront] = useState<Dao | null>(null);
	const { chainId } = useAccount();

	useEffect(() => {
		getDao(Number(id_dao)).then((dao) => {
			if (!dao) {
				console.error("DAO not found");
				return;
			}
			console.log("DAO fetched:", dao);
			setDaoFront(dao);
		});
	}, [id_dao, getDao]);

	if (!daoFront) {
		return (
			<main className='flex items-center justify-center h-screen'>
				<div className='text-center flex flex-col items-center justify-center'>
					<span className='loading loading-infinity loading-xl'></span>
					<h1 className='text-2xl font-bold mb-4'>Loading DAO...</h1>
					<p className='text-gray-600'>Please wait while we fetch the DAO details.</p>
				</div>
			</main>
		);
	}

	return (
		<main>
			<ViewTransition name='page-dao'>
				<div className='container mx-auto p-4'>
					<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
					<Breadcrumbs
						items={[
							{ label: "Dashboard", href: "/" },
							{ label: "DAO", href: `/dao/${id_dao}` },
						]}
					/>

					{/* Hero Section */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<HeroDAO
								name={daoFront?.name || "DAO Name"}
								description={
									daoFront?.description || "This is a sample DAO description. It can be updated with the actual DAO details."
								}
								logoUrl={daoFront?.logo || `https://ui-avatars.com/api/?rounded=true&name=${daoFront?.name || "DAO Name"}`}
								className='bg-white shadow-md rounded-2xl p-6 mb-6'
								numProposals={daoFront?.proposals.length}
								// numMembers={daoFront?.}
								// treasuryBalance={daoFront?.treasuryBalance || "0 ETH"}
							/>
							<div className='bg-white shadow-md rounded-2xl p-6 mb-6'>
								<div className='flex items-center gap-2 mb-4'>
									<div className='flex items-center justify-between w-full'>
										<div>
											<IoMdPaper className='text-4xl text-primary mb-2' />
											<h1 className='text-2xl font-bold'>Governance Proposals</h1>
										</div>
										<Link href={`${id_dao}/proposals`} className='btn btn-primary'>
											View All Proposals
										</Link>
									</div>
								</div>

								<small className='text-gray-600 mb-6'>
									Proposals are the backbone of DAO governance, allowing members to suggest changes, vote on initiatives, and shape
									the future of the organization. Here you can view active and closed proposals, as well as create new ones.
								</small>
								{daoFront?.proposals.length === 0 ? (
									<div className='text-center text-gray-500'>
										<p>No proposals found for this DAO.</p>
										<p className='mt-2'>Start by creating a new proposal!</p>
									</div>
								) : (
									<Proposals id_dao={id_dao as string} proposals={daoFront.proposals} />
								)}
							</div>
						</div>
						<div>
							<ContractInfo
								chain={NETWORKS_BY_CHAIN_ID[chainId ?? 1]} // Fallback to chain ID 1 if undefined
								daoAddress={(daoFront?.token.toString() as Address) || "0x00000@0000000000000000000"}
								launchedDate={(daoFront?.createdAt as Date) || new Date()}
							/>
							<Assets />
							{/* <Members /> */}
							<ModalDelegateTokens />
						</div>
					</div>
				</div>
			</ViewTransition>
		</main>
	);
};

export default DashboardPage;
