import { RiContractLine } from "react-icons/ri";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { PiCubeDuotone } from "react-icons/pi";
import { MdDateRange } from "react-icons/md";

interface ContractInfoProps {
	chain: string;
	daoAddress: string;
	launchedDate: string;
}

const ContractInfo = ({ chain, daoAddress, launchedDate }: ContractInfoProps) => {
	return (
		<div className='card bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300'>
			<div className='flex items-center gap-3 mb-5'>
				<RiContractLine className='text-2xl text-primary' />
				<h2 className='text-xl font-bold'>Contract Information</h2>
			</div>

			<div className='space-y-5'>
				<div className='flex flex-col'>
					<div className='flex items-center gap-2 mb-1'>
						<HiMiniCubeTransparent className='text-xl text-gray-500' />
						<label className='text-sm font-bold text-gray-500'>Chain</label>
					</div>
					<p className='text-gray-800 font-semibold ml-7'>{chain}</p>
				</div>

				<div className='flex flex-col'>
					<div className='flex items-center gap-2 mb-1'>
						<PiCubeDuotone className='text-xl text-gray-500' />
						<label className='text-sm font-bold text-gray-500'>DAO Address</label>
					</div>
					<a
						href={`https://${chain === "Ethereum" ? "etherscan.io" : `${chain.toLowerCase()}.etherscan.io`}/address/${daoAddress}`}
						target='_blank'
						rel='noopener noreferrer'
						className='ml-7 font-semibold text-primary hover:text-primary-dark'>
						{`${daoAddress.substring(0, 6)}…${daoAddress.substring(daoAddress.length - 4)}`}
					</a>
				</div>

				<div className='flex flex-col'>
					<div className='flex items-center gap-2 mb-1'>
						<MdDateRange className='text-xl text-gray-500' />
						<label className='text-sm font-bold text-gray-500'>Launched Date</label>
					</div>
					<p className='text-gray-800 font-semibold ml-7'>{launchedDate}</p>
				</div>
			</div>
		</div>
	);
};

export default ContractInfo;
