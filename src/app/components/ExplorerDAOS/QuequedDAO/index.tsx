"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/store";

const QueuedProposal = () => {
	const { queuedProposals: storeQueuedProposals } = useStore();
	const [currentPage, setCurrentPage] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const cardsPerPage = 3;

	const totalPages = Math.ceil(storeQueuedProposals.length / cardsPerPage);

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

	return (
		<div className='flex flex-col items-center justify-center h-full p-6'>
			<h1 className='text-2xl font-bold mb-6 text-gray-800'>Queued Proposals</h1>

			<div className='relative w-full max-w-6xl'>
				<div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
					{storeQueuedProposals.slice(currentPage * cardsPerPage, currentPage * cardsPerPage + cardsPerPage).map((proposal, index) => (
						<div
							key={index}
							className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
							<div className='flex justify-between items-start mb-3'>
								<h2 className='text-xl font-semibold text-gray-800'>Proposal #{proposal.proposalNumber}</h2>
								<span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0'>
									{proposal.state}
								</span>
							</div>

							<div className='bg-gray-50 rounded-lg p-4 mb-3'>
								<p className='text-gray-700 line-clamp-3'>{proposal.description}</p>
							</div>

							<div className='flex justify-end'>
								<button className='text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors'>View details →</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default QueuedProposal;
