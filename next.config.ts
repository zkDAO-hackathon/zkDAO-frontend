import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		NEXT_PROJECT_ID: process.env.NEXT_PROJECT_ID,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",

				pathname: "**",
			},
		],
	},
};

export default nextConfig;
