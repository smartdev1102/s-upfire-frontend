import { Dialog, DialogTitle, Grid, Select, MenuItem, FormControl } from '@mui/material';
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Close } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { parseEther } from 'ethers/lib/utils';

const PoolDlg = ({ open, onClose, create, walletAddress, chain }) => {
  const [rewardToken, setRewardToken] = useState('');
  const [stakeToken, setStakeToken] = useState('');
  const [apr, setApr] = useState(0);
  const [amountIn, setAmountIn] = useState('0');
  const [multiplier, setMultiplier] = useState(1)
  const [bonusEndDate, setBonusEndDate] = useState(new Date())
  const [now, setNow] = useState(new Date());
  const [bonusBlock, setBonusBlock] = useState(0)
  const [lockUnit, setLockUnit] = useState('month');
  const [periodPerx, setPeriodPerx] = useState(0);

  const createPool = () => {
    create(
      rewardToken,
      stakeToken,
      apr,
      amountIn
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
          background: '#000314',
          fontFamily: 'Exo'
        }}
      >
        <DialogTitle sx={{ display: 'flex' }}>
          <Box sx={{ fontWeight: 'bold' }}>
            Create Pool
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            maxWidth: '600px',
            minWidth: '300px',
            p: '10px',
            background: '#030927'
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            <PerfectScrollbar style={{ padding: '30px' }}>
              <Box>
                <Typography variant='h6' component='h6'>
                  Reward Token
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary', mb: '5px' }}>
                Paste token address
              </Box>
              <Box>
                <TextField size='small' value={rewardToken} onChange={e => setRewardToken(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box
                sx={{
                  mt: '20px'
                }}
              >
                <Typography variant='h6' component='h6'>
                  Stake Token
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary', mb: '5px' }}>
                Paste token address
              </Box>
              <Box>
                <TextField size='small' value={stakeToken} onChange={e => setStakeToken(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box
                sx={{
                  mt: '20px'
                }}
              >
                <Typography variant='h6' component='h6'>
                  APR percent
                </Typography>
              </Box>
              <Box>
                <TextField size='small' value={apr} onChange={e => setApr(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box
                sx={{
                  my: '5px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: 'text.secondary'
                }}
              >
                Apr is monthly reward rate(1/1000)
              </Box>
              <Box
                sx={{
                  mt: '20px'
                }}
              >
                <Typography variant='h6' component='h6'>
                  Amount
                </Typography>
              </Box>
              <Box>
                <TextField size='small' value={amountIn} onChange={e => setAmountIn(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box
                sx={{
                  my: '5px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: 'text.secondary'
                }}
              >
                Create must deposit token to create pool.
                Pool end time is calculated with this amount and apr.
              </Box>
              <Box
                sx={{
                  mt: '20px'
                }}
              >
                <Typography variant='h6' component='h6'>
                  Bonus Periods
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Multiplier ({multiplier}x)
              </Box>
              <Box 
                sx={{
                  my: '5px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: 'text.secondary'
                }}>
                {
                  `Bonus periods start at the start block and end at the below specified block. For no bonus period set the multiplier to '1' and the bonus end block to ${now}`
                }
              </Box>
              <Box>
                <TextField size='small' value={multiplier} onChange={e => setMultiplier(e.target.value)} fullWidth />
              </Box>
              <Box sx={{ color: 'text.secondary', mb: '5px', mt: '10px' }}>
                Bonus end date
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    value={bonusEndDate}
                    onChange={(newValue) => { setBonusEndDate(newValue) }}
                    renderInput={(params) => <TextField size='small' {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ color: 'text.secondary', mb: '5px', mt: '10px' }}>
                  Block Number
                </Box>
                <Box>
                  <TextField size='small' value={bonusBlock} onChange={e => setBonusBlock(e.target.value)} />
                </Box>
                <Box 
                sx={{
                  my: '5px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: 'text.secondary'
                }}>
                  {`* must be >= ${now}`}
                </Box>
              <Box
                sx={{
                  mt: '20px'
                }}
              >
                <Typography variant='h6' component='h6'>
                  Lock Periods
                </Typography>
              </Box>
              <Grid sx={{ width: '480px' }} container spacing={2}>
                <Grid item xs={6}>
                  <TextField size='small' value={periodPerx} onChange={e => setPeriodPerx(e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Select
                      value={lockUnit}
                      onChange={e => setLockUnit(e.target.value)}
                      size='small'
                    >
                      <MenuItem value='day'>days</MenuItem>
                      <MenuItem value='week'>weeks</MenuItem>
                      <MenuItem value='month'>months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </PerfectScrollbar>
          </Box>
        </Box>
        <Box sx={{ px: '10px', py: '10px' }}>
          <Button onClick={createPool} variant='contained' fullWidth>Create</Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default PoolDlg;