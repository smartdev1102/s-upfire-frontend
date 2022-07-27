import { Dialog, DialogTitle, TextField, Box, Typography, Button } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React, { useState } from 'react';

const CreateFarm = ({ open, onClose }) => {
  const [startDate, setstartDate] = useState(new Date());
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [farmToken, setFarmToken] = useState('');
  const [lpToken, setLpToken] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Create Farm</DialogTitle>
      <Box sx={{width: '600px', height: '700px', p: '10px'}}>
        <Box sx={{ width: '100%', p: '10px', height: '100%', overflowY: 'scroll' }}>
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
              Select uniswap pair
            </Typography>
          </Box>
          <Box sx={{ color: 'text.secondary' }}>
            Paste uniswap v2 pair address that farmers can farm the yield token on
          </Box>
          <Box>
            <TextField value={lpToken} onChange={e => setLpToken(e.target.value)} placeholder='0x...' fullWidth />
          </Box>
          <Box sx={{ color: 'text.secondary' }}>
            This MUST be a valid uniswap v2 pair. The contract checks this is a uniswap pair on farm creation. If it is not the script will revert
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
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                value={bonusEndDate}
                onChange={(newValue) => { setBonusEndDate(newValue) }}
                renderInput={(params) => <TextField {...params} />}
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
        </Box>
      </Box>

      <Box sx={{ px: '30px', py: '10px' }}>
        <Button variant='contained' fullWidth>Create</Button>
      </Box>
    </Dialog>
  );
}

export default CreateFarm;