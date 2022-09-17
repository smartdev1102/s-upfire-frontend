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
      <Hidden smDown>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '1366px'
            }}
          >
            <Link style={{ textDecoration: 'none' }} to="/tokens">
              <RoundTabButton color={'secondary'}  variant='contained' size='large'>
                <img style={{ marginRight: '20px' }} src={coinIcon} />
                tokens
              </RoundTabButton>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/farms">
              <RoundTabButton color={'secondary'}  variant='contained' size='large'>
                <img style={{ marginRight: '20px' }} src={farmIcon} />
                farms
              </RoundTabButton>
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/pools">
              <RoundTabButton color={'secondary'}  variant='contained' size='large'>
                <img style={{ marginRight: '20px' }} src={pickaxeIcon} />
                pools
              </RoundTabButton>
            </Link>
            <Box>
              <RoundTabButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color={'secondary'} sx={{ width: '300px' }} variant='contained' size='large'
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
          </Box>

          {/* <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
          <img style={{ marginRight: '20px' }} src={accountIcon} />
          account
        </RoundTabButton> */}
        </Box>

      </Hidden>
      <Hidden smUp>
        <Box
          sx={{
            display: 'flex',
            px: '20px'
          }}
        >
          <Box>
            <RoundTabButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              color={'secondary'} sx={{ mx: '20px', width: '200px' }} variant='contained' size='large'
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
                  width: '200px',
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
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={() => setOpenMenu(!openMenu)}>
            <MenuIcon />
          </IconButton>
        </Box>
        {
          openMenu && (
            <List sx={{ px: '20px' }}>
              <ListItem disablePadding>
                <ListItemButton to="/tokens">
                  <ListItemIcon>
                    <img src={coinIcon} />
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: 'center' }} primary="Tokens" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton to="/farms">
                  <ListItemIcon>
                    <img src={farmIcon} />
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: 'center' }} primary="Farms" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton to="/pools">
                  <ListItemIcon>
                    <img src={pickaxeIcon} />
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: 'center' }} primary="Pools" />
                </ListItemButton>
              </ListItem>
            </List>
          )
        }
      </Hidden>
    </Box>
  )
}

export default Banner;