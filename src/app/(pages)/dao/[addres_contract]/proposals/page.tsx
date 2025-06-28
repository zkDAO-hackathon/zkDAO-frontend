"use client";
import Proposals from "@/app/components/DashboardDAO/Proposals";
import { FaPlusCircle } from "react-icons/fa";
import { openModal } from "@/app/helpers/actions.modal";
import FormCreateProposal from "@/app/components/FormCreateProposal";

const ProposalPage = () => {
	return (
		<div className='flex flex-col items-center lg:items-start justify-center h-full'>
			<div className='justify-between w-full flex items-center'>
				<h1 className='text-2xl font-bold mb-4'>Proposals</h1>

				<button className='btn btn-primary mt-4 mb-6' onClick={() => openModal("form-create-proposal")}>
					<FaPlusCircle className='inline mr-2' />
					Create Proposal
				</button>
			</div>
			<section className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6'>
				<div>
					<FormCreateProposal />
					<Proposals proposals={[]} />
				</div>
				<div>
					<div className='card bg-base-100 shadow-xl p-8'>
						<h2 className='text-xl font-bold mb-4'>All proposals</h2>
						<div className='grid grid-cols-2 gap-4'>
							{[
								{ label: "Total", value: "2" },
								{ label: "Types", value: "All" },
								{ label: "Executed", value: "4" },
								{ label: "Most recent", value: "2" },
							].map((item, index) => (
								<div key={index} className='bg-base-200 rounded-lg p-3 flex flex-col'>
									<span className='text-sm text-gray-500 font-medium'>{item.label}</span>
									<span className='text-xl font-bold mt-1'>{item.value}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
export default ProposalPage;
