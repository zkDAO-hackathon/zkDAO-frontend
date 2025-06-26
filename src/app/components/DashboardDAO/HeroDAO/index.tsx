"use client";

interface HeroDAOProps {
	name: string;
	description: string;
	logoUrl: string;
	className?: string;
}

const HeroDAO = ({ name, description, logoUrl, className = "" }: HeroDAOProps) => {
	return (
		<section className={` ${className}`}>
			<div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
				<div className='flex-shrink-0'>
					<img
						src={logoUrl}
						alt={`${name} logo`}
						className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
						onError={(e) => {
							e.currentTarget.src = "https://via.placeholder.com/80?text=DAO";
						}}
					/>
				</div>

				<div className='flex-1'>
					<h1 className='text-3xl font-bold mb-2'>{name}</h1>
					<p className='text-gray-600 mb-4'>{description}</p>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
				<div className='bg-white shadow-md rounded-lg p-4'>
					<h2 className='text-lg font-semibold'>Proposals</h2>
					<p className='text-gray-500'>0</p>
				</div>
				<div className='bg-white shadow-md rounded-lg p-4'>
					<h2 className='text-lg font-semibold'>Members</h2>
					<p className='text-gray-500'>0</p>
				</div>
				<div className='bg-white shadow-md rounded-lg p-4'>
					<h2 className='text-lg font-semibold'>Treasury</h2>
					<p className='text-gray-500'>0 ETH</p>
				</div>
			</div>
		</section>
	);
};

export default HeroDAO;
