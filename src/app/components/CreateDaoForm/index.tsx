"use client";
import { IDAO, ITokenRecipients } from "@/app/types/form.dao.types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CHAINS } from "@/app/helpers/list.chains";
import Image from "next/image";
import { FaCheck, FaCloudArrowUp, FaMinus, FaPlus } from "react-icons/fa6";
import { FaArrowLeft, FaArrowRight, FaExclamationTriangle, FaPlusCircle } from "react-icons/fa";
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

			<form onSubmit={handleSubmit((data) => console.log(data))} className='mx-auto container px-4 py-8'>
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
								<span className='text-error'>
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
								<span className='text-error'>
									<FaExclamationTriangle className='inline mr-2' />
									The token symbol is required
								</span>
							)}
						</div>

						{/* add the token recepients */}
						<div className='flex flex-col gap-4 mb-6'>
							<label htmlFor='tokenRecipients' className='text-2xl font-semibold'>
								Token Recipients
							</label>
							<p className='text-gray-600 mb-2'>Add the addresses and amounts of the initial token distribution.</p>
							<div className='flex gap-4'>
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
										type='text'
										max={1000}
										min={1}
										maxLength={10}
										className='input  join'
										value={numTokens}
										readOnly
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
								<button type='button' className='btn btn-primary' onClick={handleAddTemporalRecipients}>
									<FaPlusCircle />
								</button>
							</div>
							{errors.tokenRecipients && (
								<span className='text-error text-sm mt-1'>
									{" "}
									<FaExclamationTriangle className='inline mr-2' />
									Token recipients are required
								</span>
							)}
							{temporalRecipients.length > 0 && (
								<div className='mt-4'>
									<h3 className='text-lg font-semibold mb-2'>Current Recipients</h3>
									<ul className='list-disc pl-5'>
										{temporalRecipients.map((recipient, index) => (
											<li key={index} className='flex items-center gap-2 mb-1 shadow-sm p-4 rounded-2xl bg-base-100'>
												<span className='font-medium'>{recipient.address}</span> -{" "}
												<span className='text-sm text-gray-600'>
													{recipient.amount} {getValues("tokenSymbol") || "Tokens"}
												</span>
												<button
													type='button'
													className='btn btn-error ml-auto'
													onClick={() => setTemporalRecipients((prev) => prev.filter((_, i) => i !== index))}>
													<FaMinus />
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
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
						<button type='submit' className='btn btn-success ml-auto'>
							Create DAO
						</button>
					)}
				</div>
			</form>
		</div>
	);
};
export default CreateDaoForm;
