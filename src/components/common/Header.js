import { Box } from '@mui/system';
import { IconButton, Hidden } from '@mui/material';
import React, { useState } from 'react';
import logo from '../../assets/logo.svg';
import RoundButton from './RoundButton';
import ethereumIcon from '../../assets/tokenIcons/ethereum-ether-logo.png';
import bnbIcon from '../../assets/tokenIcons/bsc-bnb-logo.png';
import avaxIcon from '../../assets/tokenIcons/avalanche-avax-logo.png';
import { networks } from '../../utils/network.util';
import stakeIcon from '../../assets/icons/stake.svg';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';


const chainLogos = {
  56: bnbIcon,
  43114: avaxIcon,
  4: ethereumIcon
}

const chainColors = {
  56: {
    main: '#C88E0D',
    hover: 'darkOrange'
  },
  43114: {
    main: 'pink',
    hover: 'hotPink'
  },
  // 4: {
  //   main: '#7389DF',
  //   hover: 'lightBlue'
  // }
}

const Header = ({ walletAddress, connectWallet, handleReferral, chain, setChain }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleChain = async (chainId) => {
    if (chainId !== 4) {
      await window.ethereum.request(
        {
          "id": 1,
          "jsonrpc": "2.0",
          "method": "wallet_addEthereumChain",
          "params": [networks[chainId]]
        }
      );
    }
    await window.ethereum.request(
      {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "wallet_switchEthereumChain",
        "params": [{
          chainId: networks[chainId].chainId
        }]
      }
    );
    setChain(chainId);
    setAnchorEl(null);
    // navigate(`/pools?chain=${chainId}`);
  }
  const optimizeAddress = (address) => {
    return `${address.substring(0, 5)}..${address.substring(address.length - 5)}`
  }
  return (
    <Box>
      <Box
        sx={{
          p: '10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          onClick={() => window.location.href='/main?tab=1'}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <img style={{ height: '80px' }} src={logo} />
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Hidden mdDown>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <Box>
              <RoundButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ width: '220px', background: chainColors[chain].main, ":hover": { background: chainColors[chain].hover } }} variant='contained'
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <img style={{ marginRight: '20px', height: '30px' }} src={chainLogos[chain]} />
                  <Box sx={{ flexGrow: 1 }}></Box>
                  {networks[chain].chainName}
                  <Box sx={{ flexGrow: 1 }}></Box>
                  <ExpandMoreIcon />
                </Box>
              </RoundButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                  sx: {
                    width: '220px',
                    background: '#030927',
                  }
                }}
              >
                {/* <MenuItem
                  sx={{
                    background: '#7389DF',
                    m: '5px',
                    borderRadius: '10px',
                    display: 'flex',
                    fontSize: '14px',
                    ":hover": {
                      background: 'lightBlue'
                    }
                  }}
                  onClick={() => handleChain(4)}
                >
                  <img style={{ height: '30px', marginRight: '10px' }} src={ethereumIcon} />
                  <Box>Ethereum</Box>
                </MenuItem> */}
                <MenuItem
                  sx={{
                    background: 'pink',
                    m: '5px',
                    borderRadius: '10px',
                    display: 'flex',
                    fontSize: '14px',
                    ":hover": {
                      background: 'hotPink'
                    }
                  }}
                  onClick={() => handleChain(43114)}
                >
                  <img style={{ height: '30px', marginRight: '10px' }} src={avaxIcon} />
                  <Box>Avalanche</Box>
                </MenuItem>
                <MenuItem
                  sx={{
                    background: '#C88E0D',
                    m: '5px',
                    borderRadius: '10px',
                    display: 'flex',
                    fontSize: '14px',
                    ":hover": {
                      background: 'darkOrange'
                    }
                  }}
                  onClick={() => handleChain(56)}
                >
                  <img style={{ height: '30px', marginRight: '10px' }} src={bnbIcon} />
                  <Box>Bianance Smart Chain</Box>
                </MenuItem>
              </Menu>
            </Box>
            <Box>
              <RoundButton color='primary' size='large' onClick={handleReferral} variant='contained'>Create referral link</RoundButton>
            </Box>
            <Box>
              <RoundButton
                sx={{
                  background: '#7389DF',
                  ":hover": {
                    background: 'lightBlue'
                  }
                }}
                onClick={connectWallet}
                size='large'
                variant='contained'
              >
                {!!walletAddress ? optimizeAddress(walletAddress) : 'connect wallet'}
              </RoundButton>
            </Box>
          </Box>
        </Hidden>

      </Box>
      <Hidden mdUp>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <RoundButton
            sx={{
              background: '#7389DF',
              ":hover": {
                background: 'lightBlue'
              }
            }}
            onClick={connectWallet}
            size='large'
            variant='contained'
          >
            {!!walletAddress ? optimizeAddress(walletAddress) : 'connect wallet'}
          </RoundButton>
        </Box>
      </Hidden>
    </Box>
  )
}

export default Header;