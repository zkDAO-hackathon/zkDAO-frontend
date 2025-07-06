"use client";
import { PiStackBold } from "react-icons/pi";
import { useStore } from "@/app/store";
import CardQue from "./CardQue";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";

const QueuedProposal = () => {
	const { queuedProposals: storeQueuedProposals } = useStore();

	// const dummyQueuedProposals = [
	// 	{
	// 		id: "1",
	// 		daoId: 2, // Assuming this is the DAO ID for the proposals
	// 		proposalNumber: 101,
	// 		description: "Proposal to fund community development initiatives including education and healthcare.",
	// 		state: 0,
	// 		createdAt: new Date(),
	// 		timeDelay: 200, // 1 minuto en milisegundos
	// 	},
	// 	{
	// 		id: "2",
	// 		daoId: 2, // Assuming this is the DAO ID for the proposals
	// 		proposalNumber: 102,
	// 		description: "Proposal to upgrade DAO governance tools and audit smart contracts.",
	// 		state: 1,
	// 		createdAt: new Date(),
	// 		timeDelay: 300000, // 5 minutos
	// 	},
	// 	{
	// 		id: "3",
	// 		daoId: 2, // Assuming this is the DAO ID for the proposals
	// 		proposalNumber: 103,
	// 		description: "Proposal to onboard new contributors and allocate tokens for training.",
	// 		state: 2,
	// 		createdAt: new Date(),
	// 		timeDelay: 120000, // 2 minutos
	// 	},
	// 	{
	// 		id: "4",
	// 		daoId: 2, // Assuming this is the DAO ID for the proposals
	// 		proposalNumber: 104,
	// 		description: "Proposal to support research on zero-knowledge proofs and scalability.",
	// 		state: 0,
	// 		createdAt: new Date(),
	// 		timeDelay: 180000, // 3 minutos
	// 	},
	// ];

	return (
		<div className='mx-auto container px-4 py-8 relative'>
			<h1 className='text-2xl font-bold mb-6 text-gray-800'>
				<PiStackBold className='inline-block mr-2 text-2xl' />
				Queued Proposals
			</h1>
			<Swiper
				modules={[Pagination, Autoplay]}
				slidesPerView={1}
				spaceBetween={20}
				loop={true}
				autoplay={{ delay: 5000, disableOnInteraction: true }}
				pagination={{
					clickable: true,
					el: ".swiper-pagination",
				}}
				breakpoints={{
					640: {
						// sm
						slidesPerView: 1,
					},
					768: {
						// md
						slidesPerView: 2,
					},
					1024: {
						// lg
						slidesPerView: 3,
					},
				}}
				className='pb-14 mySwiper'>
				{" "}
				{/* Added padding-bottom for pagination */}
				{storeQueuedProposals.map((proposal) => (
					<SwiperSlide key={proposal.id} className='flex justify-center'>
						<Link href={`/dao/${proposal.daoId}/proposals/${proposal.id}`} key={proposal.id} className='no-underline'>
							<CardQue
								key={proposal.id}
								id={BigInt(proposal.id)}
								proposalNumber={proposal.proposalNumber}
								description={proposal.description}
								state={proposal.state}
								createdAt={proposal.createdAt}
								timeLeft={Number(proposal?.timeDelay)}
							/>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
			{/* Pagination element outside of slides */}
			<div className='swiper-pagination mt-4'></div>
		</div>
	);
};

export default QueuedProposal;
