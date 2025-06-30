import { TbListDetails } from "react-icons/tb";

import { FaUserLarge } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { ProposalState } from "@/app/types/proposal.type";

interface DetailsDaoProposalProps {
	id: string;
	proposedBy: string;
	publishedAt: string;
	status: string;
}
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

const DetailsDaoProposal = ({ id, proposedBy, publishedAt, status }: DetailsDaoProposalProps) => {
	const currentState = statusToState[status];
	return (
		<div className='bg-white rounded-2xl shadow-sm p-6 h-96'>
			<h1 className='text-2xl font-bold mb-6'>
				<TbListDetails className='inline-block mr-2' aria-hidden='true' />
				Proposal Details
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='flex flex-col gap-1 card bg-gray-50 p-4 rounded-2xl shadow-sm'>
					<span className='text-gray-600 text-lg flex items-center'>
						<CiStar className='mr-2' aria-hidden='true' />
						ID
					</span>
					<span className='font-medium truncate'>{id}</span>
				</div>
				<div className='flex flex-col gap-1 card bg-gray-50 p-4 rounded-2xl shadow-sm'>
					<span className='text-gray-600 text-lg flex items-center'>
						<FaUserLarge className='mr-2' aria-hidden='true' />
						Proposed By
					</span>
					<span className='font-medium truncate'>{proposedBy}</span>
				</div>
				<div className='flex flex-col gap-1 card bg-gray-50 p-4 rounded-2xl shadow-sm'>
					<span className='text-gray-600 text-lg flex items-center'>
						<MdOutlineAccessTimeFilled className='mr-2' aria-hidden='true' />
						Published
					</span>
					<span className='font-medium'>{publishedAt}</span>
				</div>
				<div className='flex flex-col gap-1 card bg-gray-50 p-4 rounded-2xl shadow-sm'>
					<span className='text-gray-600 text-lg flex items-center'>
						<IoHelpCircleOutline className='mr-2' aria-hidden='true' />
						Status
					</span>
					<span className='font-medium badge badge-neutral px-3 py-1.5'>{ProposalState[currentState]}</span>
				</div>
			</div>
		</div>
	);
};

export default DetailsDaoProposal;
