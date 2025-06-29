import Link from "next/link";
import CardProposals from "./CardProposals";

interface ProposalsProps {
	proposals: {
		id: string;
		title: string;
		description: string;
		status: "active" | "closed";
		createdAt: string;
		votesFor: number;
		votesAgainst: number;
		daoId: string;
	}[];
}
const Proposals = ({ proposals }: ProposalsProps) => {
	return (
		<div className='flex flex-col'>
			<div className='tabs tabs-bordered'>
				<input type='radio' name='proposal_tabs' className='tab' aria-label='Active proposals' defaultChecked />
				<div className='tab-content'>
					{proposals.filter((p) => p.status === "active").length === 0 ? (
						<p className='text-gray-600'>No active proposals available.</p>
					) : (
						<div className='flex flex-col gap-4'>
							{proposals
								.filter((p) => p.status === "active")
								.map((proposal) => (
									<>
										<Link href={`/dao/${proposal.daoId}/proposals/${proposal.id}`} key={proposal.id} className='no-underline'>
											<CardProposals
												key={proposal.id}
												status={proposal.status}
												name={proposal.title}
												description={proposal.description}
												by={`Created by DAO on ${new Date(proposal.createdAt).toLocaleDateString()}`}
												timePublished={proposal.createdAt}
											/>
										</Link>
									</>
								))}
						</div>
					)}
				</div>

				{/* <input type='radio' name='proposal_tabs' className='tab' aria-label='Closed proposals' />
				<div className='tab-content'>
					{proposals.filter((p) => p.status === "closed").length === 0 ? (
						<p className='text-gray-600'>No closed proposals available.</p>
					) : (
						<div className='flex flex-col gap-4'>
							{proposals
								.filter((p) => p.status === "closed")
								.map((proposal) => (
									<CardProposals
										key={proposal.id}
										status={proposal.status}
										name={proposal.title}
										description={proposal.description}
										by={`Created by DAO on ${new Date(proposal.createdAt).toLocaleDateString()}`}
										timePublished={proposal.createdAt}
									/>
								))}
						</div>
					)}
				</div> */}

				{/* <input type='radio' name='proposal_tabs' className='tab' aria-label='Create proposal' />
				<div className='tab-content'>
					<div className=' mx-auto bg-white rounded-xl shadow-md p-6'>
						<h3 className='font-bold text-xl mb-4'>Create New Proposal</h3>
						<form className='space-y-4'>
							<div>
								<label className='block text-sm font-medium'>Title</label>
								<input type='text' className='mt-1 block w-full rounded-md border p-2' placeholder='Enter proposal title' />
							</div>
							<div>
								<label className='block text-sm font-medium'>Description</label>
								<textarea
									className='mt-1 block w-full rounded-md border p-2'
									rows={4}
									placeholder='Describe your proposal'></textarea>
							</div>
							<button type='button' className='btn btn-primary'>
								Submit Proposal
							</button>
						</form>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Proposals;
