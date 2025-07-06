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

const CardQue = (props: QueuedProposal) => {
	const [timeLeftState, setTimeLeftState] = useState<string | number>(Number(props.timeLeft));

	useEffect(() => {
		if (typeof props.timeLeft !== "number") {
			setTimeLeftState(Number(props.timeLeft));
			return;
		}

		let remaining = props.timeLeft;
		const interval = setInterval(() => {
			remaining -= 1000;

			if (remaining <= 0) {
				console.log("Voting ended for proposal:", remaining);
				clearInterval(interval);
				setTimeLeftState("Voting ended");
			} else {
				const totalSeconds = Math.floor(remaining / 1000);
				const hours = Math.floor(totalSeconds / 3600);
				const minutes = Math.floor((totalSeconds % 3600) / 60);
				const seconds = totalSeconds % 60;
				setTimeLeftState(`${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [props.timeLeft]);

	return (
		<div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
			<div className='flex justify-between items-start mb-3'>
				<h2 className='text-xl font-semibold text-gray-800'>Proposal #{props.proposalNumber}</h2>
				<span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0'>{props.state}</span>
			</div>

			<div className='bg-gray-50 rounded-lg p-4 mb-3'>
				<p className='text-gray-700 line-clamp-3'>{props.description}</p>
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
