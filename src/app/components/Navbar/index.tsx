import ConnectButton from "@/app/components/ConnectWalletButton";
import Link from "next/link";
import LogoZKDAO from "@/app/assets/zkDAOLogo.svg";
import Image from "next/image";
const Navbar = () => {
	return (
		<div className='navbar sticky top-0 z-50 backdrop-blur-sm'>
			<div className='flex-1'>
				<Link href='/' className='flex items-center px-2 transition-all hover:opacity-80' aria-label='ZKDAO Home'>
					<Image src={LogoZKDAO} alt='ZKDAO Logo' className='w-auto h-12 md:h-[50px]' priority />
				</Link>
			</div>
			<div className='flex-none'>
				<ConnectButton />
			</div>
		</div>
	);
};

export default Navbar;
