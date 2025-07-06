import { TbListDetails } from "react-icons/tb";

import { FaToolbox, FaUserLarge } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { ProposalState } from "@/app/types/proposal.type";

interface DetailsDaoProposalProps {
	id: string;
	proposedBy: string;
	publishedAt: string;
	status: string;
	description?: string;
	cid: string;
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

const DetailsDaoProposal = ({ id, proposedBy, publishedAt, status, description, cid }: DetailsDaoProposalProps) => {
	const currentState = statusToState[status];
	return (
		<div className='bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300'>
			<h1 className='text-2xl font-bold mb-6 text-gray-800 flex items-center'>
				<TbListDetails className='mr-3 text-indigo-500 text-3xl' />
				Proposal Details
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
				<div className='flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all hover:transform hover:scale-[1.01]'>
					<span className='text-gray-500 font-medium flex items-center'>
						<CiStar className='mr-2 text-indigo-500 text-xl' />
						ID
					</span>
					<span className='font-semibold text-gray-800 truncate'>{id}</span>
				</div>

				<div className='flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all hover:transform hover:scale-[1.01]'>
					<span className='text-gray-500 font-medium flex items-center'>
						<FaUserLarge className='mr-2 text-indigo-500 text-xl' />
						Proposed By
					</span>
					<span className='font-semibold text-gray-800 truncate'>{proposedBy}</span>
				</div>

				<div className='flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all hover:transform hover:scale-[1.01]'>
					<span className='text-gray-500 font-medium flex items-center'>
						<MdOutlineAccessTimeFilled className='mr-2 text-indigo-500 text-xl' />
						Published
					</span>
					<span className='font-semibold text-gray-800'>{publishedAt}</span>
				</div>

				<div className='flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all hover:transform hover:scale-[1.01]'>
					<span className='text-gray-500 font-medium flex items-center'>
						<IoHelpCircleOutline className='mr-2 text-indigo-500 text-xl' />
						Status
					</span>
					<span
						className={`font-semibold px-3 py-1.5 rounded-full text-white inline-block w-fit ${
							currentState === ProposalState.Active
								? "bg-green-500"
								: currentState === ProposalState.Pending
								? "bg-yellow-500"
								: currentState === ProposalState.Succeeded
								? "bg-blue-500"
								: currentState === ProposalState.Executed
								? "bg-purple-500"
								: "bg-gray-500"
						}`}>
						{ProposalState[currentState]}
					</span>
				</div>

				{description && (
					<div className='flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all col-span-1 md:col-span-2'>
						<span className='text-gray-500 font-medium flex items-center'>
							<TbListDetails className='mr-2 text-indigo-500 text-xl' />
							Description
						</span>
						<p className='font-medium text-gray-800 leading-relaxed'>{description}</p>
					</div>
				)}

				{cid && (
					<div className='flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all col-span-1 md:col-span-2'>
						<span className='text-gray-500 font-medium flex items-center'>
							<FaToolbox className='mr-2 text-indigo-500 text-xl' />
							CID
						</span>
						<p className='font-medium text-gray-800 leading-relaxed'>{cid}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DetailsDaoProposal;
