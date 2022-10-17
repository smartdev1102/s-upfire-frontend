import React, { useState } from 'react';
import { Box } from '@mui/system';
import RoundButton from './common/RoundButton';
import Tokens from './Tokens';
import Farms from './farms/Farms';
import Pools from './Pools';
import { Hidden } from '@mui/material';

const Main = ({
  openWalletAlert,
  walletAddress,
  chain,
  farms,
  farmsv3,
  pairs,
  totalLiquidity,
  farmTokens,
  stakeTokens,
  stakePools
}) => {
  const [tabIndex, setTabIndex] = useState(1);
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
          {/* <RoundButton color={tabIndex == 0 ? 'primary' : 'secondary'} onClick={()=>setTabIndex(0)} variant='contained'>
            Farmable Tokens
          </RoundButton> */}
          <RoundButton color={tabIndex == 1 ? 'primary' : 'secondary'} onClick={() => setTabIndex(1)} variant='contained'>
            Farms
          </RoundButton>
          <RoundButton color={tabIndex == 2 ? 'primary' : 'secondary'} onClick={() => setTabIndex(2)} variant='contained'>
            Staking Pools
          </RoundButton>
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
                totalLiquidity={totalLiquidity}
              />
            )
          }
          {
            (tabIndex === 2) && (
              <Pools
                chain={chain}
                walletAddress={walletAddress}
                stakePools={stakePools}
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