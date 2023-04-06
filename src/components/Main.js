import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import RoundButton from './common/RoundButton';
import Tokens from './Tokens';
import Farms from './farms/Farms';
import Pools from './Pools';
import { Hidden } from '@mui/material';
import { useParams, Link } from 'react-router-dom';

const Main = ({
  openWalletAlert,
  walletAddress,
  chain,
  farms,
  farmsv3,
  pairs,
  farmTokens,
  stakeTokens,
  stakePools,
  setFarms,
  setPools,
  tabIndex
}) => {

  const { address } = useParams();
  const itemsPerPage = 10;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Hidden mdDown>
        <Box sx={{ width: '150px' }}></Box>
      </Hidden>
      <Box
        sx={{
          width: '100%',
          background: '#081931',
          borderRadius: '25px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            display: 'flex',
            py: '20px',
            px: '10px'
          }}
        >
          <Link to="/farm/all" style={{ textDecoration: 'unset' }}>
            <RoundButton color={tabIndex == 1 ? 'primary' : 'secondary'} variant='contained'>
              Farms
            </RoundButton>
          </Link>
          <Link to="/pool/all" style={{ textDecoration: 'unset' }}>
            <RoundButton color={tabIndex == 2 ? 'primary' : 'secondary'} variant='contained'>
              Staking Pools
            </RoundButton>
          </Link>
        </Box>
        <Box>
          {
            (tabIndex === 0) && (
              <Tokens
                chain={chain}
                walletAddress={walletAddress}
                farmTokens={farmTokens}
                stakeTokens={stakeTokens}
              />
            )
          }
          {
            (tabIndex === 1) && (
              <Farms
                openWalletAlert={openWalletAlert}
                walletAddress={walletAddress}
                farms={farms}
                farmsv3={farmsv3}
                pairs={pairs}
                chain={chain}
                setFarms={setFarms}
                farmAddress={address}
                itemsPerPage={itemsPerPage}
              />
            )
          }
          {
            (tabIndex === 2) && (
              <Pools
                chain={chain}
                walletAddress={walletAddress}
                stakePools={stakePools}
                openWalletAlert={openWalletAlert}
                setPools={setPools}
                poolAddress={address}
                itemsPerPage={itemsPerPage}
              />
            )
          }
        </Box>
      </Box>
      <Hidden mdDown>
        <Box sx={{ width: '150px' }}></Box>
      </Hidden>
    </Box>
  );
}

export default Main;