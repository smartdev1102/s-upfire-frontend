import { Dialog, DialogTitle } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, FormControl, Select, MenuItem, Checkbox } from '@mui/material';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Close } from '@mui/icons-material';
import { parseEther } from 'ethers/lib/utils';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import { generator } from '../../utils/ethers.util';

const PoolDlg = ({ open, onClose, create, walletAddress, chain }) => {
  const [startDate, setstartDate] = useState(new Date());
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [farmToken, setFarmToken] = useState('');
  const [lpToken, setLpToken] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [amountIn, setAmountIn] = useState('');
  const [rewardBlock, setRewardBlock] = useState('0');
  const [isBonus, setIsBonus] = useState(false);

   // determine reward per block
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
      } catch (err) { }
    }
    if (!!amountIn && multiplier > 0) {
      determineBlockReward();
    }
  }, [amountIn, startDate, bonusEndDate, multiplier, endDate, walletAddress])

  useEffect(() => {
    if (!isBonus) {
      setBonusEndDate(startDate);
    }
  }, [startDate, isBonus]);


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
      false
    );
  }

  return (
    <Dialog
      onClose={onClose}
      open={open}
    >
      <Box
        sx={{
          border: '2px solid #2494F3',
          overflowX: 'hidden',
          background: '#000314'
        }}
      >
        <DialogTitle sx={{ display: 'flex' }}>
          <Box sx={{ fontWeight: 'bold' }}>
            Create Farm
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            width: '600px',
            height: '700px',
            p: '10px',
            background: '#030927'
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            <PerfectScrollbar style={{ padding: '30px' }}>
              <Box>
                <Typography variant='h6' component='h6'>
                  Farm which token?
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Paste token address
              </Box>
              <Box>
                <TextField value={farmToken} onChange={e => setFarmToken(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box sx={{ mt: '30px' }}>
                <Typography variant='h6' component='h6'>
                  Past uniswap pool
                </Typography>
              </Box>
              <Box>
              <Box>
                <TextField value={lpToken} onChange={e => setLpToken(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                This MUST be a valid uniswap v3 pool. The contract checks this is a uniswap pool on farm creation. If it is not the script will revert
              </Box>
              <Box sx={{ mt: '30px' }}>
                <Typography variant='h6' component='h6'>
                  Start Block
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                We reccommend a start block at least 24 hours in advance to give people time to get ready to farm.
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    value={startDate}
                    onChange={(newValue) => { setstartDate(newValue) }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ mt: '30px' }}>
                <Typography variant='h6' component='h6'>
                  {multiplier}x Bonus
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Multiplier ({multiplier}x)
              </Box>
              <Box>
                <TextField value={multiplier} onChange={e => setMultiplier(e.target.value)} fullWidth />
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Bonus end date
              </Box>
              <Box>
                <FormControlLabel control={<Checkbox checked={isBonus} onChange={() => setIsBonus(!isBonus)} />} label="Bonus end date" />
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    value={bonusEndDate}
                    onChange={(newValue) => { setBonusEndDate(newValue) }}
                    renderInput={(params) => <TextField {...params} />}
                    disabled={!isBonus}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ mt: '30px' }}>
                <Typography variant='h6' component='h6'>
                  End Block
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Date
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    value={endDate}
                    onChange={(newValue) => { setEndDate(newValue) }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ mt: '30px' }}>
                <Typography variant='h6' component='h6'>
                  Calculated Rewards
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Expected liquidity
              </Box>
              <Box>
                <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} fullWidth />
              </Box>
              <Box sx={{ my: '10px' }}>
                Rewards Per Block: {rewardBlock}
              </Box>
            </PerfectScrollbar>

            {/* <Box sx={{my: '10px'}}>
            APY: {}
          </Box> */}
            {/* <Box>
            <FormControlLabel control={<Checkbox checked={withReferral} onChange={()=>setWithReferral(!withReferral)} />} label="Referral" />
          </Box> */}
          </Box>
        </Box>

        <Box sx={{ px: '10px', py: '10px' }}>
          <Button onClick={createFarm} variant='contained' fullWidth>Create</Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default PoolDlg;
