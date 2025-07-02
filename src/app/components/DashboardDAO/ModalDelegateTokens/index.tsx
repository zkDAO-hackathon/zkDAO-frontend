import Modal from "../../Modal";
import { useForm } from "react-hook-form";
import { IDelegateTokens } from "@/app/types/delegate.types";
import { toast } from "sonner";
import { useAccount, useWalletClient } from "wagmi";
import { ZKDAO_JSON } from "@/app/config/const";
import { GovernorContract } from "@/app/services/blockchain/contracts/governor";

const ModalDelegateTokens = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IDelegateTokens>();

	const { chainId } = useAccount();
	const { data: walletClient } = useWalletClient();
	const network = chainId === 11155111 ? "sepolia" : "avalancheFuji";
	const governor = new GovernorContract(network, ZKDAO_JSON.address as `0x${string}`, walletClient);

	const onSubmit = async (data: IDelegateTokens) => {
		toast.promise(governor.delegateVotes(data.address as `0x${string}`), {
			loading: "Delegating tokens...",
			success: "Tokens delegated successfully",
			error: "Error delegating tokens",
		});
	};

	return (
		<Modal id='delegate-modal'>
			<h2 className='text-xl font-bold mb-2'>Delegate Tokens</h2>
			<p className='text-gray-600 mb-4'>This feature allows you to delegate your tokens to a DAO.</p>

			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Recipient Address</span>
					</label>
					<input
						type='text'
						placeholder='0x...'
						className={`input input-bordered w-full ${errors.address ? "input-error" : ""}`}
						{...register("address", {
							required: "Address is required",
							pattern: {
								value: /^0x[a-fA-F0-9]{40}$/,
								message: "Please enter a valid Ethereum address",
							},
						})}
					/>
					{errors.address && <span className='text-error text-sm'>{errors.address.message}</span>}
				</div>

				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Value Tokens</span>
						<span className='label-text-alt'>Available: 0.0</span>
					</label>
					<input
						type='number'
						step='any'
						min='0'
						placeholder='0.0'
						className={`input input-bordered w-full ${errors.valueTokens ? "input-error" : ""}`}
						{...register("valueTokens", {
							required: "Value tokens are required",
							min: {
								value: 0.000001,
								message: "Value must be greater than 0",
							},
						})}
					/>
					{errors.valueTokens && <span className='text-error text-sm'>{errors.valueTokens.message}</span>}
				</div>

				<div className='flex gap-2 mt-4'>
					<button type='submit' className='btn btn-primary flex-1'>
						Delegate
					</button>
				</div>
			</form>
		</Modal>
	);
};
export default ModalDelegateTokens;
