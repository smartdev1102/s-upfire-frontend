import { Dialog, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import {Box, Typography, TextField, Button, IconButton} from '@mui/material';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Close } from '@mui/icons-material';
import { parseEther } from 'ethers/lib/utils';

const PoolDlg = ({ open, onClose, create, walletAddress, chain }) => {
  const [rewardToken, setRewardToken] = useState('');
  const [stakeToken, setStakeToken] = useState('');
  const [apr, setApr] = useState(0);
  const [amountIn, setAmountIn] = useState('0');

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
          background: '#000314'
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
            width: '600px',
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
              <Box sx={{ color: 'text.secondary' }}>
                Paste token address
              </Box>
              <Box>
                <TextField value={rewardToken} onChange={e => setRewardToken(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box>
                <Typography variant='h6' component='h6'>
                  Stake Token
                </Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>
                Paste token address
              </Box>
              <Box>
                <TextField value={stakeToken} onChange={e => setStakeToken(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box>
                <Typography variant='h6' component='h6'>
                  APR percent
                </Typography>
              </Box>
              <Box>
                <TextField value={apr} onChange={e => setApr(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
              <Box>
                <Typography variant='h6' component='h6'>
                  Amount
                </Typography>
              </Box>
              <Box>
                <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} placeholder='0x...' fullWidth />
              </Box>
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
