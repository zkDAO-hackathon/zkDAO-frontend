"use client";
import Image from "next/image";
import { IoMdPaper } from "react-icons/io";
import { HiMiniUserGroup } from "react-icons/hi2";
import { PiTreasureChestFill } from "react-icons/pi";

interface HeroDAOProps {
	name: string;
	description: string;
	logoUrl: string;
	className?: string;
}

const HeroDAO = ({ name, description, logoUrl, className = "" }: HeroDAOProps) => {
	return (
		<section className={` ${className}`}>
			<div className='flex flex-col md:flex-row items-start md:items-center gap-6 bg-white shadow-md rounded-2xl p-6'>
				<div className='flex-shrink-0'>
					<Image
						src={logoUrl}
						alt={`${name} logo`}
						width={80}
						height={80}
						className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
						onError={(e) => {
							e.currentTarget.src = "https://via.placeholder.com/80?text=DAO";
						}}
					/>
				</div>

				<div className='flex-1'>
					<h1 className='text-3xl font-bold mb-2'>{name}</h1>
					<div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
						<p className='text-gray-600 mb-4 line-clamp-2 overflow-hidden text-ellipsis max-w-full'>{description}</p>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
				{[
					{ icon: <IoMdPaper className='text-blue-500 text-3xl' />, title: "Proposals", value: "0" },
					{ icon: <HiMiniUserGroup className='text-green-500 text-3xl' />, title: "Members", value: "0" },
					{ icon: <PiTreasureChestFill className='text-amber-500 text-3xl' />, title: "Treasury", value: "0 ETH" },
				].map((item, index) => (
					<div
						key={index}
						className='bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl p-6 flex flex-col gap-3'>
						<div className='bg-gray-50 rounded-full p-3 w-fit'>{item.icon}</div>
						<h2 className='text-lg font-semibold'>{item.title}</h2>
						<p className='text-gray-500 text-xl font-medium'>{item.value}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default HeroDAO;
