import { ethers } from "ethers"
import { network, networks } from "./network.util"
import Factory from '../contracts/Factory.sol/Factory.json';
import Generator from '../contracts/FarmGenerator.sol/FarmGenerator.json';
import Farm from '../contracts/Farm.sol/Farm.json';
import SwapFactory from '../contracts/interfaces/IUniFactory.sol/IUniFactory.json';

export const address = {
  97: {
    factory: "0x9b5bA1Ff5b3238A2822c665B2E5129bF0308C584",
    generator: "0x54c5926Ccb210D65C37B8AeDA654F40b72Ee8C0A",
    rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
  },
  43113: {
    factory: "0x1CA19537511171B4ce1f3d5Bd2785F7277BC4616",
    generator: "0x4f43f67E059aa56fd038A590A43a906b59CbB581",
    rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
  },
  4: {
    factory: "0xFb2863C3d2859F1c18d1F607730C816C51919DAf",
    generator: "0x5E7f9A0151bB11D6eF75fD11B0a18DDa4004e307",
    rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
  }
}

export const swapFactories = {
  97: {
    uniswap: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"
  },
  43113: {
    uniswap: "0x1005fffFE0E4154512FaDa53a68d75D15cE82120"
  },
  4: {
    uniswap: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  },
}
// providers

const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = web3Provider.getSigner();
// contracts

export const factory = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(address[chain]['factory'], Factory.abi, provider);
}
export const factoryWeb3 = (chain) => {
  return new ethers.Contract(address[chain]['factory'], Factory.abi, signer);
} 

export const generator = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(address[chain]['generator'], Generator.abi, provider);
}
export const generatorWeb3 = (chain) => {
  return new ethers.Contract(address[chain]['generator'], Generator.abi, signer);
} 


export const swapFactory = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(swapFactories[chain]['uniswap'], SwapFactory.abi, provider);
}


export const farm = (chain, farmAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  const contract = new ethers.Contract(farmAddress, Farm.abi, provider);
  return contract;
}

export const farmWeb3 = (farmAddress) => {
  const contract = new ethers.Contract(farmAddress, Farm.abi, signer);
  return contract;
}

export const tokenContract = (chain, tokenAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  return contract;
}

export const tokenWeb3 = (tokenAddress) => {
  const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  return contract;
}


export const erc20Abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
]