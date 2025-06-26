interface ContractInfoProps {
	chain: string;
	daoAddress: string;
	launchedDate: string;
}

const ContractInfo = ({ chain, daoAddress, launchedDate }: ContractInfoProps) => {
	return (
		<div className='card bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300'>
			<h2 className='text-xl font-bold mb-4'>Contract Information</h2>

			<div className='space-y-4'>
				<div className='flex flex-col'>
					<label className='text-md font-bold text-gray-500'>Chain</label>
					<p className='text-gray-800 font-semibold'>{chain}</p>
				</div>

				<div className='flex flex-col'>
					<div className='flex justify-between items-center'>
						<label className='text-md font-bold text-gray-500'>DAO Address</label>
					</div>
					<a href='' className=' font-semibold underline text-primary'>{`${daoAddress.substring(0, 6)}…${daoAddress.substring(
						daoAddress.length - 4
					)}`}</a>
				</div>

				<div className='flex flex-col'>
					<label className='text-md font-bold text-gray-500'>Launched Date</label>
					<p className='text-gray-800 font-semibold'>{launchedDate}</p>
				</div>
			</div>
		</div>
	);
};

export default ContractInfo;
