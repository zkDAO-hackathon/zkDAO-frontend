import { ProposalState } from "@/app/types/proposal.type";
interface CardProposalsProps {
	status: number | string;
	name: string;
	description: string;
	by: string;
	timePublished: string;
}

// Map status strings to enum values
const statusToState: Record<string, ProposalState> = {
	0: ProposalState.Pending,
	1: ProposalState.Active,
	2: ProposalState.Defeated,
	3: ProposalState.Succeeded,
	4: ProposalState.Queued,
	5: ProposalState.Expired,
	6: ProposalState.Executed,
	7: ProposalState.Canceled,
};

const CardProposals = ({ status, name, description, by, timePublished }: CardProposalsProps) => {
	// Get the enum value from the status string
	const currentState = statusToState[status];

	return (
		<div className='card bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300'>
			<div className='flex justify-between items-start mb-3'>
				<h2 className='font-bold text-lg text-gray-800'>{name}</h2>
				<div className='flex items-center gap-2 text-sm text-white badge badge-neutral px-3 py-1.5'>
					<div className='inline-grid *:[grid-area:1/1]'>
						<div
							className={`status ${
								[ProposalState.Active, ProposalState.Succeeded, ProposalState.Executed].includes(currentState)
									? "status-success"
									: currentState === ProposalState.Pending
									? "status-warning"
									: "status-secondary"
							} animate-ping opacity-70`}></div>
						<div
							className={`status ${
								[ProposalState.Active, ProposalState.Succeeded, ProposalState.Executed].includes(currentState)
									? "status-success"
									: currentState === ProposalState.Pending
									? "status-warning"
									: "status-secondary"
							}`}></div>
					</div>
					<span aria-label={`Proposal status: ${ProposalState[currentState]}`}>{ProposalState[currentState]}</span>
				</div>
			</div>

			<p className='my-3 text-gray-700 line-clamp-3'>{description}</p>
			<div className='mt-4 flex flex-col space-y-3 text-gray-500'>
				<div className='font-medium'>
					By: <span className='text-gray-700'>{`${by.substring(0, 6)}…${by.substring(by.length - 4)}`}</span>
				</div>
				<div>
					Published:{" "}
					{new Date(timePublished).toLocaleString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</div>
			</div>
		</div>
	);
};

export default CardProposals;
