"use client";
import Proposals from "@/app/components/DashboardDAO/Proposals/ProposalsAll";
import { FaPlusCircle } from "react-icons/fa";
import { openModal } from "@/app/helpers/actions.modal";
import FormCreateProposal from "@/app/components/FormCreateProposal";
import { useStore } from "@/app/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Proposal } from "@/app/modals/index";

import { MdOutlineRecentActors } from "react-icons/md";
import { FaDatabase } from "react-icons/fa6";
import { LuHexagon } from "react-icons/lu";
import Breadcrumbs from "@/app/components/Breadcrumbs";

const ProposalPage = () => {
	const { getDao } = useStore();
	const { id_dao } = useParams();

	const [proposals, setProposals] = useState([] as Proposal[]);

	useEffect(() => {
		if (id_dao) {
			getDao(Number(id_dao)).then((dao) => {
				if (dao) {
					setProposals(dao.proposals || []);
				}
			});
		}
	}, [id_dao, getDao]);
	if (proposals.length === 0) {
		return (
			<>
				<div className='container mx-auto px-4 py-6'>
					<div className='flex flex-col items-center justify-center h-full'>
						<Breadcrumbs
							items={[
								{ label: "DAOs", href: "/" },
								{ label: `DAO #${id_dao}`, href: `/dao/${id_dao}` },
								{ label: "Proposals", href: `/dao/${id_dao}/proposals` },
							]}
						/>
						<h1 className='text-2xl font-bold mb-4'>No Proposals Available</h1>
						<p className='text-gray-600'>Create your first proposal to get started.</p>
						<button className='btn btn-primary mt-4' onClick={() => openModal("form-create-proposal")}>
							<FaPlusCircle />
							Create Proposal
						</button>
					</div>
				</div>
				<FormCreateProposal />
			</>
		);
	}

	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='flex flex-col space-y-6'>
				{/* Header section */}
				<Breadcrumbs
					items={[
						{ label: "DAOs", href: "/" },
						{ label: `DAO #${id_dao}`, href: `/dao/${id_dao}` },
						{ label: "Proposals", href: `/dao/${id_dao}/proposals` },
					]}
				/>
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
					<h1 className='text-2xl font-bold'>Proposals</h1>
					<button className='btn btn-primary flex items-center gap-2' onClick={() => openModal("form-create-proposal")}>
						<FaPlusCircle />
						Create Proposal
					</button>
				</div>

				{/* Content section */}
				<section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Proposals list */}
					<div className='card bg-white shadow-xl p-6'>
						<h2 className='text-xl font-bold mb-4'>All Proposals</h2>
						<Proposals proposals={proposals} id_dao={id_dao as string} />
					</div>

					{/* Stats card */}
					<div className='card bg-white shadow-xl p-6'>
						<h2 className='text-xl font-bold mb-4'>Proposal Statistics</h2>
						<div className='grid grid-cols-2 gap-4'>
							{[
								{
									label: "Total Proposals",
									value: proposals.length || "0",
									icon: <FaDatabase className='text-2xl text-primary' />,
								},
								{
									label: "Pending",
									value: proposals.filter((p) => p.state === 0).length || "0",
									icon: <LuHexagon className='text-2xl text-gray-400' />,
								},
								{
									label: "Active",
									value: proposals.filter((p) => p.state === 1).length || "0",
									icon: <LuHexagon className='text-2xl text-blue-500' />,
								},
								{
									label: "Defeated",
									value: proposals.filter((p) => p.state === 2).length || "0",
									icon: <LuHexagon className='text-2xl text-red-500' />,
								},
								{
									label: "Succeeded",
									value: proposals.filter((p) => p.state === 3).length || "0",
									icon: <LuHexagon className='text-2xl text-secondary' />,
								},
								{
									label: "Queued",
									value: proposals.filter((p) => p.state === 4).length || "0",
									icon: <LuHexagon className='text-2xl text-yellow-500' />,
								},
								{
									label: "Expired",
									value: proposals.filter((p) => p.state === 5).length || "0",
									icon: <LuHexagon className='text-2xl text-orange-400' />,
								},
								{
									label: "Executed",
									value: proposals.filter((p) => p.state === 6).length || "0",
									icon: <LuHexagon className='text-2xl text-success' />,
								},
								{
									label: "Canceled",
									value: proposals.filter((p) => p.state === 7).length || "0",
									icon: <LuHexagon className='text-2xl text-red-700' />,
								},
								{
									label: "Most Recent",
									value: proposals.length > 0 ? `#${proposals[0].id}` : "N/A",
									icon: <MdOutlineRecentActors className='text-2xl text-info' />,
								},
							].map((item, index) => (
								<div key={index} className='rounded-2xl border border-gray-200 p-4 flex flex-col hover:shadow-md transition-shadow'>
									<div className='flex items-center gap-3 mb-2'>
										<div className='p-2 bg-base-100 rounded-full'>{item.icon}</div>
										<span className='text-lg font-semibold'>{item.value}</span>
									</div>
									<span className='text-sm text-gray-600'>{item.label}</span>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>

			{/* Form modal */}
			<FormCreateProposal />
		</div>
	);
};
export default ProposalPage;
