import { Button, Dialog, Box, List, ListItem, ListItemButton } from '@mui/material';
import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Injected, walletConnect} from '../../utils/ethers.util';

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

      >
        <List>
          <ListItem>
            <ListItemButton
              sx={{
                justifyContent: 'center'
              }}
              onClick={handleMetaMask}
            >
              MetaMask
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              sx={{
                justifyContent: 'center'
              }}
              onClick={handleWalletConnect}
            >
              Wallet Connect
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Dialog>
  )
}

export default WalletModal;