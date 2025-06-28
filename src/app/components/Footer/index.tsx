import Link from "next/link";
import Image from "next/image";
import LogoZKDAO from "@/app/assets/zkDAOLogo.svg";

const Footer = () => {
	return (
		<footer className='footer footer-horizontal footer-center p-10'>
			<aside>
				<Link href='/' className='flex items-center px-2 transition-all hover:opacity-80' aria-label='ZKDAO Home'>
					<Image src={LogoZKDAO} alt='ZKDAO Logo' className='w-auto h-12 md:h-[50px]' priority />
				</Link>

				<p>Copyright © {new Date().getFullYear()} - All right reserved</p>
			</aside>
		</footer>
	);
};
export default Footer;
