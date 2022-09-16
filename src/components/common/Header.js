import { Box } from '@mui/system';
import { IconButton, Hidden } from '@mui/material';
import React from 'react';
import logo from '../../assets/logo.png';
import RoundButton from './RoundButton';
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
    <Box>
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
          <img style={{ height: '80px' }} src={logo} />
        </Box>
        <Box
          sx={{
            mx: '0px'
          }}
        >
          <RoundButton onClick={handleReferral} size='large' variant='outlined'>Create referral link</RoundButton>
        </Box>
        <Hidden smDown>
          <Box
            sx={{
              mx: '10px'
            }}
          >
            <RoundButton onClick={connectWallet} size='large' variant='contained'>
              {!!walletAddress ? optimizeAddress(walletAddress) : 'connect wallet'}
            </RoundButton>
          </Box>
        </Hidden>
        <Box
          sx={{
            mx: '10px'
          }}
        >
          <IconButton>
            <img style={{ width: '50px' }} src={chainLogos[chain]} />
          </IconButton>
        </Box>
      </Box>
      <Hidden smUp>
        <Box
          sx={{
            mx: '10px'
          }}
        >
          <RoundButton onClick={connectWallet} fullWidth variant='contained'>
            {!!walletAddress ? optimizeAddress(walletAddress) : 'connect wallet'}
          </RoundButton>
        </Box>
      </Hidden>
    </Box>
  )
}

export default Header;