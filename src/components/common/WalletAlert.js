import { Card, Box, Button } from '@mui/material';
import React from 'react';

const WalletAlert = ({ open, onClose }) => {
  return open && (
    <Card
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        background: 'rgb(0,36,48)',
        padding: '30px',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        borderRadius: '20px',
        zIndex: 100
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          fontSize: '24px'
        }}
      >
        Please connect your wallet first
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center', mt: '25px'}}>
        <Button onClick={onClose} variant='contained'>ok</Button>
      </Box>
    </Card>
  );
}

export default WalletAlert;