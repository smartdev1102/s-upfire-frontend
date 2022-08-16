import { Box, Card, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import pkgIcon from '../assets/tokenIcons/pkg.svg';
import RoundButton from './common/RoundButton';
import Pagination from '@mui/material/Pagination';
import { factory, tokenContract, farm, pair } from '../utils/ethers.util';

const Tokens = ({chain}) => {
  const [tokens, setTokens] = useState([]);
  // tokens
  useEffect(() => {
    async function getFarms () {
      if(!chain) return;
      const farmsLength = await factory(chain).farmsLength();
      let tempTokens = [];
      for (let i = 0; i < Number(farmsLength); i++) {
        const farmAddress = await factory(chain).farmAtIndex(i);
        const farmInfo = await farm(chain, farmAddress).farmInfo();
        const lptoken = farmInfo.lpToken;
        const name = await tokenContract(chain, lptoken).name();
        const token0 = await pair(chain, lptoken).token0();
        const token1 = await pair(chain, lptoken).token1();
        const symbol1 = await tokenContract(chain, token0).symbol();
        const symbol2 = await tokenContract(chain, token1).symbol();
        const lpSymbol = `${symbol1}/${symbol2}`;
        tempTokens = [...tokens];
        tempTokens.push({
          name: name,
          symbol: lpSymbol,
          price: 0,
          address: lptoken
        });
        setTokens(tempTokens);
      }
    }
    getFarms();
  }, [chain]);
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
              tokens.map((token, i) => (
                <Card
                  key={i}
                  sx={{
                    width: '100%',
                    borderRadius: '20px',
                    py: '5px',
                    px: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    my: '10px'
                  }}
                >
                  <Box>
                    {/* <img src={pkgIcon} /> */}
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
              {/* <Pagination count={10} variant='outlined' /> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Tokens;
