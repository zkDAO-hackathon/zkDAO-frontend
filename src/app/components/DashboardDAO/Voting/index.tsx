import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaCircle, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import VoteOption from "./Votings";
import { Tally } from "@/app/modals/index";

import { GovernorContract } from "@/app/services/blockchain/contracts/governor";
import { ZKDAO_JSON } from "@/app/config/const";

interface VotingProps {
	leftTime: string | number;
	address?: Address;
	tally?: Tally;
	idProposal?: string;
}
const Voting = ({ leftTime, address, tally, idProposal }: VotingProps) => {
	const { address: accountAddress, chainId } = useAccount();
	const [activeVoting, setActiveVoting] = useState<boolean>(false);
	const { data: walletClient } = useWalletClient();
	const [vote, setVote] = useState<0 | 1 | 2 | null>(null);

	const network = chainId === 11155111 ? "sepolia" : "avalancheFuji";
	const governor = new GovernorContract(network, ZKDAO_JSON.address as `0x${string}`, walletClient);

	const handleVote = async (voteType: 0 | 1 | 2) => {
		if (!accountAddress || !idProposal) {
			console.error("No account address or proposal ID found");
			return;
		}
		try {
			// Convert idProposal to number and use appropriate amount value
			const proposalId = Number(idProposal);
			const amount = BigInt(1); // Replace with appropriate token amount

			await governor.castVoteZK(proposalId, amount, voteType);
			console.log(`Vote cast successfully: ${voteType}`);
		} catch (error) {
			console.error("Error casting vote:", error);
		}
	};

	const handleVoteClick = (voteType: 0 | 1 | 2) => {
		setVote(voteType);
	};

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
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8'>
						<VoteOption emoji='👍' type='yes' label='Yes to approve' tokens={tally?.forVotes as string} />

						<VoteOption emoji='⊘' type='abstain' label='Abstain' tokens={tally?.abstainVotes as string} />

						<VoteOption emoji='👎' type='no' label='No to approve' tokens={tally?.againstVotes as string} />
					</div>

					{activeVoting ? (
						<>
							<div className='border-t pt-6'>
								<h4 className='text-lg font-medium mb-4'>Cast your vote on this proposal:</h4>
								<div className='flex flex-col gap-3'>
									<button
										className={`btn ${
											vote === 1 ? "btn-success ring-2 ring-success" : "btn-outline btn-success"
										} flex justify-between items-center group`}
										onClick={() => handleVoteClick(1)}>
										<span>Yes, I approve</span>
										<FaCircleCheck className={`text-lg transition-transform ${vote === 1 ? "scale-110" : ""}`} />
									</button>
									<button
										className={`btn ${
											vote === 2 ? "btn-neutral ring-2 ring-neutral" : "btn-outline btn-neutral"
										} flex justify-between items-center group`}
										onClick={() => handleVoteClick(2)}>
										<span>Abstain</span>
										<FaCircle className={`text-lg transition-transform ${vote === 2 ? "scale-110" : ""}`} />
									</button>
									<button
										className={`btn ${
											vote === 0 ? "btn-error ring-2 ring-error" : "btn-outline btn-error"
										} flex justify-between items-center group`}
										onClick={() => handleVoteClick(0)}>
										<span>No, I don&apos;t approve</span>
										<FaCircleXmark className={`text-lg transition-transform ${vote === 0 ? "scale-110" : ""}`} />
									</button>
								</div>
							</div>
							<div className='flex justify-end gap-3 mt-8'>
								<button
									className='btn btn-outline btn-error gap-2'
									onClick={() => {
										setActiveVoting(false);
										setVote(null);
									}}>
									<FaCircleXmark /> Cancel
								</button>
								<button className='btn btn-primary gap-2' onClick={() => vote !== null && handleVote(vote)} disabled={vote === null}>
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
