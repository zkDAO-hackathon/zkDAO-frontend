interface CardProposalsProps {
	status: "active" | "closed";
	name: string;
	description: string;
	by: string;
	timePublished: string;
}

const CardProposals = ({ status, name, description, by, timePublished }: CardProposalsProps) => {
	return (
		<div className='card bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow'>
			<div className='flex justify-between items-start'>
				<h2 className='font-bold text-lg'>{name}</h2>
				<div className='flex items-center gap-2 text-sm text-white badge badge-neutral'>
					<div className='inline-grid *:[grid-area:1/1]'>
						<div className={`status ${status === "active" ? "status-success" : "status-secondary"} animate-ping`}></div>
						<div className={`status ${status === "active" ? "status-success" : "status-secondary"}`}></div>
					</div>
					<span>{status === "active" ? "Active" : "Closed"}</span>
				</div>
			</div>
			<p className='my-3 text-gray-700 line-clamp-3'>{description}</p>
			<div className='text-sm text-gray-500'>By: {by}</div>
			<div className='text-sm text-gray-500'>Published: {new Date(timePublished).toLocaleDateString()}</div>
			{/* <button className='mt-4 w-full btn btn-sm btn-outline'>View details</button> */}
		</div>
	);
};

export default CardProposals;
