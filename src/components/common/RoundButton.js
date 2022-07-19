import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';


const RoundButton = styled(Button) ({
  borderRadius: '25px',
  borderWidth: '2px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
});

export default RoundButton;