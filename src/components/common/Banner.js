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

const Banner = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chain, setChain] = useState('avalanche');
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChain = (chainName) => {
    setChain(chainName);
    setAnchorEl(null);
    navigate(`/pools?chain=${chainName}`);
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
        <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
          <img style={{ marginRight: '20px' }} src={pickaxeIcon} />
          bridges
        </RoundTabButton>
        <Box>
          <RoundTabButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <img style={{ marginRight: '20px' }} src={stakeIcon} />
              <Box sx={{ flexGrow: 1 }}></Box>
              {chain}
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
          >
            <MenuItem onClick={() => handleChain('Avalanche')}>Avalanche</MenuItem>
            <MenuItem onClick={() => handleChain('BSC')}>BSC</MenuItem>
          </Menu>
        </Box>
        <RoundTabButton color={'secondary'} sx={{ mx: '20px' }} variant='contained' size='large'>
          <img style={{ marginRight: '20px' }} src={accountIcon} />
          account
        </RoundTabButton>
      </Box>
    </Box>
  )
}

export default Banner;