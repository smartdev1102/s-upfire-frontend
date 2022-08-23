import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import logo from '../../assets/logo.png';
import RoundButton from './RoundButton';
import SearchIcon from '@mui/icons-material/Search';
import appIcon from '../../assets/icons/app.svg';
import { Link } from 'react-router-dom';
import ethereumIcon from '../../assets/tokenIcons/ethereum-ether-logo.png';
import bnbIcon from '../../assets/tokenIcons/bsc-bnb-logo.png';
import avaxIcon from '../../assets/tokenIcons/avalanche-avax-logo.png';

const chainLogos = {
  97: bnbIcon,
  43113: avaxIcon,
  4: ethereumIcon
}

const Header = ({ walletAddress, connectWallet, handleReferral, chain }) => {
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
        sx={{ mr: '80px', display: 'flex', alignItems: 'center' }}
      >
        <img src={logo} />
        <Typography sx={{ml: '10px'}} variant='h2' component='h2'> CoinCove</Typography>
      </Box>
      <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton onClick={handleReferral} size='large' variant='outlined'>Create referral link</RoundButton>
      </Box>
      {/* <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton size='large' variant='outlined'>Create pool</RoundButton>
      </Box> */}
      {/* <Box
        sx={{
          mx: '10px'
        }}
      >
        <RoundButton size='large' variant='outlined'>Create referral link</RoundButton>
      </Box> */}
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
          <img style={{width: '50px'}} src={chainLogos[chain]} />
        </IconButton>
      </Box>
      {/* <Box
        sx={{
          mx: '10px'
        }}
      >
        <IconButton>
          <img src={appIcon} />
        </IconButton>
      </Box> */}
    </Box>
  )
}

export default Header;