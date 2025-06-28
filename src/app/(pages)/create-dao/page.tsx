"use client";
import CreateDaoForm from "@/app/components/CreateDaoForm";
import { useAccount } from "wagmi";
import Image from "next/image";
import SVG404V2 from "@/app/assets/404-v2.svg";
import { unstable_ViewTransition as ViewTransition } from "react";

const CreateDaoPage = () => {
	const { isConnected } = useAccount();

	if (!isConnected) {
		return (
			<main>
				<div className='text-center mt-10'>
					<Image src={SVG404V2} alt='Connect Wallet' width={500} height={150} className='mx-auto mb-4' />
					<h1 className='text-2xl font-bold'>Please connect your wallet to create a DAO</h1>
				</div>
			</main>
		);
	}

	return (
		<>
			<ViewTransition name='page-create-dao'>
				<CreateDaoForm />
			</ViewTransition>
		</>
	);
};

export default CreateDaoPage;
