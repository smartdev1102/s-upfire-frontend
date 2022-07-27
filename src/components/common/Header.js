import { Box } from '@mui/system';
import { IconButton } from '@mui/material';
import React from 'react';
import logo from '../../assets/logo.svg';
import RoundButton from './RoundButton';
import SearchIcon from '@mui/icons-material/Search';
import ethereumIcon from '../../assets/icons/ethereum.svg';
import appIcon from '../../assets/icons/app.svg';

const Header = ({walletAddress, connectWallet}) => {
  const optimizeAddress = (address) => {
    return `${address.substring(0, 5)}..${address.substring(address.length - 5)}`
  }
  return (
    <Box
      sx={{
        p: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{ mr: '80px' }}
      >
        <img src={logo} />
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton size='large' variant='outlined'>Create referral link</RoundButton>
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton size='large' variant='outlined'>Create pool</RoundButton>
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton size='large' variant='outlined'>Create referral link</RoundButton>
      </Box>
      {/* connect wallet button */}
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton onClick={connectWallet} size='large' variant='contained'>
          {!!walletAddress ? optimizeAddress(walletAddress) : 'connect wallet'}
        </RoundButton>
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <IconButton>
          <img src={ethereumIcon} />
        </IconButton>
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <IconButton>
          <img src={appIcon} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Header;