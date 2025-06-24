import ConnectButton from "@/app/components/ConnectWalletButton";
const Navbar = () => {
	return (
		<div className='navbar sticky top-0 z-50 backdrop-blur-sm bg-white/10'>
			<div className='flex-1'>
				<a className='btn btn-ghost text-xl'>zkDAO</a>
			</div>
			<div className='flex-none'>
				<ConnectButton />
			</div>
		</div>
	);
};

export default Navbar;
