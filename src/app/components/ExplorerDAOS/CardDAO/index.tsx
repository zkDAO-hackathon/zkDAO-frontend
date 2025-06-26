"use client";
import { CardDAOProps } from "@/app/types/card-dao.types";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
const CardDAO = (props: CardDAOProps) => {
	return (
		<Link href={`/dao/${props.daoId || props.daoName}`} className='block w-full'>
			<ViewTransition name='page-dao'>
				<div className='card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full'>
					<div className='card-body p-6'>
						<div className='flex items-center gap-4 mb-3'>
							<div className='relative w-12 h-12 overflow-hidden rounded-full ring-2 ring-primary/20'>
								<Image
									src={props.daoLogo || `https://ui-avatars.com/api/?rounded=true&name=${props.daoName}`}
									alt={`${props.daoName} logo`}
									fill
									className='object-cover'
									sizes='48px'
								/>
							</div>
							<h2 className='card-title text-xl font-bold'>{props.daoName}</h2>
						</div>
						{props.daoAddresses && props.daoAddresses.length > 0 && (
							<p className='text-sm text-gray-600 mb-2'>
								Address:{" "}
								<span className='font-semibold'>
									{props.daoAddresses[0].toString().slice(0, 6)}...
									{props.daoAddresses[0].toString().slice(-4)}
								</span>
							</p>
						)}
						<p className='text-sm text-gray-600 line-clamp-3'>{props.daoDescription}</p>
						<p className='text-sm text-gray-500 mb-2'>
							Chain: <span className='font-semibold'>{props.daoChain}</span> (ID: {props.daoChainId})
						</p>
					</div>
				</div>
			</ViewTransition>
		</Link>
	);
};

export default CardDAO;
