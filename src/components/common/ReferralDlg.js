import React from 'react';
import { Button, Card, IconButton, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Close } from '@mui/icons-material';

const ReferralDlg = ({referral, onClose}) => {

  const copyReferral = () => {
    navigator.clipboard.writeText(referral);
  }

  return !!referral && (
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
      <Box>
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <Typography variant='h5' component='h6' color='orange'>
            Create your own referral link!
          </Typography>
          <Box sx={{flexGrow: 1}}></Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box>
          <TextField value={referral} fullWidth />
        </Box>
        <Box
          sx={{
            textAlign: 'left',
            fontSize: '18px',
            mt: '20px'
          }}
        >
          Creating a referral code allows you to earn profits on ETH, BSC, MATIC, and AVAX. When a pool is created using your referral link, you are instantly given 20% of the Tokena team's profits in tokens as a reward for your referral.
          Pools can be made to last months or even years, featuring large sums of crypto. A single good referral could be enough to make you a ton- multiple good referrals and you'll be rolling in it. So in a way, Tokena allows you to be your own boss.
          You can also refer projects that you currently hold in your portfolio to list here as it's free and would make you quite a bit per year if the price of the coin holds.
          *Note: Tokena aims to be 100% decentralized and not responsible for any users funds. If your funds get lost because you send them to the wrong address, there is likely nothing we can do about it. Make sure you know what you're doing before using our platform.
        </Box>
        <Box
          sx={{
            mt: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button onClick={copyReferral} variant='contained'>
            Copy referral Link
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default ReferralDlg;