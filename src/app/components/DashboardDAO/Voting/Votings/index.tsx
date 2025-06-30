interface VoteOptionProps {
	emoji: string;
	type: "yes" | "no" | "abstain";
	label: string;
	tokens: number | string;
}

const VoteOption = ({ emoji, type, label, tokens }: VoteOptionProps) => {
	const getColorClass = () => {
		switch (type) {
			case "yes":
				return "bg-success/10 border-success text-success";
			case "no":
				return "bg-error/10 border-error text-error";
			case "abstain":
				return "bg-neutral/10 border-neutral text-neutral";
			default:
				return "bg-base-200";
		}
	};

	return (
		<div className={`card border ${getColorClass()} transition-all hover:shadow-md`}>
			<div className='card-body p-4'>
				<div className='flex items-center flex-col justify-center gap-3 mb-2'>
					<span className='text-2xl'>{emoji}</span>
					<h4 className='font-medium text-lg'>{label}</h4>
				</div>
			</div>
			<div className='flex justify-center flex-col w-full items-center p-4 border-t'>
				<span className='font-medium text-2xl'>{tokens}</span>
				<p>Tokens</p>
			</div>
		</div>
	);
};

export default VoteOption;
