import { Box } from '@mui/material';
import React, { useState } from 'react';
import RoundTabButton from './RoundTabButton';
import coinIcon from '../../assets/icons/coin.svg';
import farmIcon from '../../assets/icons/farm.svg';
import pickaxeIcon from '../../assets/icons/pickaxe.svg';
import stakeIcon from '../../assets/icons/stake.svg';
import accountIcon from '../../assets/icons/account.svg';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { networks } from '../../utils/network.util';

const Banner = ({ setChain, chain }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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


  return (
    <Box>
      {/* tab buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Link style={{ textDecoration: 'none' }} to="/tokens">
          <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
            <img style={{ marginRight: '20px' }} src={coinIcon} />
            tokens
          </RoundTabButton>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/farms">
          <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
            <img style={{ marginRight: '20px' }} src={farmIcon} />
            farms
          </RoundTabButton>
        </Link>
        {/* <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
          <img style={{ marginRight: '20px' }} src={pickaxeIcon} />
          bridges
        </RoundTabButton> */}
        <Box>
          <RoundTabButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color={'secondary'} sx={{ mx: '20px', width: '300px' }} variant='contained' size='large'
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <img style={{ marginRight: '20px' }} src={stakeIcon} />
              <Box sx={{ flexGrow: 1 }}></Box>
              {networks[chain].chainName}
              <Box sx={{ flexGrow: 1 }}></Box>
              <ExpandMoreIcon />
            </Box>
          </RoundTabButton>
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
                width: '300px',
                background: '#030927',
              }
            }}
          >
            <MenuItem
              sx={{
                background: 'skyBlue',
                m: '5px',
                borderRadius: '10px',
                justifyContent: 'center',
                ":hover": {
                  background: 'lightBlue'
                }
              }}
              onClick={() => handleChain(4)}
            >
              Ethereum
            </MenuItem>
            <MenuItem 
              sx={{
                background: 'pink',
                m: '5px',
                borderRadius: '10px',
                justifyContent: 'center',
                ":hover": {
                  background: 'hotPink'
                }
              }}
              onClick={() => handleChain(43113)}
            >Avalanche</MenuItem>
            <MenuItem 
              sx={{
                background: 'orange',
                m: '5px',
                borderRadius: '10px',
                justifyContent: 'center',
                ":hover": {
                  background: 'darkOrange'
                }
              }}
              onClick={() => handleChain(97)}
            >Binance Smart Chain</MenuItem>
          </Menu>
        </Box>
        {/* <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
          <img style={{ marginRight: '20px' }} src={accountIcon} />
          account
        </RoundTabButton> */}
      </Box>
    </Box>
  )
}

export default Banner;