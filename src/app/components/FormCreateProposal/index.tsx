"use client";
import Modal from "../Modal";
import { IProposal } from "@/app/types/proposal.type";
import { useForm } from "react-hook-form";
import { ZKDAO_JSON } from "@/app/config/const";

import { GovernorContract } from "@/app/services/blockchain/contracts/governor";
import { useAccount } from "wagmi";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";
import { closeModal } from "@/app/helpers/actions.modal";
import { useState } from "react";

const FormCreateProposal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { chainId, address } = useAccount();
	const { data: walletClient } = useWalletClient();
	const network = chainId === 11155111 ? "sepolia" : "avalancheFuji";
	const governor = new GovernorContract(network, ZKDAO_JSON.address as `0x${string}`, walletClient);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IProposal>();

	const onSubmit = (data: IProposal) => {
		setIsLoading(true);
		if (!walletClient) {
			toast.error("Wallet client is not available");
			setIsLoading(false);
			return;
		}

		governor.setWalletClient(walletClient);

		if (!address) {
			setIsLoading(false);
			toast.error("Wallet address is not available");
			return;
		}

		// parse the amount to BigInt and ensure it's in wei
		const amount = BigInt(data.amount || 0);
		if (amount <= 0) {
			setIsLoading(false);
			toast.error("Amount must be greater than zero");
			return;
		}
		toast.promise(governor.createProposal(address, data.description, BigInt(amount)), {
			loading: "Creating proposal...",
			success: () => {
				reset();
				closeModal("form-create-proposal");
				setIsLoading(false);
				window.location.reload();
				return "Proposal created successfully";
			},
			error: () => {
				setIsLoading(false);
				return "Error creating proposal";
			},
		});
	};

	return (
		<Modal id='form-create-proposal'>
			<h3 className='font-bold text-lg'>Create Proposal</h3>
			<div className='py-4 w-full'>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* proposer */}
					<div className='form-control w-full'>
						<label className='label'>
							<span className='label-text font-medium'>Proposer</span>
							<span className='label-text-alt text-gray-500'>Your wallet address</span>
						</label>
						<input type='text' {...register("proposer", { required: true })} className='input input-bordered w-full' />
						<span className='text-xs text-gray-500 mt-1'>Your wallet address that will propose this action</span>
					</div>
					<div className='form-control w-full'>
						<label className='label'>
							<span className='label-text font-medium'>Description</span>
							<span className='label-text-alt text-gray-500'>Required</span>
						</label>
						<textarea
							{...register("description", {
								required: "Description is required",
								minLength: { value: 2, message: "Description should be at least 2 characters" },
							})}
							placeholder='Explain what this proposal is about'
							className='textarea textarea-bordered w-full min-h-[120px]'></textarea>
						{errors.description && <span className='text-error text-sm mt-1'>{errors.description.message}</span>}
					</div>

					<div className='form-control w-full mt-4'>
						<label className='label'>
							<span className='label-text font-medium'>Amount</span>
							<span className='label-text-alt text-gray-500'>Required</span>
						</label>
						<div className='relative'>
							<input
								{...register("amount", {
									required: "Amount is required",
									validate: (value) => Number(value) > 0 || "Amount must be greater than zero",
								})}
								type='number'
								step='any'
								placeholder='Enter amount'
								className='input input-bordered w-full'
							/>
							<span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500'>ETH</span>
						</div>
						<span className='text-xs text-gray-500 mt-1'>The amount of ETH for this proposal</span>
						{errors.amount && <span className='text-error text-sm mt-1'>{errors.amount.message}</span>}
					</div>

					<div className='mt-6 flex justify-end gap-2'>
						<button type='submit' className='btn btn-primary' disabled={isLoading}>
							Create Proposal
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};
export default FormCreateProposal;
