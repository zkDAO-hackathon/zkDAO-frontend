import Assets from "@/app/components/DashboardDAO/Assets";
import ContractInfo from "@/app/components/DashboardDAO/ContractInfo";
import HeroDAO from "@/app/components/DashboardDAO/HeroDAO";
import Proposals from "@/app/components/DashboardDAO/Proposals";
import Navbar from "@/app/components/Navbar";
import { unstable_ViewTransition as ViewTransition } from "react";

const DashboardPage = () => {
	return (
		<main>
			<Navbar />
			<ViewTransition name='page-dao'>
				<div className='container mx-auto p-4'>
					<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<HeroDAO
								name={"PRUEBA"}
								description={"asdkjaghshjdgashjdgasjhdgasjhdgaskjhdas"}
								logoUrl={
									"https://ethereum.org/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fimpact_transparent.7420c423.png&w=640&q=75"
								}
							/>
							<Proposals
								proposals={[
									{
										id: "1",
										title: "Proposal 1",
										description: "Description of proposal 1",
										status: "active",
										createdAt: "2025-06-01",
										votesFor: 100,
										votesAgainst: 50,
									},
									{
										id: "2",
										title: "Proposal 2",
										description: "Description of proposal 2",
										status: "closed",
										createdAt: "2025-06-02",
										votesFor: 200,
										votesAgainst: 75,
									},
									{
										id: "3",
										title: "Proposal 3",
										description: "Description of proposal 3",
										status: "active",
										createdAt: "2025-06-03",
										votesFor: 150,
										votesAgainst: 30,
									},
								]}
							/>
							<Assets />
						</div>
						<div>
							<ContractInfo
								chain={"Ethereum Sepolia"}
								daoAddress={"0x993351f1315d5123231FDFe0020f106FC460E14E"}
								launchedDate={"June 2025"}
							/>
						</div>
					</div>
				</div>
			</ViewTransition>
		</main>
	);
};

export default DashboardPage;
