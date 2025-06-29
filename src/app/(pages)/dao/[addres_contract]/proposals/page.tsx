"use client";
import Proposals from "@/app/components/DashboardDAO/Proposals";
import { FaPlusCircle } from "react-icons/fa";
import { openModal } from "@/app/helpers/actions.modal";
import FormCreateProposal from "@/app/components/FormCreateProposal";

const ProposalPage = () => {
	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='flex flex-col space-y-6'>
				{/* Header section */}
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
						<h2 className='text-xl font-bold mb-4'>Active Proposals</h2>
						<Proposals proposals={[]} />
					</div>

					{/* Stats card */}
					<div className='card bg-white shadow-xl p-6'>
						<h2 className='text-xl font-bold mb-4'>Proposal Statistics</h2>
						<div className='grid grid-cols-2 gap-4'>
							{[
								{ label: "Total", value: "2" },
								{ label: "Types", value: "All" },
								{ label: "Executed", value: "4" },
								{ label: "Most recent", value: "2" },
							].map((item, index) => (
								<div key={index} className='bg-base-200 rounded-lg p-4 flex flex-col'>
									<span className='text-sm text-gray-500 font-medium'>{item.label}</span>
									<span className='text-xl font-bold mt-1'>{item.value}</span>
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
