// services/blockchain/ERC20TokenService.ts
import {
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
  formatUnits,
} from "viem";
import { erc20Abi } from "viem";
import { CHAINS, RPCS, TOKENS } from "@/app/config/const";

interface TokenInfo {
  address: Address;
  symbol: string;
  raw: bigint;
  formatted: string;
}

export class ERC20TokenService {
  private publicClient;
  private walletClient: WalletClient | null;

  constructor(
    private readonly network: keyof typeof TOKENS,
    walletClient?: WalletClient
  ) {
    this.publicClient = createPublicClient({
      chain: CHAINS[network],
      transport: http(RPCS[network]),
    });

    this.walletClient = walletClient ?? null;
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  private getTokenData(tokenKey: string) {
    const networkTokens = TOKENS[this.network];
    return networkTokens
      ? networkTokens[tokenKey as keyof typeof networkTokens]
      : undefined;
  }

  private getContract(address: Address) {
    return getContract({
      address,
      abi: erc20Abi,
      client: {
        public: this.publicClient,
        wallet: this.walletClient ?? undefined,
      },
    });
  }

  async getBalance(tokenKey: string, user: Address): Promise<string> {
    const token = this.getTokenData(tokenKey);
    if (!token) return "0";

    try {
      const contract = this.getContract(token.address as Address);
      const [balance, decimals] = await Promise.all([
        contract.read.balanceOf([user]),
        contract.read.decimals(),
      ]);

      return formatUnits(balance, decimals);
    } catch (error) {
      console.error(`❌ Error balance ${tokenKey}:`, error);
      return "0";
    }
  }

  async getAllowance(
    tokenKey: string,
    owner: Address,
    spender: Address
  ): Promise<string> {
    const token = this.getTokenData(tokenKey);
    if (!token) return "0";

    try {
      const contract = this.getContract(token.address as Address);
      const [allowance, decimals] = await Promise.all([
        contract.read.allowance([owner, spender]),
        contract.read.decimals(),
      ]);

      return formatUnits(allowance, decimals);
    } catch (error) {
      console.error(`❌ Error allowance ${tokenKey}:`, error);
      return "0";
    }
  }

  async getTokenInfo(
    tokenKey: string,
    user: Address
  ): Promise<TokenInfo | null> {
    const token = this.getTokenData(tokenKey);
    if (!token) return null;

    try {
      const contract = this.getContract(token.address as Address);
      const [balance, decimals] = await Promise.all([
        contract.read.balanceOf([user]),
        contract.read.decimals(),
      ]);

      return {
        address: token.address as Address,
        symbol: token.symbol,
        raw: balance,
        formatted: formatUnits(balance, decimals),
      };
    } catch (error) {
      console.error(`❌ Error info ${tokenKey}:`, error);
      return null;
    }
  }

  async approve(
    tokenKey: string,
    spender: Address,
    amount: bigint
  ): Promise<string | undefined> {
    const token = this.getTokenData(tokenKey);
    if (!token || !this.walletClient) return;

    try {
      const hash = await this.walletClient.writeContract({
        address: token.address as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
        chain: CHAINS[this.network],
        account: this.walletClient.account?.address as Address,
      });

      await this.publicClient.waitForTransactionReceipt({ hash });
      return hash;
    } catch (error) {
      console.error(`❌ Error approve ${tokenKey}:`, error);
      return undefined;
    }
  }
}
