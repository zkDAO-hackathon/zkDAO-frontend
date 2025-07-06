import Link from "next/link";
import CardProposals from "./CardProposals";
import { Proposal } from "@/app/modals";
import Image from "next/image";
import SVG404V4 from "@/app/assets/404-v4.svg";

interface ProposalsProps {
	id_dao?: string;
	proposals: Proposal[];
}
const Proposals = ({ id_dao, proposals }: ProposalsProps) => {
	return (
		<div className='flex flex-col py-4'>
			<div className='tabs tabs-lift'>
				<input type='radio' name='proposal_tabs' className='tab ' aria-label='Success proposals' defaultChecked />
				<div className='tab-content bg-base-100 p-4'>
					{proposals.filter((p) => p.state === 3).length === 0 ? (
						<>
							<Image src={SVG404V4} alt='No proposals found' width={200} height={200} className='mx-auto mb-4' />
							<h3 className='text-xl font-bold mb-2 text-center'>No Success Proposals</h3>
						</>
					) : (
						<div className='flex flex-col gap-4 h-96 overflow-y-auto'>
							{proposals
								.filter((p) => p.state === 3)
								.map((proposal, index) => (
									<div key={index}>
										<Link href={`/dao/${id_dao}/proposals/${proposal.proposalNumber}`} key={proposal.id} className='no-underline'>
											<CardProposals
												key={proposal.id}
												status={proposal.state.toString()}
												name={proposal.id.toString()}
												description={proposal.description}
												by={proposal.proposer}
												timePublished={proposal.createdAt.toString()}
												timeLeft={
													proposal?.timeForVoting instanceof Date
														? proposal.timeForVoting.getTime()
														: proposal?.timeForVoting
												}
											/>
										</Link>
									</div>
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
