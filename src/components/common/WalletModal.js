import { Button, Dialog, Box, List, ListItem, ListItemButton, DialogTitle } from '@mui/material';
import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Injected, walletConnect } from '../../utils/ethers.util';
import metamaskIcon from '../../assets/metamask.png';
import connectwalletIcon from '../../assets/connectwallet.png';

const WalletModal = ({ open, onClose, chain }) => {
  const { activate } = useWeb3React();

  const handleWalletConnect = async () => {
    await activate(walletConnect(chain));
    onClose();
  }

  const handleMetaMask = async () => {
    await activate(Injected);
    onClose();
  }
  return (
    <Dialog
      onClose={onClose}
      open={open}
    >
      <Box
        sx={{
          background: '#001126',
          width: '270px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: '10px',
            fontSize: '20px',
            color: 'skyBlue',
            fontWeight: 'bold'
          }}
        >
          Select your wallet
        </Box>
        <List>
          <ListItem>
            <ListItemButton
              sx={{
                background: '#266d7a',
                borderRadius: '5px',
                height: '50px',
                fontSize: '20px'
              }}
              onClick={handleMetaMask}
            >
              <img style={{height: '48px', marginRight: '10px'}} src={metamaskIcon} />
              Metamask
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              sx={{
                background: '#266d7a',
                borderRadius: '5px',
                height: '50px',
                fontSize: '20px'
              }}
              onClick={handleWalletConnect}
            >
              <img style={{height: '48px', marginRight: '10px'}} src={connectwalletIcon} />
              WalletConnect
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Dialog>
  )
}

export default WalletModal;