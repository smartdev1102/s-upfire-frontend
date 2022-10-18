import { Dialog, DialogTitle, TextField, Box, Typography, Button, FormControl, Select, MenuItem, IconButton, Stepper, Step, StepLabel, StepContent, Hidden, Grid } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React, { useEffect, useState } from 'react';
import { generator, tokenContract } from '../../utils/ethers.util';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { Close } from '@mui/icons-material';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import RoundButton from '../common/RoundButton';
import loading from '../../assets/loading.svg';

const CreateFarm = ({ open, onClose, create, walletAddress, chain, pairs }) => {
  const [startDate, setstartDate] = useState(new Date());
  const [startBlock, setStartBlock] = useState(0);
  const [bonusEndDate, setBonusEndDate] = useState(new Date());
  const [bonusBlock, setBonusBlock] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [endBlock, setEndBlock] = useState(0);
  const [farmToken, setFarmToken] = useState('');
  const [lpToken, setLpToken] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [amountIn, setAmountIn] = useState('');
  const [rewardBlock, setRewardBlock] = useState('0');
  const [isV3, setIsV3] = useState(false);
  const [currentSwap, setCurrentSwap] = useState(0); // for avalanche
  const [activeStep, setActiveStep] = useState(0);
  const [farmSymbol, setFarmSymbol] = useState();
  const [farmDecimals, setFarmDecimals] = useState();
  const [farmBalance, setFarmBalance] = useState();
  const [farmTokenName, setFarmTokenName] = useState();
  const [tokenLoading, setTokenLoading] = useState();
  const [now, setNow] = useState(new Date());
  const [tokenPrice, setTokenPrice] = useState(1);
  const [apy, setApy] = useState(0);
  const [liquidity, setLiquidity] = useState(0);

  // get farm token info when changing farm token
  useEffect(() => {
    async function getFarmToken() {
      if (farmToken.length === 42) {
        setTokenLoading(true);
        const symbol = await tokenContract(chain, farmToken).symbol();
        setFarmSymbol(symbol);
        const decimals = await tokenContract(chain, farmToken).decimals();
        setFarmDecimals(decimals);
        const balance = await tokenContract(chain, farmToken).balanceOf(walletAddress);
        setFarmBalance(formatEther(balance));
        const name = await tokenContract(chain, farmToken).name();
        setFarmTokenName(name);
        setTokenLoading(false);
      } else {
        setFarmSymbol();
        setFarmDecimals();
        setFarmBalance();
        setFarmTokenName();
      }
    }
    getFarmToken();
  }, [farmToken]);

  // formate current block when open
  useEffect(() => {
    if (open) {
      const block = Math.floor(new Date().getTime() / 1000);
      setNow(block);
    }
  }, [open]);

  // calculate apy with rewardBlock
  useEffect(() => {
    if(rewardBlock <= 0) return;
    const tempapy = rewardBlock * 3600 * 24 * 365 / Math.pow(10, 18) / 10;
    setApy(tempapy);
  }, [rewardBlock]);


  // calculate start block when change start date
  useEffect(() => {
    const block = Math.floor(new Date(startDate).getTime() / 1000);
    setStartBlock(block);
  }, [startDate]);

  // calculate bonus end block when changing bonus end date
  useEffect(() => {
    const block = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    setBonusBlock(block);
  }, [bonusEndDate]);

  // calculate end block when changing end date
  useEffect(() => {
    const block = Math.floor(new Date(endDate).getTime() / 1000);
    setEndBlock(block);
  }, [endDate])

  // calculate start date when change start block
  useEffect(() => {
    if (startBlock <= 0) return;
    const date = new Date(startBlock * 1000);
    setstartDate(date);
  }, [startBlock]);

  // calculate bonus end date when changing bonus end block
  useEffect(() => {
    if (bonusBlock <= 0) return;
    const date = new Date(bonusBlock * 1000);
    setBonusEndDate(date);
  }, [ bonusBlock])

  // calculate end date when changing end block
  useEffect(() => {
    if (endBlock <= 0) return;
    const date = new Date(endBlock * 1000);
    setEndDate(date);
  }, [endBlock]);

  const handleClose = () => {
    setFarmToken('');
    setFarmSymbol();
    onClose();
  }

  const createFarm = () => {
    const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
    const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
    create(
      farmToken,
      amountIn,
      lpToken,
      rewardBlock,
      startBlock,
      bonusEndBlock,
      multiplier,
      false
    );
  }

  // determine reward per block
  useEffect(() => {
    async function determineBlockReward() {
      try {
        const startBlock = Math.floor(new Date(startDate).getTime() / 1000);
        const endBlock = Math.floor(new Date(endDate).getTime() / 1000);
        const bonusEndBlock = Math.floor(new Date(bonusEndDate).getTime() / 1000);
        const [blockReward, requiredAmount, fee] = await generator(chain).determineBlockReward(
          parseEther(amountIn),
          startBlock,
          Number(bonusEndBlock),
          multiplier,
          endBlock
        );
        setRewardBlock(blockReward.toString());
        setLiquidity(formatEther(requiredAmount));
      } catch (err) { }
    }
    if (!!amountIn && multiplier > 0) {
      determineBlockReward();
    }
  }, [amountIn, startDate, bonusEndDate, multiplier, endDate, walletAddress])

  useEffect(() => {
    if(startDate <= bonusEndDate) return;
    setBonusEndDate(startDate);
  }, [startDate]);

  return (
    <Dialog
      onClose={handleClose}
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
            Create Farm
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            minWidth: '280px',
            maxWidth: '640px',
            height: '500px',
            p: '10px',
            background: '#030927'
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            <PerfectScrollbar style={{ padding: '30px' }}>
              {
                (chain === 43113) && (
                  <Box>
                    <RoundButton onClick={() => { setCurrentSwap(0); setLpToken('') }} color={currentSwap !== 0 ? 'secondary' : 'primary'} variant='contained'>Pangolin</RoundButton>
                    <RoundButton onClick={() => { setCurrentSwap(1); setLpToken('') }} color={currentSwap === 1 ? 'primary' : 'secondary'} variant='contained'>Trader Joe</RoundButton>
                  </Box>
                )
              }
              {
                (chain === 4) && (
                  <Box
                    sx={{
                      mb: '20px'
                    }}
                  >
                    <RoundButton onClick={() => setIsV3(false)} color={isV3 ? 'secondary' : 'primary'} variant='contained'>UniswapV2</RoundButton>
                    <RoundButton onClick={() => { setIsV3(true); setLpToken('') }} color={isV3 ? 'primary' : 'secondary'} variant='contained'>UniswapV3</RoundButton>
                  </Box>
                )
              }

              <Box
                sx={{
                  border: '2px solid green',
                  m: '-10px',
                  p: '10px',
                  borderRadius: '10px'
                }}
              >
                {/* start stepper */}
                <Stepper activeStep={activeStep} orientation='vertical'>
                  {/* step 0 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(0)}>
                      Farm which token?
                    </StepLabel>
                    <StepContent>
                      {
                        tokenLoading ? (
                          <img src={loading} />
                        ) :
                          !!farmSymbol ? (
                            <Box>
                              <Box
                                sx={{
                                  p: '10px',
                                  border: '1px solid green',
                                  borderRadius: '10px'
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
                                      pl: '10px',
                                      fontSize: '28px',
                                    }}
                                  >
                                    {farmTokenName}
                                  </Box>
                                  <Box sx={{ flexGrow: 1 }}></Box>
                                  <Box>
                                    <IconButton onClick={() => setFarmToken('')}>
                                      <Close />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Box>
                                  {farmToken}
                                </Box>
                                <Box>
                                  Symbol: {farmSymbol}
                                </Box>
                                <Box>
                                  Decimals: {farmDecimals}
                                </Box>
                                <Box>
                                  Your raw balance: {farmBalance}
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  mt: '20px',
                                  position: 'relative',
                                  display: 'flex'
                                }}
                              >
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <TextField value={amountIn} onChange={e => setAmountIn(e.target.value)} label={`Balance: ${farmBalance} ${farmSymbol}`} variant='filled' focused />
                                <button
                                  onClick={() => setAmountIn(farmBalance)}
                                  style={{
                                    position: 'absolute',
                                    right: '1px',
                                    bottom: '1px',
                                    padding: '5px',
                                    cursor: 'pointer',
                                    background: '#266d7a',
                                    outline: 'none'
                                  }}
                                  variant='contained'
                                  size='small'
                                >
                                  Max
                                </button>
                              </Box>
                            </Box>
                          ) : (
                            <>
                              <Box sx={{ color: 'text.secondary' }}>
                                Paste token address
                              </Box>
                              <Box>
                                <TextField value={farmToken} onChange={e => setFarmToken(e.target.value)} placeholder='0x...' fullWidth />
                              </Box>
                            </>
                          )
                      }
                      <Hidden smDown>
                        <Box sx={{ width: '480px' }}></Box>
                      </Hidden>
                      <Box
                        sx={{
                          mt: '10px'
                        }}
                      >
                        <Button onClick={() => setActiveStep(1)} variant='contained' size='small'>Continue</Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 1 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(1)}>
                      Select uniswap pair
                    </StepLabel>
                    <StepContent>
                      <Box >
                        <Typography variant='h6' component='h6'>
                          {isV3 ? 'Input uniswapV3 pool' : 'Select uniswap pair'}
                        </Typography>
                      </Box>
                      {
                        isV3 ? (
                          <Box>
                            <TextField value={lpToken} onChange={e => setLpToken(e.target.value)} placeholder='0x...' fullWidth />
                          </Box>
                        ) : (
                          <Box>
                            <FormControl fullWidth>
                              <Select
                                value={lpToken}
                                onChange={e => setLpToken(e.target.value)}
                              >
                                {
                                  pairs.map((pair, i) => (
                                    <MenuItem key={i} value={pair.address}>
                                      {pair.symbol1}/{pair.symbol2}
                                    </MenuItem>
                                  ))
                                }
                              </Select>
                            </FormControl>
                          </Box>
                        )
                      }
                      <Box sx={{ color: 'text.secondary' }}>
                        This MUST be a valid uniswap v2 pair. The contract checks this is a uniswap pair on farm creation. If it is not the script will revert
                      </Box>
                      <Box
                        sx={{
                          mt: '10px'
                        }}
                      >
                        <Button onClick={() => setActiveStep(2)} variant='contained' size='small'>Continue</Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 2 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(2)}>
                      Start Block
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ color: 'text.secondary', mb: '10px' }}>
                        We reccommend a start block at least 24 hours in advance to give people time to get ready to farm.
                      </Box>
                      <Box>
                        Date
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
                      <Box>
                        Block
                      </Box>
                      <Box>
                        <TextField value={startBlock} onChange={e => setStartBlock(e.target.value)} />
                      </Box>
                      <Box sx={{ color: 'text.secondary', mb: '10px' }}>
                        {`* must be above ${now}`}
                      </Box>
                      <Box
                        sx={{
                          mt: '10px'
                        }}
                      >
                        <Button onClick={() => setActiveStep(3)} variant='contained' size='small'>Continue</Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 3 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(3)}>
                      {multiplier}x Bonus
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ color: 'text.secondary' }}>
                        Multiplier ({multiplier}x)
                      </Box>
                      <Box sx={{ color: 'text.secondary', mb: '10px' }}>
                        {
                          `Bonus periods start at the start block and end at the below specified block. For no bonus period set the multiplier to '1' and the bonus end block to ${now}`
                        }
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
                      <Box>
                        Bonus end block
                      </Box>
                      <Box>
                        <TextField value={bonusBlock} onChange={e => setBonusBlock(e.target.value)} />
                      </Box>
                      <Box sx={{ color: 'text.secondary', mb: '10px' }}>
                        {`* must be >= ${now}`}
                      </Box>
                      <Box
                        sx={{
                          mt: '10px'
                        }}
                      >
                        <Button onClick={() => setActiveStep(4)} variant='contained' size='small'>Continue</Button>
                      </Box>
                    </StepContent>
                  </Step>
                  {/* step 4 */}
                  <Step>
                    <StepLabel onClick={() => setActiveStep(4)}>
                      End Block
                    </StepLabel>
                    <StepContent>
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
                      <Box sx={{ color: 'text.secondary' }}>
                        Block number
                      </Box>
                      <Box>
                        <TextField value={endBlock} onChange={e => setEndBlock(e.target.value)} />
                      </Box>
                      <Box sx={{ color: 'text.secondary', mb: '10px' }}>
                        {`* must be >= ${now}`}
                      </Box>
                      <Hidden smDown>
                        <Box sx={{ width: '480px' }}></Box>
                      </Hidden>
                      <Box
                        sx={{
                          mt: '10px'
                        }}
                      >
                        <Button onClick={() => setActiveStep(5)} variant='contained' size='small'>Finish</Button>
                      </Box>
                    </StepContent>
                  </Step>
                </Stepper>
              </Box>
              {/* apy calculator */}
              <Box
                sx={{
                  border: '2px solid green',
                  mx: '-10px',
                  mt: '20px',
                  p: '10px',
                  borderRadius: '10px'
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  <Box>
                    <Typography variant='h6' component='h6'>
                      APY calculator
                    </Typography>
                  </Box>
                  <Box sx={{ color: 'text.secondary', mb: '10px' }}>
                    *Complete above steps first
                  </Box>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField value={tokenPrice} onChange={e=>setTokenPrice(e.target.value)} label='Expected token price' />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField value={liquidity} onChange={e=>setLiquidity(e.target.value)} label='Expected liquidity' />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      my: '20px'
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            color: 'text.secondary',
                            mb: '10px',
                            ml: '25px',
                            textAlign: 'left',
                            fontSize: '14px'
                          }}
                        >
                          Block Reward
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'left',
                            ml: '25px'
                          }}
                        >
                          {rewardBlock === 0 ? '?' : rewardBlock}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            color: 'text.secondary',
                            mb: '10px',
                            ml: '25px',
                            textAlign: 'left',
                            fontSize: '14px'
                          }}
                        >
                          Expected APY
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'left',
                            ml: '25px'
                          }}
                        >
                          { apy }%
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </PerfectScrollbar>
          </Box>
        </Box>
        <Box sx={{ px: '10px', py: '10px' }}>
          <Button onClick={createFarm} variant='contained' fullWidth>Create</Button>
        </Box>
      </Box >
    </Dialog >
  );
}

export default CreateFarm;