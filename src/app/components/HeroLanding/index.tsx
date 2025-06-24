const HeroLanding = () => {
	return (
		<div className='hero min-h-100 relative overflow-hidden top-[-64px]'>
			{/* Background gradients */}
			<div className='absolute top-0 z-[-2] h-screen w-screen  bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]'></div>
			<div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]'></div>

			{/* Content */}
			<div className='relative mx-auto container px-4 py-16'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
					<div className='flex flex-col justify-center space-y-6'>
						<h1 className='text-5xl md:text-6xl font-bold text-center lg:text-start leading-tight'>Governed on ZKDAO</h1>
						<p className='text-lg text-gray-700 text-center lg:text-start max-w-xl'>
							Explore the organizations using our modular governance stack to secure their onchain governance.
						</p>
					</div>

					<div className='hidden lg:flex justify-center'></div>
				</div>
			</div>
		</div>
	);
};
export default HeroLanding;
