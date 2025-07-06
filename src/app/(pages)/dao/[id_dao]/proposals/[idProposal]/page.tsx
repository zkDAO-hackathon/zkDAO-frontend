"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import DetailsDaoProposal from "@/app/components/DashboardDAO/DetailsDaoProposal";
import Voting from "@/app/components/DashboardDAO/Voting";
import { useParams } from "next/navigation";
import { useStore } from "@/app/store";
import { useEffect, useState } from "react";
import { Proposal } from "@/app/modals";
import { MdHowToVote } from "react-icons/md";
import SVG404 from "@/app/assets/404-v2.svg";
import Image from "next/image";
import VoteOption from "@/app/components/DashboardDAO/Voting/Votings";

const PageProposal = () => {
	const { idProposal, id_dao } = useParams();
	const items = [
		{ label: "Dashboard", href: "/" },
		{ label: "DAO", href: `/dao/${id_dao}` },
		{ label: "Proposals", href: `/dao/${id_dao}/proposals` },
		{ label: "Proposal Details" },
	];

	const [proposal, setProposal] = useState<Proposal | null>(null);
	const { getDao } = useStore();

	useEffect(() => {
		getDao(Number(id_dao))
			.then((dao) => {
				setProposal(dao?.proposals.find((p) => p.proposalNumber.toString() === idProposal) || null);
			})
			.catch((error) => {
				console.error("Error fetching DAO:", error);
			});
	}, [id_dao, idProposal, getDao]);

	return (
		<section className='container mx-auto px-4 py-6'>
			<Breadcrumbs items={items} />

			<header className='mb-6 mt-4'>
				<h1 className='text-3xl font-bold text-gray-900'>Proposal Details</h1>
			</header>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				<div className='bg-white rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold mb-4'>
						<MdHowToVote className='inline-block mr-2 text-2xl' aria-hidden='true' />
						Cast Your Vote
					</h2>

					{proposal?.state === 1 || proposal?.state === 4 || proposal?.state === 5 ? (
						<>
							<Voting
								tally={proposal.tally}
								leftTime={proposal?.timeForVoting instanceof Date ? proposal.timeForVoting.getTime() : proposal?.timeForVoting}
								address={proposal?.proposer || "0x0000000000000000000000000000000000000000"}
								idProposal={proposal?.id.toString()}
								state={proposal?.state}
							/>
						</>
					) : (
						<>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8'>
								<VoteOption emoji='👍' type='yes' label='Yes to approve' tokens={proposal?.tally?.forVotes as string} />

								<VoteOption emoji='⊘' type='abstain' label='Abstain' tokens={proposal?.tally?.abstainVotes as string} />

								<VoteOption emoji='👎' type='no' label='No to approve' tokens={proposal?.tally?.againstVotes as string} />
							</div>
							<Image src={SVG404} alt='Voting not active' className='mx-auto mb-4' width={200} height={200}></Image>
							{proposal?.state === 7 ? (
								<p className='text-center text-2xl font-bold'>This proposal was executed.</p>
							) : (
								<p className='text-center text-gray-600'>Voting is not active for this proposal.</p>
							)}
						</>
					)}
				</div>

				<DetailsDaoProposal
					id={idProposal as string}
					proposedBy={proposal?.proposer || "Unknown Proposer"}
					publishedAt={proposal?.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : "Unknown Date"}
					status={proposal?.state.toString() || "Unknown Status"}
					description={proposal?.description || "No description available."}
					cid={proposal?.cid || "No CID available"}
				/>
			</div>
		</section>
	);
};

export default PageProposal;
