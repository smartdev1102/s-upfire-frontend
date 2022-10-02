import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';


const RoundButton = styled(Button) ({
  borderRadius: '10px',
  borderWidth: '2px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  marginLeft: '5px',
  marginRight: '5px'
});

export default RoundButton;