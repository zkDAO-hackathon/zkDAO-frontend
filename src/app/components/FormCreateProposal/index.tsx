import Modal from "../Modal";

const FormCreateProposal = () => {
	return (
		<Modal id='form-create-proposal'>
			<h3 className='font-bold text-lg'>Create Proposal</h3>
			<div className='py-4 w-full'>
				<form>
					<div className='form-control w-full'>
						<label className='label'>
							<span className='label-text'>Title</span>
						</label>
						<input type='text' placeholder='Proposal Title' className='input input-bordered w-full ' />
					</div>
					<div className='form-control w-full mt-4'>
						<label className='label'>
							<span className='label-text'>Description</span>
						</label>
						<textarea placeholder='Proposal Description' className='textarea textarea-bordered w-full'></textarea>
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
