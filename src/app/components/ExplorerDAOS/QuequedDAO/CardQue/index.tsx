import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";

interface QueuedProposal {
	id: bigint;
	proposalNumber: number;
	description: string;
	state?: number;
	createdAt: Date;
	timeLeft: string | number;
}

const CardQue = ({ proposalNumber, description, state, timeLeft }: QueuedProposal) => {
	const [timeLeftState, setTimeLeftState] = useState<string>("");
	console.log("State", state);
	useEffect(() => {
		const remainingMs = Number(timeLeft);
		let targetTime = Date.now() + remainingMs;
		if (Number(timeLeft) < 1000) {
			targetTime = Date.now() + 60000;
		}

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
		<div className='bg-white rounded-2xl border border-gray-200 p-6'>
			<div className='flex justify-between items-start mb-4'>
				<h2 className='text-xl font-semibold text-gray-800'>Proposal #{proposalNumber}</h2>
				<span className='badge badge-ghost badge-lg text-gray-600'>
					<div className='inline-grid *:[grid-area:1/1]'>
						<div className='status status-primary animate-ping'></div>
						<div className='status status-primary'></div>
					</div>{" "}
					In Queue
				</span>
			</div>

			<div className='bg-gray-50 rounded-lg p-4 mb-4 hover:bg-gray-100 transition-colors duration-200'>
				<p className='text-gray-700 line-clamp-2 text-ellipsis'>{description}</p>
			</div>

			<div className='flex items-center mt-2'>
				<div className='bg-blue-100 p-2 rounded-full mr-3'>
					<FaClock className='text-blue-600' />
				</div>
				<div>
					<span className='text-sm text-gray-500 block'>Time left</span>
					<span className='font-semibold text-gray-800'>{timeLeftState}</span>
				</div>
			</div>
		</div>
	);
};

export default CardQue;
