import { Box, TextField, Typography, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { generator } from '../utils/ethers.util';
import { useParams } from 'react-router-dom';

const CreatePool = ({ walletAddress, chain, create }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [farmToken, setFarmToken] = useState('');
  const [lpToken, setLpToken] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [amountIn, setAmountIn] = useState('');
  const [rewardBlock, setRewardBlock] = useState('0');
  const [withReferral, setWithReferral] = useState(false);
  const [apy, setApy] = useState('0');

  const { referralAddress } = useParams();

  const createFarm = () => {
    const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
    const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    create(
      farmToken,
      amountIn,
      lpToken,
      rewardBlock,
      startBlock,
      bonusEndBlock,
      multiplier,
      referralAddress
    );
  }

  useEffect(() => {
    async function determineBlockReward() {
      try {
        const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
        const endBlock = Math.floor(new Date(endDate).getTime() / 1000);
        const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
        const [blockReward, requiredAmount, fee] = await generator(chain).determineBlockReward(
          parseEther(amountIn),
          startBlock,
          Number(bonusEndBlock),
          multiplier,
          endBlock
        );
        setRewardBlock(blockReward.toString());
        console.log(formatEther(requiredAmount))
      } catch (err) { }
    }
    if (!!amountIn && multiplier > 0) {
      determineBlockReward();
    }
  }, [amountIn, startDate, bonusEndDate, multiplier, endDate, walletAddress]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: '600px',
          }}
        >
          <Box>
            <Typography fontStyle='bold' variant='h4' component='h4'>
              Create Pool
            </Typography>
          </Box>
          <Box>
            Pair
          </Box>
          <Box>
            <TextField value={farmToken} onChange={e => setFarmToken(e.target.value)} fullWidth />
          </Box>
          <Box>
            Token for Reward
          </Box>
          <Box>
            <TextField value={lpToken} onChange={e => setLpToken(e.target.value)} fullWidth />
          </Box>
          <Box>
            Token Amount
          </Box>
          <Box>
            <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} fullWidth />
          </Box>
          <Box>
            Start Date
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                value={startDate}
                onChange={(newValue) => { setStartDate(newValue) }}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            Multiplier({multiplier}x)
          </Box>
          <Box>
            <TextField value={multiplier} onChange={e => setMultiplier(e.target.value)} fullWidth />
          </Box>
          <Box>
            Bonus end date
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                value={bonusEndDate}
                onChange={newValue => setBonusEndDate(newValue)}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            End date
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                value={endDate}
                onChange={newValue => setEndDate(newValue)}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            Rewards Per Block: {rewardBlock}
          </Box>
          <Box sx={{ py: '10px' }}>
            <Button onClick={createFarm} variant='contained' fullWidth>Create</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CreatePool;