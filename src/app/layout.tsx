import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContextProvider from "./WalletContextProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "zkDAO",
	description: "Explore and create DAOs on zkSync Era",
	icons: {
		icon: "/zKDAO.png",
		shortcut: "/zKDAO.png",
		apple: [
			{
				url: "/zKDAO.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' data-theme='light'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Toaster position='top-center' invert={false} theme='light' visibleToasts={5} closeButton={true} duration={5000} richColors={true} />

				<ContextProvider cookies={null}>{children}</ContextProvider>
			</body>
		</html>
	);
}
