import { FiBox } from "react-icons/fi";
import { FaUserLarge } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";

interface DetailsDaoProposalProps {
	onChainId: string;
	id: string;
	proposedBy: string;
	publishedAt: string;
	status: string;
}

const DetailsDaoProposal = ({ onChainId, id, proposedBy, publishedAt, status }: DetailsDaoProposalProps) => {
	return (
		<div className='bg-white rounded-2xl shadow-sm p-6 h-96'>
			<h1 className='text-2xl font-bold mb-6'>Proposal Details</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='flex flex-col gap-1'>
					<span className='text-gray-600 text-sm flex items-center'>
						<FiBox className='mr-2' aria-hidden='true' />
						Onchain ID
					</span>
					<span className='font-medium truncate'>{onChainId}</span>
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-gray-600 text-sm flex items-center'>
						<CiStar className='mr-2' aria-hidden='true' />
						ID
					</span>
					<span className='font-medium truncate'>{id}</span>
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-gray-600 text-sm flex items-center'>
						<FaUserLarge className='mr-2' aria-hidden='true' />
						Proposed By
					</span>
					<span className='font-medium truncate'>{proposedBy}</span>
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-gray-600 text-sm flex items-center'>
						<MdOutlineAccessTimeFilled className='mr-2' aria-hidden='true' />
						Published
					</span>
					<span className='font-medium'>{publishedAt}</span>
				</div>
				<div className='flex flex-col gap-1 md:col-span-2'>
					<span className='text-gray-600 text-sm flex items-center'>
						<IoHelpCircleOutline className='mr-2' aria-hidden='true' />
						Status
					</span>
					<span
						className={`font-medium ${
							status === "Active"
								? "text-green-600"
								: status === "Pending"
								? "text-yellow-600"
								: status === "Rejected"
								? "text-red-600"
								: status === "Executed"
								? "text-blue-600"
								: ""
						}`}>
						{status}
					</span>
				</div>
			</div>
		</div>
	);
};

export default DetailsDaoProposal;
