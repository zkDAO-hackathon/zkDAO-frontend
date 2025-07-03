"use client";
import { CardDAOProps } from "@/app/types/card-dao.types";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaCoins } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";

const CardDAO = (props: CardDAOProps) => {
	const { daoName, daoDescription, daoLogo, daoId, token, creator, createdAt } = props;

	const formattedDate = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "N/A";

	return (
		<ViewTransition name='page-dao'>
			<Link href={`/dao/${daoId || daoName}`} className='block w-full'>
				<div className='card bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full rounded-2xl'>
					<div className='card-body p-6'>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-4'>
								<div className='relative w-12 h-12 overflow-hidden rounded-full ring-2 ring-primary/20'>
									<Image
										src={daoLogo || `https://ui-avatars.com/api/?rounded=true&name=${daoName}`}
										alt={`${daoName} logo`}
										fill
										className='object-cover'
										sizes='48px'
										onError={(e) => {
											e.currentTarget.src = `https://ui-avatars.com/api/?rounded=true&name=${daoName}`;
										}}
									/>
								</div>
								<div>
									<h2 className='card-title text-xl font-bold'>{daoName}</h2>
									{createdAt && <p className='text-xs text-gray-400'>Created {formattedDate}</p>}
								</div>
							</div>
							<div className='bg-primary/10 rounded-full px-3 py-1 text-xs font-semibold text-primary'>DAO</div>
						</div>

						<p className='text-sm text-gray-600 line-clamp-3 mb-4'>{daoDescription}</p>

						<div className='grid grid-cols-2 gap-2 text-xs text-gray-500 mt-auto'>
							<div className='flex flex-col'>
								<span className='font-medium'>
									<FaRegUser className='inline mr-1' />
									Creator
								</span>

								<span className='truncate'>{`${creator.substring(0, 6)}…${creator.substring(creator.length - 4)}`}</span>
							</div>
							<div className='flex flex-col'>
								<span className='font-medium'>
									<FaCoins className='inline mr-1' />
									Token
								</span>
								<span className='truncate'>{`${token.substring(0, 6)}…${token.substring(token.length - 4)}`}</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</ViewTransition>
	);
};

export default CardDAO;
