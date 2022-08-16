import React, { useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { Button, Card, Grid, TextField } from '@mui/material';
import farmIcon from '../../assets/icons/farm.svg';
import airdropIcon from '../../assets/icons/airdrop.svg';
import accountIcon from '../../assets/icons/account.svg';
import { farm, farmWeb3, tokenContract, tokenWeb3 } from '../../utils/ethers.util';
import { parseEther } from 'ethers/lib/utils';

const FarmCard = ({ farmInfo, chain, setSelectedFarm }) => {
  const [openStake, setOpenStake] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');
  

  const handleSelectedFarm = () => {
    setSelectedFarm(farmInfo);
  }

  const stake = async () => {
    await tokenWeb3(farmInfo.lptoken).approve(farmInfo.address, parseEther(amountIn));
    tokenWeb3(farmInfo.lptoken).once("Approval", async () => {
      const tx = await farmWeb3(farmInfo.address).deposit(parseEther(amountIn));
      await tx.wait();
      window.alert("Deposit.");
    });
  }

  const withdraw = async () => {
    const tx = await farmWeb3(farmInfo.address).withdraw(parseEther(amountIn));
    await tx.wait();
    window.alert("Withdraw");
  }

  return (
    <Card
      sx={{
        my: '10px',
        borderRadius: '20px',
      }}
    >
      <Box
        onClick={() => setOpenStake(!openStake)}
        sx={{
          p: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>
          {/* <img src={dnxcIcon} /> */}
        </Box>
        <Box
          sx={{
            mx: '50px'
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom component="h4">
              {`Farm ${farmInfo.name.toUpperCase()}`}
            </Typography>
          </Box>
          <Box>
            {`${farmInfo.symbol} / ${farmInfo.baseToken}`}
          </Box>
          <Box>
            {
              farmInfo.start > new Date() && (
                <Box sx={{ color: 'skyBlue' }}>
                  Farming is not started.
                </Box>
              )
            }
            {
              (farmInfo.start < new Date() && farmInfo.end > new Date()) && (
                <Box sx={{ color: 'skyBlue' }}>
                  Farming is active.
                </Box>
              )
            }
            {
              farmInfo.bonusEndBlock < new Date() && (
                <Box sx={{ color: 'skyBlue' }}>
                  Farming has finished.
                </Box>
              )
            }
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box sx={{ mx: '30px' }}>
          <img src={farmIcon} />
        </Box>
        <Box sx={{ mx: '30px', display: 'flex' }}>
          <Box sx={{ mx: '10px' }}>
            <img src={airdropIcon} />
          </Box>
          <Box>
            {Math.trunc(farmInfo.supply)}
          </Box>
        </Box>
        <Box sx={{ mx: '30px', display: 'flex' }}>
          <Box sx={{ mx: '10px' }}>
            <img style={{ height: '20px' }} src={accountIcon} />
          </Box>
          <Box>
            {farmInfo.numFarmers}
          </Box>
        </Box>
      </Box>
      {/* stake */}
      {
        openStake && (
          <Box
            sx={{
              background: '#020826',
              px: '30px',
              py: '10px'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box sx={{ mx: '20px' }}>
                <Button onClick={handleSelectedFarm} variant='contained'>add liquidity and stake</Button>
              </Box>
              {/* <Box>
                <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '20px' }}>
                <Button onClick={stake} variant='contained'>stake</Button>
              </Box> */}
              <Box>
                <TextField value={amountOut} onChange={e => setAmountOut(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '20px' }}>
                <Button onClick={withdraw} variant='contained'>withdraw</Button>
              </Box>
            </Box>
          </Box>
        )
      }

    </Card>
  );
}

export default FarmCard;