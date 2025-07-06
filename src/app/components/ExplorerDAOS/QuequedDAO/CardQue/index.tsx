import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";

interface QueuedProposal {
	id: bigint;
	proposalNumber: number;
	description: string;
	state: number;
	createdAt: Date;
	timeLeft: string | number;
}

const CardQue = ({ proposalNumber, description, state, timeLeft }: QueuedProposal) => {
	const [timeLeftState, setTimeLeftState] = useState<string>("");

	useEffect(() => {
		const remainingMs = Number(timeLeft);
		const targetTime = Date.now() + remainingMs;

		if (isNaN(remainingMs) || remainingMs <= 0) {
			setTimeLeftState("Voting ended");
			return;
		}

		const updateCountdown = () => {
			const now = Date.now();
			const diff = targetTime - now;

			if (diff <= 0) {
				setTimeLeftState("Voting ended");
				clearInterval(interval);
				return;
			}

			const totalSeconds = Math.floor(diff / 1000);
			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;

			const display = `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
			setTimeLeftState(display);
		};

		updateCountdown(); // inicial
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [timeLeft]);

	return (
		<div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
			<div className='flex justify-between items-start mb-3'>
				<h2 className='text-xl font-semibold text-gray-800'>Proposal #{proposalNumber}</h2>
				<span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0'>{state}</span>
			</div>

			<div className='bg-gray-50 rounded-lg p-4 mb-3'>
				<p className='text-gray-700 line-clamp-3'>{description}</p>
			</div>

			<div>
				<FaClock className='inline mr-2 text-gray-500' />
				<span className='text-gray-500'>Time left: </span>
				<span className='font-semibold'>{timeLeftState}</span>
			</div>
		</div>
	);
};

export default CardQue;
