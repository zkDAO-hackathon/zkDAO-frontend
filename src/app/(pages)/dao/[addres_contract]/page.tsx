"use client";
import Assets from "@/app/components/DashboardDAO/Assets";
import ContractInfo from "@/app/components/DashboardDAO/ContractInfo";
import HeroDAO from "@/app/components/DashboardDAO/HeroDAO";
import Proposals from "@/app/components/DashboardDAO/Proposals";
import Link from "next/link";
import { useParams } from "next/navigation";

import { unstable_ViewTransition as ViewTransition } from "react";
import { IoMdPaper } from "react-icons/io";

const DashboardPage = () => {
	const { addres_contract: contr } = useParams();
	return (
		<main>
			<ViewTransition name='page-dao'>
				<div className='container mx-auto p-4'>
					<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<HeroDAO
								name={"PRUEBA"}
								description={
									"Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor, o palabras aleatorias que no parecen ni un poco creíbles. Si vas a utilizar un pasaje de Lorem Ipsum, necesitás estar seguro de que no hay nada avergonzante escondido en el medio del texto. Todos los generadores de Lorem Ipsum que se encuentran en Internet tienden a repetir trozos predefinidos cuando sea necesario, haciendo a este el único generador verdadero (válido) en la Internet. Usa un diccionario de mas de 200 palabras provenientes del latín, combinadas con estructuras muy útiles de sentencias, para generar texto de Lorem Ipsum que parezca razonable. Este Lorem Ipsum generado siempre estará libre de repeticiones, humor agregado o palabras no características del lenguaje, etc."
								}
								logoUrl={
									"https://ethereum.org/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fimpact_transparent.7420c423.png&w=640&q=75"
								}
								className='bg-white shadow-md rounded-2xl p-6 mb-6'
							/>
							<div className='bg-white shadow-md rounded-2xl p-6 mb-6'>
								<div className='flex items-center gap-2 mb-4'>
									<div className='flex items-center justify-between w-full'>
										<div>
											<IoMdPaper className='text-4xl text-primary mb-2' />
											<h1 className='text-2xl font-bold'>Governance Proposals</h1>
										</div>
										<Link href={`${contr}/proposals`} className='btn btn-primary'>
											View All Proposals
										</Link>
									</div>
								</div>

								<small className='text-gray-600 mb-6'>
									Proposals are the backbone of DAO governance, allowing members to suggest changes, vote on initiatives, and shape
									the future of the organization. Here you can view active and closed proposals, as well as create new ones.
								</small>
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
							</div>
						</div>
						<div>
							<ContractInfo
								chain={"Ethereum Sepolia"}
								daoAddress={"0x993351f1315d5123231FDFe0020f106FC460E14E"}
								launchedDate={"June 2025"}
							/>
							<Assets />
						</div>
					</div>
				</div>
			</ViewTransition>
		</main>
	);
};

export default DashboardPage;
