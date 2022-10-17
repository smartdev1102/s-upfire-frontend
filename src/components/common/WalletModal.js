import { Button, Dialog, Box, List, ListItem, ListItemButton, DialogTitle, IconButton } from '@mui/material';
import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Injected, walletConnect } from '../../utils/ethers.util';
import metamaskIcon from '../../assets/metamask.png';
import connectwalletIcon from '../../assets/connectwallet.png';
import CloseIcon from '@mui/icons-material/Close';

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
      PaperProps={{
        style: {
          borderRadius: '15px',
        }
      }}
    >
      <Box
        sx={{
          background: 'rgb(0,36,48)',
          width: '320px',
          minWidth: '225px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            pl: '20px',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold',
            alignItems: 'center'
          }}
        >
          <Box>
            Connect a wallet
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem>
            <ListItemButton
              sx={{
                borderRadius: '10px',
                height: '45px',
                fontSize: '20px',
                display: 'flex',
                background: '#266d7a'
              }}
              onClick={handleMetaMask}
            >
              <Box sx={{ fontSize: '16px' }}>
                Metamask
              </Box>
              <Box sx={{ flexGrow: 1 }}></Box>
              <img style={{ height: '30px' }} src={metamaskIcon} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              color='primary'
              sx={{
                borderRadius: '10px',
                height: '45px',
                fontSize: '20px',
                display: 'flex',
                background: '#266d7a'
              }}
              onClick={handleWalletConnect}
            >
              <Box sx={{ fontSize: '16px' }}>
                WalletConnect
              </Box>
              <Box sx={{ flexGrow: 1 }}></Box>
              <img style={{ height: '30px' }} src={connectwalletIcon} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Dialog>
  )
}

export default WalletModal;