import React, { useEffect, useState } from 'react';
import { Box, Switch, IconButton, Grid } from '@mui/material';
import RoundButton from './common/RoundButton';
import SearchInput from './common/SearchInput';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import deeznutsIcon from '../assets/tokenIcons/deeznuts.svg';

const bscPools = [
  {
    icon: deeznutsIcon,
    name: 'DEEZNUTS',
    apy: 0,
    amounts: 1000,
    start: 'Jan, 29, 2022',
    end: 'Jan, 29, 2022'
  },
  {
    icon: deeznutsIcon,
    name: 'DEEZNUTS',
    apy: 0,
    amounts: 1000,
    start: 'Jan, 29, 2022',
    end: 'Jan, 29, 2022'
  },
  {
    icon: deeznutsIcon,
    name: 'DEEZNUTS',
    apy: 0,
    amounts: 1000,
    start: 'Jan, 29, 2022',
    end: 'Jan, 29, 2022'
  },
]

const Pools = () => {
  const [activeTab, setActiveTab] = useState('mining');
  const [stakePools, setStakePools] = useState([]);

  const search = useLocation().search;
  // get chain
  useEffect(() => {
    const chainName = new URLSearchParams(search).get('chain');
    if (chainName === 97) {
      setStakePools(bscPools);
    } else {
      setStakePools([]);
    }
  }, [search]);
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
          bgcolor: '#010621',
          minHeight: '200px',
          p: '20px'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: '#030930',
            p: '30px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <RoundButton onClick={() => setActiveTab('mining')} color={activeTab === 'mining' ? 'primary' : 'secondary'} variant='contained'>Liquidity mining</RoundButton>
            </Box>
            <Box>
              <RoundButton onClick={() => setActiveTab('staking')} color={activeTab === 'staking' ? 'primary' : 'secondary'} sx={{ width: '150px' }} variant='contained'>Staking Pools</RoundButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'secondary.main',
                px: '20px',
                borderRadius: '20px'
              }}
            >
              <Switch />
              <Box>My Pools</Box>
            </Box>
            <Box
              sx={{ position: 'relative', width: '300px' }}
            >
              <SearchInput
                sx={{
                  position: 'absolute'
                }}
                placeholder='Search by name, symbol, address'
              />
              <IconButton
                sx={{ position: 'absolute', right: '0px', top: '4px' }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ my: '20px', color: 'primary.main', fontWeight: 'bold', p: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                #
              </Grid>
              <Grid item xs={2}>
                Pool
              </Grid>
              <Grid item xs={2}>
                APY
              </Grid>
              <Grid item xs={3}>
                Number of tokens
              </Grid>
              <Grid item xs={2}>
                Start Date
              </Grid>
              <Grid item xs={2}>
                End Date
              </Grid>
            </Grid>
          </Box>
          {/* pools */}
          {
            activeTab === 'staking' && (
              <Box>
                {
                  stakePools.map((pool, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: 'background.paper',
                        my: '10px',
                        p: '20px',
                        borderRadius: '20px'
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={1}>
                          {i + 1}
                        </Grid>
                        <Grid item xs={2}>
                          <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <img style={{marginRight: '10px'}} src={deeznutsIcon} />
                            {pool.name}
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          {`${pool.apy}%`}
                        </Grid>
                        <Grid item xs={3}>
                          {pool.amounts}
                        </Grid>
                        <Grid item xs={2}>
                          {pool.start}
                        </Grid>
                        <Grid item xs={2}>
                          {pool.end}
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                }
              </Box>
            )
          }
        </Box>
      </Box>
    </Box >
  );
}

export default Pools;