import { Box, Card, IconButton, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import pkgIcon from '../assets/tokenIcons/pkg.svg';
import RoundButton from './common/RoundButton';
import Pagination from '@mui/material/Pagination';

const tokensArray = [
  {
    icon: pkgIcon,
    name: 'PKG Token',
    symbol: 'PKG',
    price: 0,
    address: '0xc2Ff05DAAEFf404Cf1aA216b46C50001785aC16c'
  },
  {
    icon: pkgIcon,
    name: 'PKG Token',
    symbol: 'PKG',
    price: 0,
    address: '0xc2Ff05DAAEFf404Cf1aA216b46C50001785aC16c'
  },
  {
    icon: pkgIcon,
    name: 'PKG Token',
    symbol: 'PKG',
    price: 0,
    address: '0xc2Ff05DAAEFf404Cf1aA216b46C50001785aC16c'
  },
  {
    icon: pkgIcon,
    name: 'PKG Token',
    symbol: 'PKG',
    price: 0,
    address: '0xc2Ff05DAAEFf404Cf1aA216b46C50001785aC16c'
  },

]

const Tokens = () => {

  const optimizeAddress = (address) => {
    return `${address.substring(0, 5)}..${address.substring(address.length - 5)}`
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '1366px',
          minHeight: '600px',
          bgcolor: '#010621',
          p: '20px'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#030930',
            p: '20px'
          }}
        >
          {/* tab header */}
          <Box
            sx={{
              display: 'flex',
              mx: '80px'
            }}
          >
            <Typography variant='h6' component='h6'>
              FARMABLE TOKENS
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box
              sx={{ position: 'relative', width: '250px' }}
            >
              <SearchInput
                sx={{
                  position: 'absolute'
                }}
                placeholder='Search tokens'
              />
              <IconButton
                sx={{ position: 'absolute', right: '0px', top: '4px' }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
          {/* token list */}
          <Box sx={{ mt: '30px' }}>
            {
              tokensArray.map((token, i) => (
                <Card
                  key={i}
                  sx={{
                    width: '100%',
                    borderRadius: '20px',
                    p: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    my: '10px'
                  }}
                >
                  <Box>
                    <img src={pkgIcon} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ fontSize: '30px', mr: '10px' }}>
                        {token.symbol}
                      </Box>
                      <Box sx={{ color: 'primary.main' }}>
                        {`$${token.price}`}
                      </Box>
                    </Box>
                    <Box sx={{ color: 'primary.main' }}>
                      {token.name}
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}></Box>
                  <Box sx={{ mx: '20px' }}>
                    <RoundButton color='secondary' variant='contained'>View farms</RoundButton>
                  </Box>
                  <Box sx={{ mx: '20px' }}>
                    <RoundButton color='secondary' variant='contained'>Uniswap</RoundButton>
                  </Box>
                  <Box sx={{ mx: '20px' }}>
                    <RoundButton color='secondary' variant='contained'>Etherscan</RoundButton>
                  </Box>
                  <Box sx={{ mx: '20px' }}>
                    <RoundButton color='secondary' variant='contained'>
                      {optimizeAddress(token.address)}
                    </RoundButton>
                  </Box>
                </Card>
              ))
            }
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Pagination count={10} variant='outlined' />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Tokens;
