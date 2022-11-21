import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { Button, Card, FormControl, FormControlLabel, Grid, MenuItem, Select, Switch, TextField } from '@mui/material';
import farmIcon from '../../assets/icons/farm.svg';
import airdropIcon from '../../assets/icons/airdrop.svg';
import accountIcon from '../../assets/icons/account.svg';
import { farm, farmWeb3, tokenContract, tokenWeb3 } from '../../utils/ethers.util';
import { formatEther, parseEther } from 'ethers/lib/utils';
import moment from 'moment';
import Hidden from '@mui/material/Hidden';
import { useWeb3React } from '@web3-react/core';
import DateRangeIcon from '@mui/icons-material/DateRange';
import loading from '../../assets/loading.svg';
import defaultIcon from '../../assets/defaultIcon.svg';


const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const FarmCard = ({ farmInfo, chain, setSelectedFarm, handleVisible, walletAddress }) => {
  const [openStake, setOpenStake] = useState(false);
  const [amountIn, setAmountIn] = useState('0');
  const [amountOut, setAmountOut] = useState('0');
  const [liq, setLiq] = useState('');
  const [lockUnit, setLockUnit] = useState('month');
  const [lockPeriod, setLockPeriod] = useState();
  const [boostPeriod, setBoostPeriod] = useState();
  const [boostNum, setBoostNum] = useState(0);
  const [boostx, setBoostx] = useState(1);
  const [userBalance, setUserBalance] = useState();

  useEffect(() => {
    async function getLiq() {
      const info = await farm(chain, farmInfo.address).farmInfo();
      const supply = info.farmableSupply;
      const period = info.lockPeriod;
      setLockPeriod(Number(period));
      setLiq(formatEther(supply));
    }

    async function getUserInfo() {
      if (!walletAddress) return;
      const userinfo = await farm(chain, farmInfo.address).userInfo(walletAddress);
      setUserBalance(formatEther(userinfo.amount));
    }
    getLiq();
    getUserInfo();
  }, [farmInfo, walletAddress]);

  useEffect(() => {
    let period;
    if (lockUnit === 'day') {
      period = boostNum * 86400;
    } else if (lockUnit === 'week') {
      period = boostNum * 86400 * 7;
    } else {
      period = boostNum * 86400 * 30;
    }
    setBoostPeriod(period);
    setBoostx(period / lockPeriod);
  }, [boostNum, lockUnit]);

  const { library } = useWeb3React()

  const handleSelectedFarm = () => {
    setSelectedFarm(farmInfo);
  }

  const lock = async () => {
    await farmWeb3(farmInfo.address, library.getSigner()).lock(boostPeriod);
  }

  const withdraw = async () => {
    const tx = await farmWeb3(farmInfo.address, library.getSigner()).withdraw(parseEther(amountIn));
    await tx.wait();
    window.alert("Withdraw");
  }

  return (
    <Card
      sx={{
        borderRadius: '20px',
        border: '1px solid #2494F3',
        fontFamily: 'Exo',
        py: '15px',
        my: '10px'
      }}
    >
      <Grid
        onClick={() => setOpenStake(!openStake)}
        sx={{
          cursor: 'pointer',
          alignItems: 'center'
        }}
        container
        spacing={2}
      >
        <Grid item xs={3}>
          <Box
            sx={{
              height: '100%',
              py: '10px',
              px: '20px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  width: '50px',
                  pt: '5px'
                }}
              >
                <img style={{width: '30px'}} src={defaultIcon} />
              </Box>
              <Box sx={{ mb: 0 }}>
                {`${farmInfo.name.toUpperCase()}`}
              </Box>
              {/* <Box sx={{ fontSize: '12px' }}>
                {
                  farmInfo.start > new Date() && (
                    <Box sx={{ color: 'skyBlue' }}>
                      Farming is not started.
                    </Box>
                  )
                }
                {
                  (farmInfo.start < new Date() && farmInfo.end > new Date()) && (
                    <Box sx={{ color: 'skyBlue' }}>
                      Farming is active.
                    </Box>
                  )
                }
                {
                  farmInfo.bonusEndBlock < new Date() && (
                    <Box sx={{ color: 'skyBlue' }}>
                      Farming has finished.
                    </Box>
                  )
                }
              </Box> */}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2}>
          {`${farmInfo.baseToken}`}
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              ml: '-5px'
            }}
          >
            <Grid container spacing={2}>
              <Hidden smDown>
                <Grid sx={{ mt: '5px' }} item xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: '-2px'
                    }}
                  >
                    <DateRangeIcon sx={{ color: '#1F8BED', ml: '-20px', mr: '10px' }} />
                    {moment(farmInfo.start).format('MMM DD YYYY')}
                  </Box>
                </Grid>
              </Hidden>
              <Grid sx={{ mt: '5px', ml: '-5px' }} item xs={6}>
                {moment(farmInfo.end).format('MMM DD YYYY')}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              ml: '-5px'
            }}
          >
            <Box sx={{ mx: '10px', mt: '3px' }}>
              <img src={airdropIcon} />
            </Box>
            <Box
              sx={{
                mt: '-2px'
              }}
            >
              {liq == 0 ? (
                <img style={{ height: '20PX' }} src={loading} />
              ) : Math.trunc(liq)}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center'
            }}
          >
            <Box sx={{ mx: '10px' }}>
              <img style={{ height: '20px' }} src={accountIcon} />
            </Box>
            <Box sx={{ marginBottom: '4px' }}>
              {farmInfo.numFarmers}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* stake */}
      {
        openStake && (
          <Box
            sx={{
              background: '#020826',
              px: '3%',
              py: '1%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box sx={{ mx: '2%' }}>
                <Button onClick={handleSelectedFarm} variant='contained'>add liquidity and stake</Button>
              </Box>
              <Box>
                <TextField value={amountOut} onChange={e => setAmountOut(e.target.value)} label="amount" xs={6} fullWidth />
              </Box>
              <Box sx={{ mx: '2%' }}>
                <Button onClick={withdraw} variant='contained'>withdraw</Button>
              </Box>
              {
                ((String(walletAddress).toLowerCase() === admin || String(walletAddress).toLowerCase() === String(farmInfo.owner).toLowerCase()) && !!walletAddress) && (
                  <Box>
                    <FormControlLabel control={<Switch checked={!farmInfo.invisible} onChange={e => handleVisible(farmInfo._id, !e.target.checked)} />} label="show/hide from site" />
                  </Box>
                )
              }
            </Box>
            {
              userBalance > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: '20px'
                  }}
                >
                  <Box
                    sx={{
                      width: '480px',
                    }}
                  >
                    <Box>
                      Boost {boostx === 0 || !boostx ? 1 : boostx.toFixed(1)}x
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField size='small' value={boostNum} onChange={e => setBoostNum(e.target.value)} />
                      </Grid>
                      <Grid item xs={4}>
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
                      <Grid item xs={4}>
                        <Button onClick={lock} variant='contained' size='small'>Lock</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )
            }
          </Box>
        )
      }

    </Card>
  );
}

export default FarmCard;