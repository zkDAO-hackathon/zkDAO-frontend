import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			<Navbar />

			<div className='mx-auto container px-4 py-8 relative'>{children}</div>

			<Footer />
		</main>
	);
};

export default Layout;
