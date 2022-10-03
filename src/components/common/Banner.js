import { Box, Hidden, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import RoundButton from './RoundButton';

const chainColors = {
  97: {
    main: 'orange',
    hover: 'darkOrange'
  },
  43113: {
    main: 'pink',
    hover: 'hotPink'
  },
  4: {
    main: 'skyBlue',
    hover: 'lightBlue'
  }
}
const Banner = ({ setChain, chain }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = useState();
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
      <Hidden smUp>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Box>
            <RoundButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{ width: '300px', background: chainColors[chain].main, ":hover": { background: chainColors[chain].hover } }} variant='contained' size='large'

            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <img style={{ marginRight: '20px' }} src={stakeIcon} />
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
        </Box>
      </Hidden>
    </Box>
  )
}

export default Banner;