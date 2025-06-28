interface DetailsDaoProposalProps {
	onChainId: string;
	id: string;
	proposedBy: string;
	publishedAt: string;
	status: string;
}

const DetailsDaoProposal = ({ onChainId, id, proposedBy, publishedAt, status }: DetailsDaoProposalProps) => {
	return (
		<div className='bg-white rounded-2xl shadow-sm p-6'>
			<h1 className='text-2xl font-bold mb-4'>Proposal Details</h1>
			<div className='grid grid-cols-2 gap-4'>
				<div className='flex flex-col'>
					<span className='text-gray-600 text-sm'>Onchain ID</span>
					<span className='font-medium'>{onChainId}</span>
				</div>
				<div className='flex flex-col'>
					<span className='text-gray-600 text-sm'>ID</span>
					<span className='font-medium'>{id}</span>
				</div>
				<div className='flex flex-col'>
					<span className='text-gray-600 text-sm'>Proposed By</span>
					<span className='font-medium'>{proposedBy}</span>
				</div>
				<div className='flex flex-col'></div>
				<span className='text-gray-600 text-sm'>Published</span>
				<span className='font-medium'>{publishedAt}</span>
			</div>
			<div className='flex flex-col'>
				<span className='text-gray-600 text-sm'>Status</span>
				<span className={`font-medium ${status === "Active" ? "text-green-600" : ""}`}>{status}</span>
			</div>
		</div>
	);
};

export default DetailsDaoProposal;
