import { ethers } from "ethers"
import { networks } from "./network.util"
import Factory from '../contracts/Factory.sol/Factory.json';
import Generator from '../contracts/FarmGenerator.sol/FarmGenerator.json';
import Farm from '../contracts/Farm.sol/Farm.json';
import SwapFactory from '../contracts/interfaces/IUniFactory.sol/IUniFactory.json';
import Pair from '../contracts/Pair.sol/Pair.json';
import Router from '../contracts/Router.sol/Router.json';

export const address = {
  97: {
    factory: "0x9b5bA1Ff5b3238A2822c665B2E5129bF0308C584",
    generator: "0x54c5926Ccb210D65C37B8AeDA654F40b72Ee8C0A",
    rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
    wether: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  },
  43113: {
    factory: "0xfeaB072417019a9b2Dc1c6940c31845354a3d0E7",
    generator: "0xd5649a4a5AdbcD6a0b25972DD907761d5f4648e4",
    rewardToken: "0x0100e4D763bA57C0DCAa5E3D4cBb5A51f65e2846",
  },
  4: {
    factory: "0xca1d2a55663d523ccA5EfF676DF77c2678feDae8",
    generator: "0xd20612Fb104949a44618253f03C6eebA9c8D154c",
    rewardToken: "0xBd83855cfADe70EDA1f93080c32387d93Dc39BE1",
  }
}

export const coinSymbols = {
  97: 'BNB',
  43113: 'AVAX',
  4: 'ETHER'
}

export const swapFactories = {
  97: {
    uniswap: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
  },
  43113: {
    uniswap: "0x1005fffFE0E4154512FaDa53a68d75D15cE82120",
    router: ''
  },
  4: {
    uniswap: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    router: ''
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

export const pair = (chain, pairAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(pairAddress, Pair.abi, provider);
}

export const routerWeb3 = (chain) => {
  const contract = new ethers.Contract(swapFactories[chain]['router'], Router.abi, signer);
  return contract;
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