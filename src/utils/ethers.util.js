import { ethers } from "ethers"
import { network } from "./network.util"
import Factory from '../contracts/Factory.sol/Factory.json';
import Generator from '../contracts/FarmGenerator.sol/FarmGenerator.json';
import Farm from '../contracts/Farm.sol/Farm.json';
import SwapFactory from '../contracts/interfaces/IUniFactory.sol/IUniFactory.json';

export const address = {
  factory: "0x4c76D37379Ca538597208904b2f876d7099C7E77",
  generator: "0xB0777e406B72Ac8c585616F288672d3E6Fb89A90",
  rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
}

export const swapFactories = {
  97: {
    uniswap: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"
  }
}
// providers
const provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0]);
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = web3Provider.getSigner();
// contracts

export const factory = new ethers.Contract(address['factory'], Factory.abi, provider);
export const factoryWeb3 = new ethers.Contract(address['factory'], Factory.abi, signer);

export const generator = new ethers.Contract(address['generator'], Generator.abi, provider);
export const generatorWeb3 = new ethers.Contract(address['generator'], Generator.abi, signer);


export const swapFactory = new ethers.Contract(swapFactories[97]['uniswap'], SwapFactory.abi, provider);


export const farm = (farmAddress) => {
  const contract = new ethers.Contract(farmAddress, Farm.abi, provider);
  return contract;
}

export const farmWeb3 = (farmAddress) => {
  const contract = new ethers.Contract(farmAddress, Farm.abi, signer);
  return contract;
}

export const tokenContract = (tokenAddress) => {
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