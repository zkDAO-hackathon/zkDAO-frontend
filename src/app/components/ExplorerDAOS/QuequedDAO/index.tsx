"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/store";
import CardQue from "./CardQue";

const QueuedProposal = () => {
	const { queuedProposals: storeQueuedProposals } = useStore();
	const [currentPage, setCurrentPage] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const cardsPerPage = 3;

	const totalPages = Math.ceil(storeQueuedProposals.length / cardsPerPage) || 1;

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);
			setCurrentPage((prev) => (prev + 1) % totalPages);
		}, 5000);

		return () => clearInterval(interval);
	}, [totalPages]);

	useEffect(() => {
		const timer = setTimeout(() => setIsAnimating(false), 300);
		return () => clearTimeout(timer);
	}, [currentPage]);

	const paginatedProposals = storeQueuedProposals.slice(currentPage * cardsPerPage, currentPage * cardsPerPage + cardsPerPage);

	return (
		<div className='flex flex-col items-center justify-center h-full p-6'>
			<h1 className='text-2xl font-bold mb-6 text-gray-800'>Queued Proposals</h1>

			<div className='relative w-full max-w-6xl'>
				<div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
					{paginatedProposals.map((proposal) => (
						<CardQue
							key={proposal.id}
							id={BigInt(proposal.id)}
							proposalNumber={proposal.proposalNumber}
							description={proposal.description}
							state={proposal.state}
							createdAt={proposal.createdAt}
							timeLeft={Number(proposal?.timeDelay)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default QueuedProposal;
