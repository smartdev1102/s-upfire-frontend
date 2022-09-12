import { ethers } from "ethers"
import { networks } from "./network.util"
import Factory from '../contracts/Factory.sol/Factory.json';
import Generator from '../contracts/FarmGenerator.sol/FarmGenerator.json';
import Farm from '../contracts/Farm.sol/Farm.json';
import SwapFactory from '../contracts/interfaces/IUniFactory.sol/IUniFactory.json';
import Pair from '../contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json';
import Router from '../contracts/interfaces/IUniswapV2Router01.sol/IUniswapV2Router01.json';
import Pool from '../contracts/interfaces/pool/IUniswapV3PoolImmutables.sol/IUniswapV3PoolImmutables.json';
import SFactory from '../contracts/PoolFactory.sol/PoolFactory.json';
import SGenerator from '../contracts/PoolGenerator.sol/PoolGenerator.json';
import SPool from '../contracts/Pool.sol/Pool.json';


export const address = {
  97: {
    factory: "0xDb9ADc1D6ED67B3f599c7706478342bCF2577411",
    generator: "0xddf3b2233ba2B667c2f68eE9D863Ab288C6838d6",
    rewardToken: "0x2A84A252b129489Bc7834B483a4Ba370cA403F19",
    wether: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    sfactory: '0x336227924a7187411E64BDA693AE266C5be1C99d',
    sgenerator: '0x719475e78A5C0661198E673c517cEDe900a5E7b9'
  },
  43113: {
    factory: "0xfeaB072417019a9b2Dc1c6940c31845354a3d0E7",
    generator: "0xd5649a4a5AdbcD6a0b25972DD907761d5f4648e4",
    rewardToken: "0x0100e4D763bA57C0DCAa5E3D4cBb5A51f65e2846",
    sfactory: '0x3fa9b82Dd7db611242b6B0C67EaC1bb580F2259e',
    sgenerator: '0xd946aa73e10e3dE0BDdB193C0de4233ef8AEc9fA',
    wether: '',
  },
  4: {
    factory: "0x587a39A679994B9E6BA1F6e29Eb0ebA20Df42abF",
    generator: "0x40275f985d891cd73E5b594faaEb01f99142F46C",
    rewardToken: "0xBd83855cfADe70EDA1f93080c32387d93Dc39BE1",
    sfactory: '0x36f708Cd37f35e9517Be6F1F6D0f3b52b9898799',
    sgenerator: '0x1e10444e7280f1f1A353c5436cfEc2CB27c63F66',
    wether: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
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

export const pool = (chain, poolAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  return new ethers.Contract(poolAddress, Pool.abi, provider);
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

// staking pool

export const sfactory = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  const contract = new ethers.Contract(address[chain]['sfactory'], SFactory.abi, provider);
  return contract;
}

export const sfactoryWeb3 = (chain) => {
  const contract = new ethers.Contract(address[chain]['sfactory'], SFactory.abi, signer);
  return contract;
}

export const sgenerator = (chain) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  const contract = new ethers.Contract(address[chain]['sgenerator'], SGenerator.abi, provider);
  return contract;
}

export const sgeneratorWeb3 = (chain) => {
  const contract = new ethers.Contract(address[chain]['sgenerator'], SGenerator.abi, signer);
  return contract;
}

export const spool = (chain, poolAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
  const contract = new ethers.Contract(poolAddress, SPool.abi, provider);
  return contract;
}

export const spoolWeb3 = (poolAddress) => {
  const contract = new ethers.Contract(poolAddress, SPool.abi, signer);
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