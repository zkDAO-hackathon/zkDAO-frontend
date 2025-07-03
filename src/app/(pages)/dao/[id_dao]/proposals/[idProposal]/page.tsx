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
				<p className='text-gray-600 mt-2'>ID: {idProposal || "Loading..."}</p>
			</header>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				<div className='bg-white rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold mb-4'>
						<MdHowToVote className='inline-block mr-2 text-2xl' aria-hidden='true' />
						Cast Your Vote
					</h2>
					{proposal?.state === 3 ? (
						<>
							<Voting
								tally={proposal.tally}
								leftTime={proposal?.timeForVoting.toISOString()}
								address={proposal?.proposer || "0x0000000000000000000000000000000000000000"}
								idProposal={idProposal as string}
							/>
						</>
					) : (
						<>
							<Image src={SVG404} alt='Voting not active' className='mx-auto mb-4' width={200} height={200}></Image>
							<p className='text-gray-500 text-center'>Voting is not active for this proposal.</p>
						</>
					)}
				</div>

				<DetailsDaoProposal
					id={idProposal as string}
					proposedBy={proposal?.proposer || "Unknown Proposer"}
					publishedAt={proposal?.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : "Unknown Date"}
					status={proposal?.state.toString() || "Unknown Status"}
				/>
			</div>
		</section>
	);
};

export default PageProposal;
