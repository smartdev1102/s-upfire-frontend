import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Hidden,
  TextField,
  Typography,
  Box,
  Switch,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
  IconButton,
  Tooltip
} from "@mui/material";
import moment from "moment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import defaultIcon from "../../assets/defaultIcon.png";
import airdropIcon from "../../assets/icons/airdrop.svg";
import accountIcon from "../../assets/icons/account.svg";
import { spoolWeb3, tokenWeb3, spool, pool, tokenContract } from "../../utils/ethers.util";
import { useWeb3React } from "@web3-react/core";
import { parseEther, formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import useWalletAlert from "../../hooks/useWalletAlertContext";
import { networks } from "../../utils/network.util"
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const PoolCard = ({ poolInfo, chain, walletAddress, handleVisible, poolAddress }) => {
  const { library } = useWeb3React();

  const [openStake, setOpenStake] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [stakers, setStakers] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userRewardBalance, setUserRewardBalance] = useState(0);
  const [apy, setApy] = useState(0);
  const [copied, setCopied] = useState(false);
  const { setOpen: setWalletAlertOpen } = useWalletAlert();

  const chainsName = {
    56: "smartchain",
    43114: "avalanchec",
  };

  async function getPool() {
    const info = await spool(chain, poolInfo.address).getStakerCount();
    setStakers(BigNumber.from(info).toNumber());
    const decimals = await tokenContract(chain, poolInfo.rewardToken).decimals();
    const amount = await tokenContract(chain, poolInfo.rewardToken).balanceOf(poolInfo.address);
    const lpAmount = parseFloat(formatUnits(amount, decimals)).toFixed(0) - poolInfo.supply
    setApy(lpAmount === 0 ? poolInfo.apr : (parseFloat(poolInfo.rewardPerBlock) * 3600 * 24 * 365) / lpAmount * 100)

    if (walletAddress) {
      const balance1 = await spool(chain, poolInfo.address).deposits(
        walletAddress
      );
      const balance2 = await spool(chain, poolInfo.address).pendingReward(
        walletAddress
      );
      console.log(balance2, "balance2");
      console.log("$$$$$$", formatUnits(balance1, decimals));
      setUserRewardBalance(parseFloat(formatUnits(balance2, decimals)).toFixed(2))
      setUserBalance(Number(formatUnits(balance1, decimals)));
    }
  }

  useEffect(() => {
    getPool();
  }, [walletAddress, poolInfo]);

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 1000)
  }, [copied])

  const stake = async (tokenAddress, poolAddress) => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    try {
      const approveTx = await tokenWeb3(
        tokenAddress,
        library.getSigner()
      ).approve(poolAddress, parseEther(amountIn));
      await approveTx.wait();
      const tx = await spoolWeb3(poolAddress, library.getSigner()).stake(
        parseEther(amountIn)
      );
      await tx.wait();
      window.alert("Tokens successfully staked.");
    } catch (err) {
      console.log(err);
    } finally {
      getPool();
    }
  };

  const unstake = async (poolAddress) => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    try {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).unstake(
        parseEther(amountOut)
      );
      await tx.wait();
      window.alert("Tokens successfully unstaked.");
    } catch (err) {
      console.log(err);
    } finally {
      getPool();
    }
  };

  const harvest = async (poolAddress) => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    try {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).harvest();
      await tx.wait();
      window.alert("Tokens successfully claimed.");
    } catch (err) {
      console.log(err);
    } finally {
      getPool();
    }
  };

  useEffect(() => {
    if (poolAddress.toLowerCase() === poolInfo.address.toLowerCase()) {
      setOpenStake(true);
    } else {
      setOpenStake(false);
    }
  }, [poolAddress])

  const handleOpenStake = () => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
  }

  return (
    poolInfo && (
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid #2494F3",
          fontFamily: "Exo",
          py: "15px",
          my: "10px",
          px: "20px",
        }}
      >
        <Link to={`/pool/${poolInfo.address}`} style={{ textDecoration: 'unset' }}>
          <Grid
            container
            spacing={2}
            sx={{
              cursor: "pointer",
              alignItems: "center",
              color: "white"
            }}
            onClick={() => setOpenStake(!openStake)}
          >
            <Grid item md={6} sm={7} xs={7}>
              <Grid sx={{ alignItems: "center" }} container spacing={2}>
                {/* <Hidden smDown> */}
                <Grid
                  item
                  md={4}
                  sm={5}
                  xs={5}
                  sx={{
                    display: "flex",
                    marginRight: {
                      md: "0px",
                      sm: "0px",
                      xs: "0px",
                    },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      mt: "5px",
                      zIndex: "9",
                      borderRadius: "100%",
                    }}
                    className={"dualImg"}
                    src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainsName[poolInfo.chain]
                      }/assets/${poolInfo.stakeToken}/logo.png`}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = defaultIcon;
                    }}
                  />
                  <Typography
                    variant="h3"
                    component="h4"
                    sx={{ marginTop: "5px", marginLeft: "10px" }}
                  >
                    {`${poolInfo.name.split("/")[0]}`}
                  </Typography>
                </Grid>

                {/* <Hidden smDown> */}
                <Grid
                  item
                  md={4}
                  sm={4}
                  xs={4}
                  sx={{
                    marginLeft: {
                      md: "0px",
                      sm: "0px",
                      xs: "0px",
                    },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      marginTop: "5px",
                      borderRadius: "100%",
                      marginRight: "10px",
                    }}
                    className={"dualImg"}
                    src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainsName[poolInfo.chain]
                      }/assets/${poolInfo.address}/logo.png`}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = defaultIcon;
                    }}
                  />
                  <Typography
                    variant="h3"
                    component="h3"
                    className="asdasda"
                    sx={{ marginTop: "5px" }}
                  >
                    {`${poolInfo.rewardSymbol}`}
                  </Typography>
                </Grid>

                {/* <Hidden smDown> */}
                {/* <Grid item xs={1}>
  </Grid> */}
                {/* </Hidden> */}

                <Grid item md={4} sm={3} xs={3}>
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{
                      marginLeft: {
                        md: "0px",
                        sm: "0px",
                        xs: "0px",
                      },
                    }}
                  >
                    {`${apy.toFixed(2)}%`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={4} sm={3} xs={3}>
              <Grid sx={{ alignItems: "center" }} container spacing={0}>
                <Hidden smDown>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                    item
                    xs={1}
                  >
                    <DateRangeIcon sx={{ color: "#1F8BED" }} />
                  </Grid>
                  <Grid item md={5} sm={5} xs={5}>
                    <Typography variant="h3" component="h3">
                      {moment(poolInfo.start).format("MMM DD YYYY")}
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                    item
                    xs={1}
                  >
                    <DateRangeIcon sx={{ color: "#1F8BED" }} />
                  </Grid>
                </Hidden>
                <Grid item md={5} sm={5} xs={12}>
                  <Typography variant="h3" component="h3">
                    {moment(poolInfo.end).format("MMM DD YYYY")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Box component="img" src={airdropIcon} sx={{ mx: "10px", mt: "5px" }} />
                    <Typography variant="h3" component="div">
                      {poolInfo.supply}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Hidden smDown>
                      <Box component="img" src={accountIcon} sx={{ mr: "10px", mt: "5px", height: "20px" }} />
                      <Typography variant="h3" component="h3">
                        {stakers}
                      </Typography>
                    </Hidden>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Link>
        {openStake && (
          <Box
            sx={{
              background: "#020826",
              px: "30px",
              py: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      fullWidth
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                      label="Stake Amount"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={() =>
                        stake(poolInfo.rewardToken, poolInfo.address)
                      }
                      disabled={
                        !(amountIn > 0)
                      }
                      variant="contained"
                    >
                      Stake
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      fullWidth
                      value={amountOut}
                      onChange={(e) => setAmountOut(e.target.value)}
                      label="Unstake Amount"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={() => unstake(poolInfo.address)}
                      variant="contained"
                      disabled={
                        !(amountOut > 0 && userBalance >= amountOut)
                      }
                    >
                      Unstake
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={() => harvest(poolInfo.address)}
                      variant="contained"
                      disabled={
                        walletAddress === undefined ||
                        !(userRewardBalance > 0)
                      }
                    >
                      Claim
                    </Button>
                  </Grid>
                  <Grid item xs={8}>
                    {(String(walletAddress).toLowerCase() === admin ||
                      String(walletAddress).toLowerCase() ===
                      poolInfo.owner.toLowerCase()) && (
                        <Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!poolInfo.invisible}
                                onChange={(e) =>
                                  handleVisible(poolInfo._id, !e.target.checked)
                                }
                              />
                            }
                            label="show/hide"
                          />
                        </Box>
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Accordion sx={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))', mt: '20px', '&::before': { backgroundColor: 'transparent' }, borderRadius: '4px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ px: '20px' }}
                onClick={handleOpenStake}
              >
                <Typography>Pool Information</Typography>
              </AccordionSummary>
              {walletAddress &&
                <AccordionDetails sx={{ px: '20px', pb: '20px' }}>
                  <Grid container direction="row">
                    <Grid item md={3} sm={3} xs={12}>
                      <Stack direction="column" gap={1} justifyContent="center">
                        <MuiLink href={`${networks[chain].blockExplorerUrls}/address/${poolInfo.address}`} target="_blank">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>Pool Contract</Typography>
                            <OpenInNewIcon />
                          </Stack>
                        </MuiLink>
                        <MuiLink href={`${networks[chain].blockExplorerUrls}/address/${poolInfo.staketoken}`} target="_blank">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>LP Token</Typography>
                            <OpenInNewIcon />
                          </Stack>
                        </MuiLink>
                        <MuiLink href={`${networks[chain].blockExplorerUrls}/address/${poolInfo.rewardToken}`} target="_blank">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>Reward Token</Typography>
                            <OpenInNewIcon />
                          </Stack>
                        </MuiLink>
                      </Stack>
                    </Grid>
                    <Grid container item md={9} sm={9} xs={12}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Box sx={{ mb: '8px' }}>
                          <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Direct Link</Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography noWrap>{window.location.href}</Typography>
                            <CopyToClipboard onCopy={() => setCopied(true)} text={window.location.href}>
                              <Tooltip title={copied ? 'Copied' : 'Copy link'} placement="top">
                                <IconButton><ContentCopyIcon sx={{ fontSize: '16px' }} /></IconButton>
                              </Tooltip>
                            </CopyToClipboard>
                          </Stack>
                        </Box>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <Stack direction="column" gap={2} justifyContent="center">
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Lock Period</Typography>
                            <Typography>{poolInfo.isLock ? `${poolInfo.lockPeriod / 86400} days` : 'Not Exist'}</Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Bonus Period</Typography>
                            <Typography>{poolInfo.isBonus ? `Until ${new Date(poolInfo.bonusPeriod).toLocaleString()} ${poolInfo.multiplier}X` : 'Not Exist'}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <Stack direction="column" gap={2} justifyContent="center">
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Deposited Tokens</Typography>
                            <Typography>{userBalance} {poolInfo.name.split("/")[0]}</Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Unclaimed Rewards</Typography>
                            <Typography>{userRewardBalance} {poolInfo.rewardSymbol}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              }
            </Accordion>
          </Box>
        )}

      </Card>
    )
  );
};

export default PoolCard;
