import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaCircle, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Address } from "viem";
import { useAccount } from "wagmi";
import VoteOption from "./Votings";
import { Tally } from "@/app/modals/index";

interface VotingProps {
	leftTime: string | number; // Time left for voting in seconds or a formatted string
	address?: Address;
	tally?: Tally; // Optional tally data
}
const Voting = ({ leftTime, address, tally }: VotingProps) => {
	const { address: accountAddress } = useAccount();
	const [activeVoting, setActiveVoting] = useState<boolean>(false);

	return (
		<div className='flex flex-col gap-4'>
			<header className='mb-4'>
				{accountAddress && (
					<>
						You are voting on proposal{" "}
						<span className='font-bold'>{address ? address.slice(0, 6) + "..." + address.slice(-4) : "Unknown"}</span>
						<p className='text-sm text-gray-500'>Connected: {accountAddress}</p>
					</>
				)}
			</header>

			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<span className='text-2xl' aria-label='Voting ballot'>
						🗳️
					</span>
					<div>
						<p className='text-sm text-gray-500'>Time remaining</p>
						<h3 className='text-md font-bold text-primary'>{leftTime}</h3>
					</div>
				</div>
			</div>

			<div className='tabs tabs-border'>
				<input type='radio' name='votingTabs' className='tab' aria-label='Breakdown' defaultChecked />
				<div className='tab-content border-base-300 rounded-2xl mt-2 p-6 md:p-10'>
					{/* Voting Options */}
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8'>
						{/* Yes Option */}
						<VoteOption emoji='👍' type='yes' label='Yes to approve' tokens={tally?.forVotes as string} />

						{/* Abstain Option */}
						<VoteOption emoji='⊘' type='abstain' label='Abstain' tokens={tally?.abstainVotes as string} />

						{/* No Option */}
						<VoteOption emoji='👎' type='no' label='No to approve' tokens={tally?.againstVotes as string} />
					</div>

					{/* Voting Controls */}
					{activeVoting ? (
						<>
							<div className='border-t pt-6'>
								<h4 className='text-lg font-medium mb-4'>Cast your vote on this proposal:</h4>
								<div className='flex flex-col gap-3'>
									<button className='btn btn-success flex justify-between items-center group'>
										<span>Yes, I approve</span>
										<FaCircleCheck className='text-lg transition-transform group-hover:scale-110' />
									</button>
									<button className='btn btn-neutral flex justify-between items-center group'>
										<span>Abstain</span>
										<FaCircle className='text-lg transition-transform group-hover:scale-110' />
									</button>
									<button className='btn btn-error flex justify-between items-center group'>
										<span>No, I don&apos;t approve</span>
										<FaCircleXmark className='text-lg transition-transform group-hover:scale-110' />
									</button>
								</div>
							</div>
							<div className='flex justify-end gap-3 mt-8'>
								<button className='btn btn-outline btn-error gap-2' onClick={() => setActiveVoting(false)}>
									<FaCircleXmark /> Cancel
								</button>
								<button className='btn btn-primary gap-2'>
									Submit vote <FaPaperPlane />
								</button>
							</div>
						</>
					) : (
						<div className='flex justify-center mt-6'>
							<button
								className='btn btn-primary flex items-center gap-2 hover:scale-105 transition-transform'
								onClick={() => setActiveVoting(true)}>
								Start Voting
								<FaPaperPlane />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Voting;
