"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import DetailsDaoProposal from "@/app/components/DashboardDAO/DetailsDaoProposal";
import Voting from "@/app/components/DashboardDAO/Voting";
import { useParams } from "next/navigation";

const PageProposal = () => {
	const items = [
		{ label: "Dashboard", href: "/" },
		{ label: "DAO", href: "/dao" },
		{ label: "Proposals", href: "/dao/proposals" },
		{ label: "Proposal Details" },
	];
	const { idProposal } = useParams();
	return (
		<section className='container mx-auto px-4 py-6'>
			<Breadcrumbs items={items} />

			<header className='mb-6 mt-4'>
				<h1 className='text-3xl font-bold text-gray-900'>Proposal Details</h1>
				<p className='text-gray-600 mt-2'>ID: {idProposal || "Loading..."}</p>
			</header>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				<div className='bg-white rounded-lg shadow-md p-6'>
					<h2 className='text-xl font-semibold mb-4'>Cast Your Vote</h2>
					<Voting leftTime={3600} address={"0x993351f1315d5123231FDFe0020f106FC460E14E"} />
				</div>

				<DetailsDaoProposal
					onChainId={"123456789009876543212"}
					id={idProposal as string}
					proposedBy={"0x47cD2d81B7a652AB3AB1088FB06ae02e35D98ADB"}
					publishedAt={"Today at 12:00 PM"}
					status={"Active"}
				/>
			</div>
		</section>
	);
};

export default PageProposal;
