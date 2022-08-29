import { ethers } from "ethers"
import { networks } from "./network.util"
import Factory from '../contracts/Factory.sol/Factory.json';
import Generator from '../contracts/FarmGenerator.sol/FarmGenerator.json';
import Farm from '../contracts/Farm.sol/Farm.json';
import SwapFactory from '../contracts/interfaces/IUniFactory.sol/IUniFactory.json';
import Pair from '../contracts/Pair.sol/Pair.json';
import Router from '../contracts/Router.sol/Router.json';
import PoolFactory from '../contracts/PoolFactory.sol/PoolFactory.json';
import PoolGenerator from '../contracts/PoolGenerator.sol/PoolGenerator.json';
import Pool from '../contracts/Pool.sol/Pool.json';

export const address = {
  97: {
    factory: "0xDb9ADc1D6ED67B3f599c7706478342bCF2577411",
    generator: "0xddf3b2233ba2B667c2f68eE9D863Ab288C6838d6",
    rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
    wether: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    poolFactory: '0x13BcEA47E3B4F3Ca1AB540f623B4921b9836b9d4',
    poolGenerator: '0xF7ab35F09d1b2B565491f93F5e41e78c10c0F325'
  },
  43113: {
    factory: "0xfeaB072417019a9b2Dc1c6940c31845354a3d0E7",
    generator: "0xd5649a4a5AdbcD6a0b25972DD907761d5f4648e4",
    rewardToken: "0x0100e4D763bA57C0DCAa5E3D4cBb5A51f65e2846",
    wether: '',
    poolFactory: '',
    poolGenerator: ''
  },
  4: {
    factory: "0xd1FDf8F8aB2B0D89b4f71435D2BC274F4D2Cd374",
    generator: "0x2D23d44d1bD7566186F72A200bBFC4a22B20539A",
    rewardToken: "0xBd83855cfADe70EDA1f93080c32387d93Dc39BE1",
    wether: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    poolFactory: '0x4D76B13CE7b28F26011cE4182484c9718337F9c6',
    poolGenerator: '0x709839ABA3a71a3938675dE92B93f65bbD32d0c5'
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
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
  },
}
// providers

const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = web3Provider.getSigner();
// contracts

export const poolFactory = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(address[chain]['poolFactory'], PoolFactory.abi, provider);
}

export const poolFactoryWeb3 = (chain) => {
  return new ethers.Contract(address[chain]['poolFactory'], PoolFactory.abi, signer);
}

export const poolGenerator = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(address[chain]['poolGenerator'], PoolGenerator.abi, provider);
}

export const poolGeneratorWeb3 = (chain) => {
  return new ethers.Contract(address[chain]['poolGenerator'], PoolGenerator.abi, signer);
}

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


export const pool = (chain, poolAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  const contract = new ethers.Contract(poolAddress, Pool.abi, provider);
  return contract;
}

export const poolWeb3 = (poolAddress) => {
  const contract = new ethers.Contract(poolAddress, Pool.abi, signer);
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