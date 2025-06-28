import { PiPuzzlePieceFill } from "react-icons/pi";

const Assets = () => {
	return (
		<div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300'>
			<div className='flex items-center gap-2 mb-4'>
				<PiPuzzlePieceFill className='text-3xl text-primary' />
				<h1 className='text-2xl font-bold'>DAO Assets</h1>
			</div>

			<p className='text-gray-600'>This section will display the assets associated with the DAO.</p>
			{/* Placeholder for assets content */}
			<div className='bg-white p-4 rounded shadow'>
				<p>Assets content will be displayed here.</p>
			</div>
		</div>
	);
};
export default Assets;
