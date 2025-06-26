interface ProposalsProps {
	proposals: {
		id: string;
		title: string;
		description: string;
		status: "active" | "closed";
		createdAt: string;
		votesFor: number;
		votesAgainst: number;
	}[];
}
const Proposals = ({ proposals }: ProposalsProps) => {
	return (
		<div className='flex flex-col p-4'>
			<h1 className='text-2xl font-bold mb-4'>Governance Proposals</h1>

			<div className='tabs tabs-bordered mt-6'>
				<input type='radio' name='proposal_tabs' className='tab' aria-label='Active proposals' defaultChecked />
				<div className='tab-content p-4'>
					{proposals.filter((p) => p.status === "active").length === 0 ? (
						<p className='text-gray-600'>No active proposals available.</p>
					) : (
						<div className='grid gap-4 md:grid-cols-2'>
							{proposals
								.filter((p) => p.status === "active")
								.map((proposal) => (
									<div key={proposal.id} className='card bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow'>
										<div className='flex justify-between items-start'>
											<h2 className='font-bold text-lg'>{proposal.title}</h2>
											<span className='badge badge-success'>Active</span>
										</div>
										<p className='my-3 text-gray-700 line-clamp-3'>{proposal.description}</p>
										<div className='text-sm text-gray-500'>Created: {new Date(proposal.createdAt).toLocaleDateString()}</div>
										<div className='mt-3'>
											<div className='flex justify-between mb-1 text-sm font-medium'>
												<span>For: {proposal.votesFor}</span>
												<span>Against: {proposal.votesAgainst}</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2.5'>
												<div
													className='bg-green-600 h-2.5 rounded-full'
													style={{
														width: `${(
															(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) *
															100
														).toFixed(0)}%`,
													}}></div>
											</div>
										</div>
										<button className='mt-4 w-full btn btn-sm btn-outline'>View details</button>
									</div>
								))}
						</div>
					)}
				</div>

				<input type='radio' name='proposal_tabs' className='tab' aria-label='Closed proposals' />
				<div className='tab-content p-4'>
					{proposals.filter((p) => p.status === "closed").length === 0 ? (
						<p className='text-gray-600'>No closed proposals available.</p>
					) : (
						<div className='grid gap-4 md:grid-cols-2'>
							{proposals
								.filter((p) => p.status === "closed")
								.map((proposal) => (
									<div key={proposal.id} className='card bg-white shadow-md rounded-2xl p-6'>
										<div className='flex justify-between items-start'>
											<h2 className='font-bold text-lg'>{proposal.title}</h2>
											<span className='badge badge-neutral'>Closed</span>
										</div>
										<p className='my-3 text-gray-700'>{proposal.description}</p>
										<div className='mt-3'>
											<div className='flex justify-between mb-1'>
												<span>For: {proposal.votesFor}</span>
												<span>Against: {proposal.votesAgainst}</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2.5'>
												<div
													className={`h-2.5 rounded-full ${
														proposal.votesFor > proposal.votesAgainst ? "bg-green-600" : "bg-red-600"
													}`}
													style={{
														width: `${(
															(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) *
															100
														).toFixed(0)}%`,
													}}></div>
											</div>
										</div>
									</div>
								))}
						</div>
					)}
				</div>

				<input type='radio' name='proposal_tabs' className='tab' aria-label='Create proposal' />
				<div className='tab-content p-4'>
					<div className='max-w-lg mx-auto bg-white rounded-xl shadow-md p-6'>
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
				</div>
			</div>
		</div>
	);
};

export default Proposals;
