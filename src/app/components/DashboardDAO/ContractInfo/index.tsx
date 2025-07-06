import { RiContractLine } from "react-icons/ri";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { PiCubeDuotone } from "react-icons/pi";
import { MdDateRange } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";

interface ContractInfoProps {
	chain: string;
	daoAddress: string;
	launchedDate: string | Date;
}

const blockchainExplorerUrl = (chain: string, address: string) => {
	if (chain === "sepolia") {
		return `https://sepolia.etherscan.io/address/${address}`;
	} else if (chain === "fuji") {
		return `https://testnet.snowtrace.io/address/${address}`;
	} else {
		return `https://sepolia.etherscan.io/address/${address}`;
	}
};

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
					<div className='flex items-center ml-7 gap-2'>
						<a
							href={blockchainExplorerUrl(chain, daoAddress)}
							target='_blank'
							rel='noopener noreferrer'
							className='font-semibold text-primary hover:text-primary-dark flex items-center'>
							{`${daoAddress.substring(0, 6)}…${daoAddress.substring(daoAddress.length - 4)}`}
							<FaShare className='inline ml-1 text-gray-500 hover:text-gray-700 transition-colors duration-200' />
						</a>
						<button
							onClick={() => {
								navigator.clipboard.writeText(daoAddress);
								const btn = document.activeElement as HTMLButtonElement;
								const originalTitle = btn.title;
								btn.title = "Copied!";
								setTimeout(() => {
									btn.title = originalTitle;
								}, 1500);
							}}
							className='p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200'
							title='Copy address'>
							<FaCopy size={14} />
						</button>
					</div>
				</div>

				<div className='flex flex-col'>
					<div className='flex items-center gap-2 mb-1'>
						<MdDateRange className='text-xl text-gray-500' />
						<label className='text-sm font-bold text-gray-500'>Launched Date</label>
					</div>
					<p className='text-gray-800 font-semibold ml-7'>{new Date(launchedDate).toLocaleDateString()}</p>
				</div>
			</div>
		</div>
	);
};

export default ContractInfo;
