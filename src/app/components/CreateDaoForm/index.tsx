"use client";
import { IDAO, ITokenRecipients } from "@/app/types/form.dao.types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CHAINS } from "@/app/helpers/list.chains";
import Image from "next/image";
import { FaCheck, FaCloudArrowUp, FaMinus, FaPlus } from "react-icons/fa6";
import { FaArrowLeft, FaArrowRight, FaExclamationTriangle, FaPaperPlane, FaPlusCircle } from "react-icons/fa";
import { Address } from "viem";

const CreateDaoForm = () => {
	const [step, setStep] = useState(1);
	const [numTokens, setNumTokens] = useState(0);
	const [address, setAddress] = useState<Address>();
	// This state is
	const [temporalRecipients, setTemporalRecipients] = useState<ITokenRecipients[]>([]);
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		trigger,
		getValues,
	} = useForm<IDAO>();
	const step1Fields = ["chain", "daoName", "daoDescription", "logo"] as const;

	const step2Fields = ["tokenName", "tokenSymbol"] as const;

	const step3Fields = ["date", "time", "proposalThreshold", "quorumFraction"] as const;

	const handleNextStep = async () => {
		const fieldsToValidate: (keyof IDAO)[] = [];

		if (step === 1) {
			fieldsToValidate.push(...step1Fields);
		} else if (step === 2) {
			fieldsToValidate.push(...step2Fields);
		} else if (step === 3) {
			fieldsToValidate.push(...step3Fields);
		}
		const isStepValid = await trigger(fieldsToValidate);

		if (isStepValid) {
			setStep((prevStep) => prevStep + 1);
		}
	};

	const handlePreviousStep = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const handleAddTemporalRecipients = () => {
		if (!address || !numTokens) {
			return;
		}
		if (address === "0x0000000000000000000000000000000000000000") {
			alert("Please enter a valid address.");
			return;
		}
		if (address && numTokens > 0) {
			const newRecipient: ITokenRecipients = {
				address,
				amount: numTokens,
			};
			setTemporalRecipients((prev) => [...prev, newRecipient]);
			setAddress("0x0000000000000000000000000000000000000000");
			setNumTokens(0);
		}
	};

	const onSubmit = (data: IDAO) => {
		console.log("Form submitted with data:", {
			...data,
			tokenRecipients: temporalRecipients,
		});
	};

	return (
		<div>
			<h1 className='text-3xl font-bold mb-6 text-center'>Create DAO</h1>
			<div className='flex justify-center flex-col items-center mb-8'>
				<h2 className='text-lg font-semibold mb-4 text-center'>
					Step {step} of 3<span className='text-sm text-gray-500'> - Fill out the form to create your DAO</span>
				</h2>
				<ul className='steps'>
					<li className={`step ${step >= 1 ? "step-primary" : ""}`}>DAO Details</li>
					<li className={`step ${step >= 2 ? "step-primary" : ""}`}>Token Setup</li>
					<li className={`step ${step >= 3 ? "step-primary" : ""}`}>Governance Settings</li>
				</ul>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='max-w-3xl mx-auto p-6 bg-base-100 rounded-lg shadow-md'>
				{step === 1 && (
					<>
						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='daoName' className='text-2xl font-semibold'>
								Select a Chain{" "}
							</label>
							<p className='text-gray-600 mb-4'>
								The chain you choose is where your DAO and tokens will be deployed. If you already have a token, select the chain your
								token is on.
							</p>
							<div className='grid grid-cols-1 gap-4'>
								{CHAINS.map((chain) => (
									<div key={chain.id} className='relative'>
										<input
											id={chain.id}
											value={chain.id}
											type='radio'
											className='peer hidden'
											required
											{...register("chain", { required: true, validate: (value) => value !== "" })}
										/>
										<label
											htmlFor={chain.id}
											className={`flex items-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                                                ${
													watch("chain") === chain.id
														? "bg-primary/10 border-primary shadow-sm"
														: "bg-base-200 border-base-300 hover:bg-base-300"
												}`}>
											<div className='flex items-center w-full gap-3'>
												<div className='flex-shrink-0'>
													<Image
														src={chain.logo}
														alt={`${chain.name} logo`}
														width={28}
														height={28}
														className='rounded-full'
													/>
												</div>
												<div className='flex flex-col'>
													<span className='font-medium'>{chain.name}</span>
													{chain.isTesnet && <span className='text-xs text-error'>Testnet</span>}
												</div>
												<div className='ml-auto'>
													{watch("chain") === chain.id && (
														<div className='text-primary'>
															<FaCheck className='text-lg' />
														</div>
													)}
												</div>
											</div>
										</label>
									</div>
								))}
								{errors.chain && (
									<span className='text-error text-sm mt-1'>
										{" "}
										<FaExclamationTriangle className='inline mr-2' />
										Please select a chain
									</span>
								)}
							</div>
						</div>
						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='daoName' className='text-2xl font-semibold'>
								DAO Name
							</label>
							<input
								type='text'
								{...register("daoName", { required: true })}
								id='daoName'
								className='input input-border w-full'
								placeholder='Enter DAO Name'
							/>
							{errors.daoName && (
								<span className='text-error text-sm mt-1'>
									{" "}
									<FaExclamationTriangle className='inline mr-2' />
									DAO name is required
								</span>
							)}
						</div>

						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='daoDescription' className='text-2xl font-semibold'>
								DAO Description
							</label>
							<textarea {...register("daoDescription", { required: true })} className='textarea w-full' placeholder='DAO Description' />
							{errors.daoDescription && (
								<span className='text-error text-sm mt-1'>
									{" "}
									<FaExclamationTriangle className='inline mr-2' />
									DAO description is required
								</span>
							)}
						</div>
						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='logo' className='text-2xl font-semibold'>
								DAO Logo
							</label>
							<div className='flex flex-col gap-3'>
								<div className='relative border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors rounded-xl p-6'>
									<input
										type='file'
										id='logo'
										accept='image/*'
										{...register("logo", { required: true })}
										className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
									/>
									<div className='flex flex-col items-center justify-center gap-2 text-center'>
										<div className='p-3 rounded-full bg-primary/10'>
											<FaCloudArrowUp className='text-primary text-3xl' />
										</div>
										<div>
											<p className='font-medium'>Click for add image</p>
											<p className='text-sm text-gray-500'>SVG, PNG, o JPG (máx. 2MB)</p>
										</div>
									</div>
								</div>

								{watch("logo") && (watch("logo") as unknown as FileList)?.[0] && (
									<div className='mt-2 flex justify-center'>
										<div className='relative w-28 h-28 rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg'>
											<Image
												src={URL.createObjectURL((watch("logo") as unknown as FileList)[0])}
												alt='Logo preview'
												fill
												className='object-cover'
											/>
											<div className='absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 truncate'>
												{(watch("logo") as unknown as FileList)[0].name}
											</div>
										</div>
									</div>
								)}
							</div>
							{errors.logo && (
								<span className='text-sm mt-1 text-error'>
									<FaExclamationTriangle className='inline mr-2' />
									DAO Logo
								</span>
							)}
						</div>
					</>
				)}
				{step === 2 && (
					<>
						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='tokenName' className='text-2xl font-semibold'>
								Token Name
							</label>
							<input
								type='text'
								{...register("tokenName", { required: true })}
								id='tokenName'
								className='input input-border w-full'
								placeholder='Enter Token Name'
							/>
							{errors.tokenName && (
								<span className='text-error text-sm'>
									<FaExclamationTriangle className='inline mr-2' />
									The token name is required
								</span>
							)}
						</div>

						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='tokenSymbol' className='text-2xl font-semibold'>
								Token Symbol
							</label>
							<input
								type='text'
								{...register("tokenSymbol", { required: true })}
								id='tokenSymbol'
								className='input input-border w-full'
								placeholder='Enter Token Symbol'
							/>
							{errors.tokenSymbol && (
								<span className='text-error text-sm'>
									<FaExclamationTriangle className='inline mr-2' />
									The token symbol is required
								</span>
							)}
						</div>

						<div className='flex flex-col gap-4 mb-6'>
							<div className='flex justify-between items-center'>
								<label htmlFor='tokenRecipients' className='text-2xl font-semibold'>
									Token Recipients
								</label>
								{temporalRecipients.length > 0 && (
									<span className='badge badge-primary p-3'>
										{temporalRecipients.reduce((sum, recipient) => sum + recipient.amount, 0)}
										{getValues("tokenSymbol") ? ` ${getValues("tokenSymbol")}` : " tokens"}
									</span>
								)}
							</div>
							<p className='text-gray-600 mb-2'>Add the addresses and amounts of the initial token distribution.</p>

							<div className='card bg-base-100 p-4 shadow-sm border border-base-200'>
								<div className='flex flex-col md:flex-row gap-4'>
									<input
										type='text'
										className='input input-border w-full'
										placeholder='0x0000...000'
										value={address}
										onChange={(e) => setAddress(e.target.value as Address)}
									/>

									<div className='join border rounded-2xl border-base-300'>
										<button
											type='button'
											className='join-item btn btn-ghost'
											onClick={() => setNumTokens((prev: number) => Math.max(prev - 1, 0))}>
											<FaMinus />
										</button>
										<input
											type='number'
											max={1000}
											min={1}
											className='input join  text-center'
											value={numTokens}
											placeholder='0'
											onChange={(e) => setNumTokens(Number(e.target.value))}
										/>
										<button
											type='button'
											className='join-item btn btn-ghost'
											onClick={() => setNumTokens((prev: number) => Math.min(prev + 1, 1000))}>
											<FaPlus />
										</button>
									</div>
									<button
										type='button'
										className='btn btn-primary'
										onClick={handleAddTemporalRecipients}
										disabled={!address || numTokens <= 0}>
										<FaPlusCircle className='mr-2' /> Add Recipient
									</button>
								</div>
							</div>

							{errors.tokenRecipients && (
								<span className='text-error text-sm mt-1'>
									<FaExclamationTriangle className='inline mr-2' />
									Token recipients are required
								</span>
							)}

							{temporalRecipients.length > 0 && (
								<div className='mt-4'>
									<h3 className='text-lg font-semibold mb-2'>Current Recipients</h3>
									<div className='grid gap-3'>
										{temporalRecipients.map((recipient, index) => (
											<div
												key={index}
												className='flex items-center gap-2 p-4 rounded-xl bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all'>
												<div className='flex-grow overflow-hidden'>
													<div className='font-medium text-sm md:text-base truncate'>{recipient.address}</div>
													<div className='text-sm text-gray-600'>
														{recipient.amount} {getValues("tokenSymbol") || "Tokens"}
													</div>
												</div>
												<button
													type='button'
													className='btn btn-error btn-sm'
													onClick={() => setTemporalRecipients((prev) => prev.filter((_, i) => i !== index))}>
													<FaMinus />
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							{temporalRecipients.length === 0 && (
								<div className='text-center p-8 border border-dashed border-base-300 rounded-xl mt-4'>
									<p className='text-gray-500'>No recipients added yet. Add your first token recipient above.</p>
								</div>
							)}
						</div>
					</>
				)}
				{step === 3 && (
					<>
						<div className='mb-8'>
							<h3 className='text-2xl font-semibold mb-2'>Governance Timeline</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='flex flex-col gap-2'>
									<label htmlFor='date' className='text-lg font-medium'>
										DAO Ending Date
									</label>
									<input type='date' {...register("date", { required: true })} id='date' className='input input-border w-full' />
									{errors.date && (
										<span className='text-error text-sm'>
											<FaExclamationTriangle className='inline mr-2' />
											Date is required
										</span>
									)}
								</div>

								<div className='flex flex-col gap-2'>
									<label htmlFor='time' className='text-lg font-medium'>
										DAO Ending Time
									</label>
									<input type='time' {...register("time", { required: true })} id='time' className='input input-border w-full' />
									{errors.time && (
										<span className='text-error text-sm'>
											<FaExclamationTriangle className='inline mr-2' />
											Time is required
										</span>
									)}
								</div>
							</div>
						</div>

						<div className='mb-8'>
							<h3 className='text-2xl font-semibold mb-2'>Governance Parameters</h3>
							<p className='text-gray-600 mb-4'>Configure the voting thresholds for your DAO governance.</p>

							<div className='card p-5 mb-6'>
								<label htmlFor='proposalThreshold' className='text-lg font-medium'>
									Proposal Threshold
								</label>
								<p className='text-sm text-gray-500 mb-3'>Minimum percentage of tokens needed to submit a proposal.</p>
								<div className='flex items-center gap-4'>
									<input
										type='range'
										min={0}
										max='100'
										className='range range-primary flex-grow'
										{...register("proposalThreshold", { required: true })}
									/>
									<div className='badge badge-primary text-lg p-3'>{watch("proposalThreshold") || 0}%</div>
								</div>
								{errors.proposalThreshold && (
									<span className='text-error text-sm mt-2 block'>
										<FaExclamationTriangle className='inline mr-2' />
										Proposal threshold is required
									</span>
								)}
							</div>

							<div className='card  p-5'>
								<label htmlFor='quorumFraction' className='text-lg font-medium'>
									Quorum Fraction
								</label>
								<p className='text-sm text-gray-500 mb-3'>Minimum percentage of tokens that must participate for a vote to pass.</p>
								<div className='flex items-center gap-4'>
									<input
										type='range'
										min={0}
										max='100'
										className='range range-primary flex-grow'
										{...register("quorumFraction", { required: true })}
									/>
									<div className='badge badge-primary text-lg p-3'>{watch("quorumFraction") || 0}%</div>
								</div>
								{errors.quorumFraction && (
									<span className='text-error text-sm mt-2 block'>
										<FaExclamationTriangle className='inline mr-2' />
										Quorum fraction is required
									</span>
								)}
							</div>
						</div>
					</>
				)}

				<div className='flex justify-between gap-4 mt-6'>
					{step > 1 && (
						<button type='button' className='btn btn-secondary btn-lg' onClick={handlePreviousStep}>
							<FaArrowLeft className='inline mr-2' />
							Back
						</button>
					)}

					{step < 3 ? (
						<button type='button' className='btn btn-primary ml-auto btn-lg' onClick={() => handleNextStep()}>
							Next <FaArrowRight className='inline ml-2' />
						</button>
					) : (
						<button type='submit' className='btn btn-success ml-auto btn-lg'>
							<FaPaperPlane className='inline mr-2' />
							Create DAO
						</button>
					)}
				</div>
			</form>
		</div>
	);
};
export default CreateDaoForm;
