import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaCircle, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Address } from "viem";

interface VotingProps {
	leftTime: number;
	address: Address;
}
const Voting = ({ leftTime, address }: VotingProps) => {
	const [activeVoting, setActiveVoting] = useState<boolean>(false);

	return (
		<div className='flex flex-col gap-4'>
			<h2 className='text-2xl font-bold'>Voting {address}</h2>
			<div className='flex items-center gap-2 mb-4'>
				<div className='flex items-center justify-between w-full'>
					<div>
						<span className='text-4xl text-primary mb-2'>🗳️</span>
						<h1 className='text-2xl font-bold'>{leftTime}</h1>
					</div>
				</div>
			</div>
			<p className='text-gray-600'>This section will allow you to create and manage votes for your DAO.</p>

			<div className='tabs tabs-border'>
				<input type='radio' name='votingTabs' className='tab' aria-label='Breakdown' defaultChecked />
				<div className='tab-content border-base-300 rounded-2xl mt-2 p-10'>
					<div className='w-full'>
						<div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
							<div className='flex flex-col items-center p-5 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:shadow-lg transition-all cursor-pointer'>
								<div className='text-green-600 text-3xl mb-2' aria-hidden='true'>
									👍
								</div>
								<h3 className='font-semibold text-lg'>Yes to approve</h3>
								<div className='mt-2 font-bold text-primary text-xl'>3 Tokens</div>
								<div className='mt-3 w-full bg-gray-200 rounded-full h-2.5'>
									<div className='bg-green-500 h-2.5 rounded-full shadow-inner' style={{ width: "50%" }}></div>
								</div>
								<span className='text-sm text-gray-500 mt-2'>50% of votes</span>
							</div>

							<div className='flex flex-col items-center p-5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:shadow-lg transition-all cursor-pointer'>
								<div className='text-gray-500 text-3xl mb-2' aria-hidden='true'>
									⊘
								</div>
								<h3 className='font-semibold text-lg'>Abstain</h3>
								<div className='mt-2 font-bold text-primary text-xl'>1 Token</div>
								<div className='mt-3 w-full bg-gray-200 rounded-full h-2.5'>
									<div className='bg-gray-500 h-2.5 rounded-full shadow-inner' style={{ width: "16%" }}></div>
								</div>
								<span className='text-sm text-gray-500 mt-2'>16% of votes</span>
							</div>

							<div className='flex flex-col items-center p-5 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:shadow-lg transition-all cursor-pointer'>
								<div className='text-red-600 text-3xl mb-2' aria-hidden='true'>
									👎
								</div>
								<h3 className='font-semibold text-lg'>No to approve</h3>
								<div className='mt-2 font-bold text-primary text-xl'>2 Tokens</div>
								<div className='mt-3 w-full bg-gray-200 rounded-full h-2.5'>
									<div className='bg-red-500 h-2.5 rounded-full shadow-inner' style={{ width: "33%" }}></div>
								</div>
								<span className='text-sm text-gray-500 mt-2'>33% of votes</span>
							</div>
						</div>
						{activeVoting ? (
							<>
								<div className='border-t pt-6'>
									<h4 className='text-lg font-medium mb-4'>Cast your vote on this proposal:</h4>
									<div className='flex flex-col gap-3'>
										<button className='btn btn-primary flex justify-between items-center hover:brightness-105 transition-all'>
											<span>Yes, I approve</span>
											<FaCircleCheck className='text-lg' />
										</button>
										<button className='btn btn-secondary flex justify-between items-center hover:brightness-105 transition-all'>
											<span>Abstain</span>
											<FaCircle className='text-lg' />
										</button>
										<button className='btn btn-error flex justify-between items-center hover:brightness-105 transition-all'>
											<span>No, I don&apos;t approve</span>
											<FaCircleXmark className='text-lg' />
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
								<button className='btn btn-primary flex items-center gap-2' onClick={() => setActiveVoting(true)}>
									Start Voting
									<FaPaperPlane />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* <input type='radio' name='votingTabs' className='tab' aria-label='Votes' />
				<div className='tab-content border-base-300 rounded-2xl mt-2 p-10'>Tab content 2</div>

				<input type='radio' name='votingTabs' className='tab' aria-label='Settings' />
				<div className='tab-content border-base-300 rounded-2xl mt-2 p-10'>Tab content 3</div> */}
			</div>
		</div>
	);
};
export default Voting;
