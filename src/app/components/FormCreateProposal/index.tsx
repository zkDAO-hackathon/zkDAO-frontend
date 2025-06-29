import Modal from "../Modal";
import { IProposal } from "@/app/types/proposal.type";
import { useForm } from "react-hook-form";

const FormCreateProposal = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IProposal>();

	const onSubmit = (data: IProposal) => {
		console.log(data);
	};

	return (
		<Modal id='form-create-proposal'>
			<h3 className='font-bold text-lg'>Create Proposal</h3>
			<div className='py-4 w-full'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='form-control w-full'>
						<label className='label'>
							<span className='label-text'>Title</span>
						</label>
						<input
							{...register("title", { required: "Title is required" })}
							type='text'
							placeholder='Proposal Title'
							className='input input-bordered w-full'
						/>
						{errors.title && <span className='text-error text-sm mt-1'>{errors.title.message}</span>}
					</div>
					<div className='form-control w-full mt-4'>
						<label className='label'>
							<span className='label-text'>Description</span>
						</label>
						<textarea
							{...register("description", { required: "Description is required" })}
							placeholder='Proposal Description'
							className='textarea textarea-bordered w-full'></textarea>
						{errors.description && <span className='text-error text-sm mt-1'>{errors.description.message}</span>}
					</div>
					<div className='mt-6 flex justify-end'>
						<button type='submit' className='btn btn-primary'>
							Create Proposal
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
};
export default FormCreateProposal;
