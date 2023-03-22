import { ethers } from "ethers";
import { networks } from "./network.util";
import Factory from "../contracts/Factory.sol/Factory.json";
import Generator from "../contracts/FarmGenerator.sol/FarmGenerator.json";
import Farm from "../contracts/Farm.sol/Farm.json";
import SwapFactory from "../contracts/interfaces/IUniFactory.sol/IUniFactory.json";
import Pair from "../contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json";
import Router from "../contracts/interfaces/IUniswapV2Router01.sol/IUniswapV2Router01.json";
import Pool from "../contracts/interfaces/pool/IUniswapV3PoolImmutables.sol/IUniswapV3PoolImmutables.json";
import SFactory from "../contracts/PoolFactory.sol/PoolFactory.json";
import SGenerator from "../contracts/PoolGenerator.sol/PoolGenerator.json";
import SPool from "../contracts/Pool.sol/Pool.json";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export const address = {
  56: {
    0: {
      factory: "0xF854E75B77d92d11579442cd9c36980Ed39fe68d",
      generator: "0x9C2D0018986FEd97c5EFE7569020ea4108646740",
      wether: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      sfactory: "0xD2fc6F5cFAbd74E0db78BE3449C6cf1059f863DF",
      sgenerator: "0xF56A3531D06453376Ae2ab92e6A27b76B9d718b6",
    },
  },
  97: {
    0: {
      factory: "0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270",
      generator: "0x747e47410DA188885E4717202786490122b9475b",
      rewardToken: "0x75D8D5989fd5df9358adeadDeEC21d04227c2cAA",
      wether: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      sfactory: "0xCBC8fEb8aD4aa4D1caaDDE45CBA24FB70fb219a9",
      sgenerator: "0x5232c97D6bf528FC2B386798cF990EE1e38A3459",
    },
  },
  43114: {
    0: {
      factory: "0xafdC15eD96544f4Dc7bB3997f723A3F333eEE994",
      generator: "0xfeaB072417019a9b2Dc1c6940c31845354a3d0E7",
      wether: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      sfactory: "0x5997c902700D4a35456ee6BEC69699E2F57486F1",
      sgenerator: "0xAa33efd126a446a1F518880bBEA0Ce3a740f5C39",
    },
    1: {
      factory: "0x0100e4D763bA57C0DCAa5E3D4cBb5A51f65e2846",
      generator: "0x3fa9b82Dd7db611242b6B0C67EaC1bb580F2259e",
    },
  },
  4: {
    factory: "0x587a39A679994B9E6BA1F6e29Eb0ebA20Df42abF",
    generator: "0x40275f985d891cd73E5b594faaEb01f99142F46C",
    rewardToken: "0xBd83855cfADe70EDA1f93080c32387d93Dc39BE1",
    sfactory: "0x36f708Cd37f35e9517Be6F1F6D0f3b52b9898799",
    sgenerator: "0x1e10444e7280f1f1A353c5436cfEc2CB27c63F66",
    wether: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  },
};

export const coinSymbols = {
  97: "BNB",
  43114: "AVAX",
  4: "ETHER",
  56: "BNB",
};

export const swapFactories = {
  97: {
    0: {
      uniswap: "0xb7926c0430afb07aa7defde6da862ae0bde767bc",
      router: "0x6e889755Ea9eCc99bFd71Ee5d666E69Ce32A3D06",
    },
  },
  43114: {
    0: {
      uniswap: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
      router: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
    },
    1: {
      uniswap: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
      router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
    },
  },
  56: {
    0: {
      uniswap: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    },
  },
};
// providers

export const factory = (chain, index) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  return new ethers.Contract(
    address[chain][index]["factory"],
    Factory.abi,
    provider
  );
};

const timePerBlockF = async (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );

  const latestBlockNumber = await provider.getBlockNumber();
  const latestBlock = await provider.getBlock(latestBlockNumber);
  const block1000Ago = await provider.getBlock(latestBlockNumber - 10000);
  const timePerBlock = (latestBlock.timestamp - block1000Ago.timestamp) / 10000;
  return { timePerBlock, latestBlockNumber, latestBlock }
}

export const blocknumTotimestamp = async (chain, blocknum) => {
  const timePerBlock = await timePerBlockF(chain);
  const timestamp = timePerBlock.latestBlock.timestamp + ((blocknum - timePerBlock.latestBlockNumber) * timePerBlock.timePerBlock)
  return timestamp.toFixed(0);
}

export const timestampToblocknum = async (chain, timestamp) => {
  const timePerBlock = await timePerBlockF(chain);
  const blockNumber = timePerBlock.latestBlockNumber + ((Number(timestamp) - new Date().valueOf() / 1000) / timePerBlock.timePerBlock);
  return blockNumber.toFixed(0);
}

export const provider = (chain) => {
  return new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
}

export const factoryWeb3 = (chain, signer, index) => {
  return new ethers.Contract(
    address[chain][index]["factory"],
    Factory.abi,
    signer
  );
};

export const generator = (chain, index) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  return new ethers.Contract(
    address[chain][index]["generator"],
    Generator.abi,
    provider
  );
};
export const generatorWeb3 = (chain, signer, index) => {
  return new ethers.Contract(
    address[chain][index]["generator"],
    Generator.abi,
    signer
  );
};

export const swapFactory = (chain, index) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  return new ethers.Contract(
    swapFactories[chain][index]["uniswap"],
    SwapFactory.abi,
    provider
  );
};

export const pair = (chain, pairAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  return new ethers.Contract(pairAddress, Pair.abi, provider);
};

export const pool = (chain, poolAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  return new ethers.Contract(poolAddress, Pool.abi, provider);
};

export const routerWeb3 = (chain, signer) => {
  const contract = new ethers.Contract(
    swapFactories[chain][0]["router"],
    Router.abi,
    signer
  );
  return contract;
};

export const farm = (chain, farmAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  const contract = new ethers.Contract(farmAddress, Farm.abi, provider);
  return contract;
};

export const farmWeb3 = (farmAddress, signer) => {
  const contract = new ethers.Contract(farmAddress, Farm.abi, signer);
  return contract;
};

export const tokenContract = (chain, tokenAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  return contract;
};

export const tokenWeb3 = (tokenAddress, signer) => {
  const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  return contract;
};

// staking pool

export const sfactory = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  const contract = new ethers.Contract(
    address[chain][0]["sfactory"],
    SFactory.abi,
    provider
  );
  return contract;
};

export const sfactoryWeb3 = (chain, signer) => {
  const contract = new ethers.Contract(
    address[chain][0]["sfactory"],
    SFactory.abi,
    signer
  );
  return contract;
};

export const sgenerator = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  const contract = new ethers.Contract(
    address[chain][0]["sgenerator"],
    SGenerator.abi,
    provider
  );
  return contract;
};

export const sgeneratorWeb3 = (chain, signer) => {
  const contract = new ethers.Contract(
    address[chain][0]["sgenerator"],
    SGenerator.abi,
    signer
  );
  return contract;
};

export const spool = (chain, poolAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chain].rpcUrls[0]
  );
  const contract = new ethers.Contract(poolAddress, SPool.abi, provider);
  return contract;
};

export const spoolWeb3 = (poolAddress, signer) => {
  const contract = new ethers.Contract(poolAddress, SPool.abi, signer);
  return contract;
};

export const walletConnect = (chain) => {
  return new WalletConnectConnector({
    rpcUrl: networks[chain].rpcUrls[0],
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
  });
};

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 97, 56, 43114],
});

export const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];
