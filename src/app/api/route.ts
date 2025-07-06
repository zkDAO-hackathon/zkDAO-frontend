import axios, { AxiosError } from "axios";
import { GenerateZkProofParams } from "../services/http/circuit-proof";

export async function POST(req: Request) {
	// async generateZKProof(zkProofParams: GenerateZkProofParams): Promise<{
	// 	proofBytes: string;
	// 	publicInputs: string[];
	// 	proof: Uint8Array<ArrayBufferLike>;
	// }> {
	// 	const url = `https://zk-service.kaiser-soft.com/generate-zk-proof`;
	// 	console.log(`🌐 Generating ZK proof at: ${url}`);

	// 	try {
	// 		const response = await axios.post<{
	// 			proofBytes: string;
	// 			publicInputs: string[];
	// 			proof: Uint8Array<ArrayBufferLike>;
	// 		}>(url, zkProofParams);

	// 		const data = response.data;

	// 		return data;
	// 	} catch (error) {
	// 		console.error("❌ Failed to fetch ZK proof:", error);

	// 		if (axios.isAxiosError(error)) {
	// 			const axiosError = error as AxiosError;
	// 			if (axiosError.response) {
	// 				throw new Error(`HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`);
	// 			} else if (axiosError.request) {
	// 				throw new Error("No response received from server");
	// 			} else {
	// 				throw new Error(`Request setup error: ${axiosError.message}`);
	// 			}
	// 		}

	// 		throw new Error(`Failed to fetch Merkle proof: ${(error as Error).message}`);
	// 	}
	// }
	const requestData = await req.json();
	const zkProofParams = requestData as GenerateZkProofParams;

	console.log("🌐 Generating ZK proof with params:", zkProofParams);

	const url = `https://zk-service.kaiser-soft.com/generate-zk-proof`;
	try {
		const response = await axios.post<{
			proofBytes: string;
			publicInputs: string[];
			proof: Uint8Array<ArrayBufferLike>;
		}>(url, zkProofParams);

		const data = response.data;

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("❌ Failed to fetch ZK proof:", error);

		let errorMessage = "Unknown error occurred";
		let statusCode = 500;

		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			if (axiosError.response) {
				statusCode = axiosError.response.status || 500;
				errorMessage = `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`;
			} else if (axiosError.request) {
				errorMessage = "No response received from server";
			} else {
				errorMessage = `Request setup error: ${axiosError.message}`;
			}
		} else {
			errorMessage = `Failed to fetch Merkle proof: ${(error as Error).message}`;
		}

		return new Response(JSON.stringify({ error: errorMessage }), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
