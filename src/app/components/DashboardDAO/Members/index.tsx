import { BlockieOptions } from "ethereum-blockies";
// import { useAccount } from "wagmi";
import Blockies from "react-blockies";
import { FaWallet } from "react-icons/fa6";
import { openModal } from "@/app/helpers/actions.modal";

const Members = () => {
	// Unused but kept for future use
	// const { address } = useAccount();

	const accounts = [
		{
			address: "0x993351f1315d5123231FDFe0020f106FC460E14E",
			name: "Alice",
			role: "Member",
			blockie: {
				seed: "0x993351f1315d5123231FDFe0020f106FC460E14E",
				size: 8,
				scale: 4,
			} as BlockieOptions,
		},
		{
			address: "0x1234567890abcdef1234567890abcdef12345678",
			name: "Bob",
			role: "Admin",
			blockie: {
				seed: "0x1234567890abcdef1234567890abcdef12345678",
				size: 8,
				scale: 4,
			} as BlockieOptions,
		},
	];

	const handleDelegateClick = () => {
		openModal("delegate-modal");
	};

	return (
		<div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 mt-6'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-2xl font-bold'>Members</h2>
				<button className='btn btn-primary mb-4' onClick={handleDelegateClick}>
					<FaWallet className='inline mr-2' />
					Delegate
				</button>
			</div>
			<p className='text-gray-600'>List of members in the DAO.</p>
			<div className='mt-4'>
				{accounts.length > 0 ? (
					<ul className='space-y-3'>
						{accounts.map((account) => (
							<li
								key={account.address}
								className='flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300'>
								<div className='flex items-center gap-3'>
									<Blockies seed={account.blockie.seed as string} size={account.blockie.size} scale={account.blockie.scale} />
									<div>
										<h3 className='text-lg font-semibold'>{account.name}</h3>
										<p className='text-sm text-gray-500'>{account.role}</p>
									</div>
								</div>
								<span className='text-sm text-gray-700'>{account.address}</span>
							</li>
						))}
					</ul>
				) : (
					<p className='text-gray-500'>No members found.</p>
				)}
			</div>
		</div>
	);
};
export default Members;
