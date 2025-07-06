import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaCircle, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import VoteOption from "./Votings";
import { Tally } from "@/app/modals/index";

import { GovernorContract } from "@/app/services/blockchain/contracts/governor";
import { ZKDAO_JSON } from "@/app/config/const";
import { toast } from "sonner";

interface VotingProps {
	leftTime: string | number;
	address?: Address;
	tally?: Tally;
	idProposal?: string;
	state: number;
}
const Voting = ({ leftTime, address, tally, idProposal, state }: VotingProps) => {
	const [hasVoted, setHasVoted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingVote, setLoadingVote] = useState<boolean>(false);
	const [loadingQueue, setLoadingQueue] = useState<boolean>(false);
	const [loadingExecute, setLoadingExecute] = useState<boolean>(false);

	const [timeLeftState, setTimeLeftState] = useState<string | number>(leftTime);

	useEffect(() => {
		if (typeof leftTime !== "number") {
			setTimeLeftState(Number(leftTime));
			return;
		}

		let remaining = leftTime;
		const interval = setInterval(() => {
			remaining -= 1000;

			if (remaining <= 0) {
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
	}, [leftTime]);
	const { address: accountAddress, chainId } = useAccount();
	// const { statesOfTransaction, setStatesOfTransaction } = useState({
	// 	pinData: false,
	// 	prepareTx: false,
	// 	signTx: false,
	// 	confirmTx: false,
	// 	indexOnchain: false,
	// });
	const [activeVoting, setActiveVoting] = useState<boolean>(false);
	const { data: walletClient } = useWalletClient();
	const [vote, setVote] = useState<0 | 1 | 2 | null>(null);

	const network = chainId === 11155111 ? "sepolia" : "avalancheFuji";
	const governor = new GovernorContract(network, ZKDAO_JSON.address as `0x${string}`, walletClient);

	useEffect(() => {
		if (!walletClient) {
			console.error("Wallet client not available");
			return;
		}

		if (!idProposal) {
			console.error("No proposal ID provided");
			return;
		}

		governor.setWalletClient(walletClient);

		const fetchHasVoted = async () => {
			try {
				const hasVoted = await governor.hasVoted(accountAddress as Address, BigInt(idProposal));
				setLoading(false);
				console.log("Has voted:", hasVoted);
				setHasVoted(hasVoted);
			} catch (error) {
				console.error("Error checking if user has voted:", error);
			}
		};

		fetchHasVoted();
	}, []);

	const handleVote = async (voteType: 0 | 1 | 2) => {
		setLoadingVote(true);
		if (!accountAddress || !idProposal) {
			setLoadingVote(false);
			console.error("No account address or proposal ID found");
			return;
		}

		// const proposalId = Number(idProposal);

		// const amount = BigInt(1);

		toast.promise(governor.castVoteZK(idProposal, voteType), {
			loading: "Casting vote...",
			success: () => {
				setActiveVoting(false);
				setVote(null);
				setHasVoted(true);
				setLoadingVote(false);
				window.location.reload();
				return "Vote cast successfully";
			},
			error: (error) => {
				setLoadingVote(false);
				console.error("Error casting vote:", error);
				return `Error casting vote: ${error instanceof Error ? error.message : "Unknown error"}`;
			},
		});
	};

	const onQuequeProposal = async () => {
		setLoadingQueue(true);
		toast.promise(governor.quequeProposal(), {
			loading: "Queuing proposal...",
			success: () => {
				window.location.reload();
				return "Proposal queued successfully";
			},
			error: (error) => {
				setLoadingQueue(false);
				console.error("Error queuing proposal:", error);
				return `Error queuing proposal: ${error instanceof Error ? error.message : "Unknown error"}`;
			},
		});
	};
	const executeProposal = async () => {
		setLoadingExecute(true);
		toast.promise(governor.execute(), {
			loading: "Executing proposal...",
			success: (txHash) => {
				setLoadingExecute(false);

				// Generate the explorer URL based on the network
				const explorerUrl = network === "sepolia" ? `https://sepolia.etherscan.io/tx/${txHash}` : `https://testnet.snowscan.xyz/tx/${txHash}`;

				// Show a toast with transaction details and a clickable action
				toast(`Transaction: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`, {
					action: {
						label: "View in Explorer",
						onClick: () => window.open(explorerUrl, "_blank"),
					},
				});

				setTimeout(() => window.location.reload(), 3000);
				return "Proposal executed successfully!";
			},
			error: (error) => {
				setLoadingExecute(false);
				return `Error executing proposal: ${error instanceof Error ? error.message : "Unknown error"}`;
			},
		});
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
						🗳️ Time {timeLeftState}
					</span>
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

					{activeVoting && loading ? (
						<>
							{state === 1 && (
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
							)}

							<div className='flex flex-col gap-3 mt-8'>
								<button
									className='btn btn-outline btn-error gap-2'
									onClick={() => {
										setActiveVoting(false);
										setVote(null);
									}}>
									<FaCircleXmark /> Cancel
								</button>
								{state === 4 && (
									<button className='btn btn-secondary gap-2' onClick={() => onQuequeProposal()} disabled={loadingQueue}>
										<FaPaperPlane /> {loadingQueue ? "Queuing proposal..." : "Queue proposal"}
									</button>
								)}
								{state === 5 && (
									<button className='btn btn-secondary gap-2' onClick={() => executeProposal()} disabled={loadingExecute}>
										<FaPaperPlane /> {loadingExecute ? "Executing proposal..." : "Execute proposal"}
									</button>
								)}

								<button
									className='btn btn-primary gap-2'
									onClick={() => vote !== null && handleVote(vote)}
									disabled={vote === null || hasVoted || loadingVote}>
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
