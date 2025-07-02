import { PiPuzzlePieceFill } from "react-icons/pi";
import { useTokenAssets } from "@/app/hooks/useTokensAssets";
import Image from "next/image";
import { FaWallet } from "react-icons/fa";
import { openModal } from "@/app/helpers/actions.modal";

const Assets = () => {
	const { network, balances, loading } = useTokenAssets();
	const handleDelegateClick = () => {
		openModal("delegate-modal");
	};
	return (
		<div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300'>
			<div className='flex justify-between'>
				<div className='flex items-center gap-3 mb-4'>
					<PiPuzzlePieceFill className='text-3xl text-primary' />
					<h1 className='text-2xl font-bold'>DAO Assets</h1>
				</div>
				<button className='btn btn-primary mb-4' onClick={handleDelegateClick}>
					<FaWallet className='inline mr-2' />
					Delegate
				</button>
			</div>

			{network ? (
				<>
					<div className='flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg w-fit'>
						<span className='text-gray-500'>Network:</span>
						<span className='font-semibold'>{network}</span>
					</div>

					{loading ? (
						<div className='animate-pulse space-y-2 mt-3'>
							<div className='h-8 bg-gray-200 rounded'></div>
							<div className='h-8 bg-gray-200 rounded w-3/4'></div>
							<div className='h-8 bg-gray-200 rounded w-1/2'></div>
						</div>
					) : balances.length > 0 ? (
						<ul className='space-y-2 mt-3'>
							{balances.map((b) => (
								<li
									key={b.symbol}
									className='flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
									<div className='flex items-center gap-2'>
										<Image src={b.icon as string} width={24} height={24} alt={b.symbol} className='rounded-full' />
										<span className='text-gray-700'>{b.symbol}</span>
									</div>
									<span className='font-semibold'>{b.formatted}</span>
								</li>
							))}
						</ul>
					) : (
						<div className='p-4 bg-gray-50 rounded-lg text-gray-500 text-center mt-3'>No assets found for this wallet.</div>
					)}
				</>
			) : (
				<div className='p-4 bg-gray-50 rounded-lg text-gray-500 text-center'>No compatible network detected.</div>
			)}
		</div>
	);
};

export default Assets;
