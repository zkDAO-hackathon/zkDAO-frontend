"use client";
import { useState, useEffect } from "react";
import { IProposal } from "@/app/types/proposal.type";
import { Address } from "viem";

// Using the new interface structure
const fakeProposals: IProposal[] = [
	{
		title: "Treasury Allocation for Q4 Projects",
		description: "Allocate 500 ETH from treasury to fund community development projects in Q4 2023.",
		state: "queued",
		encodedFunctionData: "0x1234abcd...",
		targets: ["0x1a2b3c4d..."] as Address[],
		values: "500",
	},
	{
		title: "Partnership with zkSync Ecosystem",
		description: "Establish a strategic partnership with zkSync to enhance scalability solutions for our protocol.",
		state: "queued",
		encodedFunctionData: "0x5678efgh...",
		targets: ["0x5e6f7g8h..."] as Address[],
		values: "200",
	},
	{
		title: "Protocol Upgrade: Version 2.0",
		description: "Implement the planned protocol upgrade to v2.0 with enhanced security features and optimized gas usage.",
		state: "queued",
		encodedFunctionData: "0x90abijkl...",
		targets: ["0x9i0j1k2l..."] as Address[],
		values: "0",
	},
	{
		title: "Protocol Upgrade: Version 2.0",
		description: "Implement the planned protocol upgrade to v2.0 with enhanced security features and optimized gas usage.",
		state: "queued",
		encodedFunctionData: "0x90abijkl...",
		targets: ["0x9i0j1k2l..."] as Address[],
		values: "0",
	},
];

interface QueuedProposalProps {
	queuedProposals?: IProposal[];
}

const QueuedProposal = ({ queuedProposals = fakeProposals }: QueuedProposalProps) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const cardsPerPage = 3;

	const totalPages = Math.ceil(queuedProposals.length / cardsPerPage);

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

	if (!queuedProposals?.length) {
		return (
			<div className='flex flex-col items-center justify-center h-full p-8 bg-gray-50 rounded-lg shadow-sm'>
				<h1 className='text-2xl font-bold mb-4 text-gray-800'>Queued Proposals</h1>
				<p className='text-lg text-gray-600'>There are no queued proposals at the moment.</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center justify-center h-full p-6'>
			<h1 className='text-2xl font-bold mb-6 text-gray-800'>Queued Proposals</h1>

			<div className='relative w-full max-w-6xl'>
				<div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
					{queuedProposals.slice(currentPage * cardsPerPage, currentPage * cardsPerPage + cardsPerPage).map((proposal, index) => (
						<div key={index} className='bg-white rounded-2xl shadow-lg p-6 '>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-xl font-semibold text-gray-800'>{proposal.title}</h2>
								<span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium'>{proposal.state}</span>
							</div>
							<p className='text-gray-700 mb-4'>{proposal.description}</p>
						</div>
					))}
				</div>

				{totalPages > 1 && (
					<div className='flex justify-center mt-4'>
						{[...Array(totalPages)].map((_, i) => (
							<button
								key={i}
								className={`mx-1 w-3 h-3 rounded-full ${i === currentPage ? "bg-blue-500" : "bg-gray-300"}`}
								onClick={() => {
									setIsAnimating(true);
									setCurrentPage(i);
								}}
								aria-label={`Page ${i + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default QueuedProposal;
