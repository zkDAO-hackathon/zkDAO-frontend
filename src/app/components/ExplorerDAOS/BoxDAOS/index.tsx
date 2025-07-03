"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useAccount } from "wagmi";
import CardDAO from "../CardDAO";

import { useRouter } from "next/navigation";
import { unstable_ViewTransition as ViewTransition } from "react";
import { useStore } from "@/app/store";

const CardSkeleton = () => (
	<div className='card bg-base-200 shadow-lg animate-pulse'>
		<div className='h-32 bg-base-300 rounded-t-lg'></div>
		<div className='card-body'>
			<div className='h-6 bg-base-300 rounded w-3/4 mb-2'></div>
			<div className='h-4 bg-base-300 rounded w-full mb-1'></div>
			<div className='h-4 bg-base-300 rounded w-5/6'></div>
		</div>
	</div>
);

const BoxDAOS = () => {
	const { daos } = useStore();
	const router = useRouter();
	const { isConnected: isAccountConnected } = useAccount();
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery]);

	useEffect(() => {
		if (debouncedSearchQuery) {
			console.log("Searching for:", debouncedSearchQuery);
		}
		// Simulate loading when search changes
		setIsLoading(true);
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 600);
		return () => clearTimeout(timer);
	}, [debouncedSearchQuery]);

	// Initial loading effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div className='mx-auto container px-4 py-8 relative'>
			<h2 className='text-3xl font-bold mb-4'>Explore</h2>
			<div className='flex items-center gap-4 mb-6'>
				<label className='input input-border rounded-full w-full '>
					<FaSearch />
					<input type='text' value={searchQuery} onChange={handleSearchChange} placeholder='Search DAOs...' />
				</label>
				<ViewTransition name='page-create-dao'>
					<button className='btn btn-primary rounded-full' disabled={!isAccountConnected} onClick={() => router.push("/create-dao")}>
						<FaPlus className='inline mr-2' />
						Create DAO
					</button>
				</ViewTransition>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
				{isLoading
					? // Show skeleton cards while loading
					  Array(6)
							.fill(0)
							.map((_, index) => <CardSkeleton key={index} />)
					: // Show actual DAO cards when loaded
					  daos
							.filter(
								(dao) =>
									dao.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
									dao.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
							)
							.map((dao, index) => (
								<CardDAO
									key={index}
									daoName={dao.name}
									daoDescription={dao.description}
									daoLogo={dao.logo}
									token={dao.token}
									governor={dao.governor}
									creator={dao.creator}
									daoId={dao.id.toString()}
								/>
							))}
			</div>
		</div>
	);
};

export default BoxDAOS;
