import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import airdropIcon from "../../assets/icons/airdrop.svg";
import accountIcon from "../../assets/icons/account.svg";
import {
  farm,
  farmWeb3,
  pair,
} from "../../utils/ethers.util";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import moment from "moment";
import Hidden from "@mui/material/Hidden";
import { useWeb3React } from "@web3-react/core";
import DateRangeIcon from "@mui/icons-material/DateRange";
import loading from "../../assets/loading.svg";
import defaultIcon from "../../assets/defaultIcon.png";
import useWalletAlert from "../../hooks/useWalletAlertContext";
import { networks } from "../../utils/network.util"
import { Link } from 'react-router-dom';

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const FarmCard = ({
  farmInfo,
  chain,
  setSelectedFarm,
  handleVisible,
  walletAddress,
  stakeFalg,
  farmAddress
}) => {
  const [openStake, setOpenStake] = useState(false);
  const [amountOut, setAmountOut] = useState(0);
  const [liq, setLiq] = useState();
  const [lockUnit, setLockUnit] = useState("month");
  const [lockPeriod, setLockPeriod] = useState(0);
  const [boostPeriod, setBoostPeriod] = useState(0);
  const [boostNum, setBoostNum] = useState(0);
  const [boostx, setBoostx] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [userRewardBalance, setUserRewardBalance] = useState(0);
  const [farmers, setFarmers] = useState(0);
  const [bonusPeriod, setBonusPeriod] = useState(0);
  const [startBlock, setStartBlock] = useState(0);
  const [apy, setApy] = useState(0);
  const [d_LP, setD_LP] = useState(18);
  const [d_RT, setD_RT] = useState(18);
  const { setOpen: setWalletAlertOpen } = useWalletAlert();

  const chainsName = {
    56: "smartchain",
    43114: "avalanchec",
  };

  async function getLiq() {
    const info = await farm(chain, farmInfo.address).farmInfo();
    setLockPeriod(Number(formatUnits(info.lockPeriod, "0")));
    setFarmers(Number(formatUnits(info.numFarmers, "0")));
    setStartBlock(Number(formatUnits(info.startBlock, "0")))
    setBonusPeriod(Number(formatUnits(info.bonusEndBlock, "0")))

    const balanceLP = await pair(chain, info.lpToken).balanceOf(farmInfo.address);
    const decimalLP = await pair(chain, info.lpToken).decimals();
    setD_LP(decimalLP);
    const balanceRT = await pair(chain, info.rewardToken).balanceOf(farmInfo.address);
    const decimalRT = await pair(chain, info.rewardToken).decimals();
    setD_RT(decimalRT);
    setLiq(parseFloat(formatUnits(info.farmableSupply), decimalRT).toFixed(3));
    var rate = Number(formatUnits(balanceRT, decimalRT)) / Number(formatUnits(balanceLP, decimalLP.toString()))
    if (rate === 0 || rate === Infinity) {
      rate = 1;
    }
    const apyData = Number(formatUnits(info.blockReward, decimalRT)) * (86400 * 365) * rate;

    setApy(apyData.toFixed(3));
  }

  async function getUserInfo() {
    if (!walletAddress) return;
    const userinfo = await farm(chain, farmInfo.address).userInfo(walletAddress)
    const rewardBalance = await farm(chain, farmInfo.address).pendingReward(walletAddress)
    setUserBalance(Number(formatUnits(userinfo.amount, d_LP)))
    setUserRewardBalance(Number(formatUnits(rewardBalance, d_RT)))
  }

  useEffect(() => {
    getLiq();
    getUserInfo();
  }, [farmInfo, walletAddress, stakeFalg]);

  useEffect(() => {
    if (farmAddress.toLowerCase() === farmInfo.address.toLowerCase()) {
      setOpenStake(true);
    } else {
      setOpenStake(false);
    }
  }, [farmAddress])

  useEffect(() => {
    let period;
    if (lockUnit === "day") {
      period = boostNum * 86400;
    } else if (lockUnit === "week") {
      period = boostNum * 86400 * 7;
    } else {
      period = boostNum * 86400 * 30;
    }
    setBoostPeriod(period);
    setBoostx(period / lockPeriod);
  }, [boostNum, lockUnit]);

  const { library } = useWeb3React();

  const handleSelectedFarm = () => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    setSelectedFarm(farmInfo);
  };

  const lock = async () => {
    await farmWeb3(farmInfo.address, library.getSigner()).lock(boostPeriod);
  };

  const withdraw = async () => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    try {
      const tx = await farmWeb3(farmInfo.address, library.getSigner()).withdraw(
        parseUnits(amountOut, d_LP)
      );
      await tx.wait();
      window.alert("Tokens successfully withdrew.");
    } catch (err) {
      console.log(err);
    } finally {
      getLiq();
      getUserInfo();
    }
  };

  const withdrawAll = async () => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    try {
      const tx = await farmWeb3(farmInfo.address, library.getSigner()).emergencyWithdraw();
      await tx.wait();
      window.alert("Tokens successfully withdrew.");
    } catch (err) {
      console.log(err);
    } finally {
      getLiq();
      getUserInfo();
    }
  };

  const claim = async () => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
    try {
      const tx = await farmWeb3(
        farmInfo.address,
        library.getSigner()
      ).withdraw('0');
      await tx.wait();
    } catch (err) {
      console.log(err);
    } finally {
      getLiq();
      getUserInfo();
    }
  };

  const handleOpenStake = () => {
    if (!walletAddress) {
      setWalletAlertOpen(true);
      return;
    }
  }

  return (
    <Card
      sx={{
        borderRadius: "20px", border: "1px solid #2494F3", fontFamily: "Exo", py: "15px", my: "10px", px: "20px"
      }}
    >
      <Link to={`/farm/${farmInfo.address}`} style={{ textDecoration: 'unset' }}>
        <Grid
          sx={{
            cursor: "pointer",
            alignItems: "center",
            color: 'white'
          }}
          container
          spacing={2}
          onClick={() => setOpenStake(!openStake)}
        >
          <Grid item md={6} sm={7} xs={7}>
            <Grid sx={{ alignItems: "center" }} container spacing={2}>
              {/* <Hidden smDown> */}
              <Grid item md={4} sm={5} xs={5} sx={{
                display: "flex",
                marginRight: {
                  md: "0px", sm: "0px", xs: "0px",
                },
                display: "flex",
                alignItems: "center",
              }}
              >
                <img
                  style={{
                    marginTop: "5px",
                    zIndex: "9",
                    borderRadius: "100%",
                  }}
                  className={"dualImg"}
                  src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainsName[farmInfo.chain]
                    }/assets/${farmInfo.token0}/logo.png`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = defaultIcon;
                  }}
                />
                <img
                  style={{
                    marginTop: "5px",
                    borderRadius: "100%",
                    marginLeft: "-15px",
                  }}
                  className={"dualImg"}
                  src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainsName[farmInfo.chain]
                    }/assets/${farmInfo.token1}/logo.png`}
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
                  {`${farmInfo.name.toUpperCase()}`}
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
                <img
                  style={{
                    marginTop: "5px",
                    borderRadius: "100%",
                    marginRight: "10px",
                  }}
                  className={"dualImg"}
                  src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainsName[farmInfo.chain]
                    }/assets/${farmInfo.address}/logo.png`}
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
                  {`${farmInfo.baseToken}`}
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
                  {`${apy}%`}
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
                    {moment(farmInfo.start).format("MMM DD YYYY")}
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
                  {moment(farmInfo.end).format("MMM DD YYYY")}
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
                  <Box sx={{ mx: "10px", mt: "5px" }}>
                    <img src={airdropIcon} />
                  </Box>
                  {liq == 0 ? (
                    <img style={{ height: "20px" }} src={loading} />
                  ) : (
                    <Typography variant="h3" component="div">
                      {Math.trunc(liq)}
                    </Typography>
                  )}
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
                    <Box sx={{ mr: "10px", mt: "5px" }}>
                      <img style={{ height: "20px" }} src={accountIcon} />
                    </Box>
                    <Typography variant="h3" component="h3">
                      {farmers}
                    </Typography>
                  </Hidden>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Link>
      {/* stake */}
      {openStake && (
        <Box
          sx={{
            background: "#020826",
            alignItems: "center",
            px: "30px",
            py: "10px"
          }}
        >
          <Grid
            sx={{ alignItems: "center" }}
            container
            spacing={2}
          >
            <Grid item md={3} xs={12}>
              <Button
                onClick={handleSelectedFarm}
                fullWidth
                variant="contained"
              >
                add LQ & stake
              </Button>
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                size="small"
                fullWidth
                value={amountOut}
                onChange={(e) => setAmountOut(e.target.value)}
                label="amount"
                xs={6}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                fullWidth
                onClick={withdraw}
                variant="contained"
                disabled={
                  !walletAddress || !(amountOut > 0 && parseFloat(userBalance) >= amountOut)
                }
              >
                withdraw
              </Button>
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                fullWidth
                onClick={claim}
                variant="contained"
                disabled={
                  !walletAddress || !(parseFloat(userRewardBalance) > 0)
                }
              >
                claim
              </Button>
            </Grid>
            <Grid item md={2} xs={12}>
              <Button
                fullWidth
                onClick={withdrawAll}
                variant="contained"
                disabled={
                  !walletAddress || !(parseFloat(userBalance) > 0)
                }
              >
                withdraw all
              </Button>
            </Grid>
            {/* <Hidden smDown>
              <Grid item xs={1}></Grid>
            </Hidden> */}
          </Grid>

          {(String(walletAddress).toLowerCase() === admin ||
            String(walletAddress).toLowerCase() ===
            String(farmInfo.owner).toLowerCase()) &&
            !!walletAddress && (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!farmInfo.invisible}
                      onChange={(e) =>
                        handleVisible(farmInfo._id, !e.target.checked)
                      }
                    />
                  }
                  label="show/hide from site"
                />
              </Box>
            )}
          {/* {userBalance > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "20px",
              }}
            >
              <Box
                sx={{
                  width: "480px",
                }}
              >
                <Box>
                  Boost {boostx === 0 || !boostx ? 1 : boostx.toFixed(1)}x
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      value={boostNum}
                      onChange={(e) => setBoostNum(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Select
                        value={lockUnit}
                        onChange={(e) => setLockUnit(e.target.value)}
                        size="small"
                      >
                        <MenuItem value="day">days</MenuItem>
                        <MenuItem value="week">weeks</MenuItem>
                        <MenuItem value="month">months</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button onClick={lock} variant="contained" size="small">
                      Lock
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )} */}
          <Accordion sx={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))', mt: '20px', '&::before': { backgroundColor: 'transparent' }, borderRadius: '4px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ px: '20px' }}
              onClick={handleOpenStake}
            >
              <Typography>Farm Information</Typography>
            </AccordionSummary>
            {walletAddress &&
              <AccordionDetails sx={{ px: '20px', pb: '20px' }}>
                <Grid container direction="row">
                  <Grid item md={3} sm={3} xs={12}>
                    <Stack direction="column" gap={1} justifyContent="center">
                      <MuiLink href={`${networks[chain].blockExplorerUrls}/address/${farmInfo.address}`} target="_blank">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography>Farm Contract</Typography>
                          <OpenInNewIcon />
                        </Stack>
                      </MuiLink>
                      <MuiLink href={`${networks[chain].blockExplorerUrls}/address/${farmInfo.lptoken}`} target="_blank">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography>LP Token</Typography>
                          <OpenInNewIcon />
                        </Stack>
                      </MuiLink>
                      <MuiLink href={`${networks[chain].blockExplorerUrls}/address/${farmInfo.rewardToken}`} target="_blank">
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
                        <Typography noWrap>{window.location.href}</Typography>
                      </Box>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <Stack direction="column" gap={2} justifyContent="center">
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Lock Period</Typography>
                          <Typography>{lockPeriod / 86400} days</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Bonus Period</Typography>
                          <Typography>{bonusPeriod === 0 || bonusPeriod < startBlock ? 'Not Exist' : `Until ${new Date(bonusPeriod * 1000).toLocaleString()}  ${((bonusPeriod - startBlock) / 86400).toFixed(0)}.${(((bonusPeriod - startBlock) % 86400) / 3600 / 24 * 100).toFixed(0)}X`}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <Stack direction="column" gap={2} justifyContent="center">
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Deposited Tokens</Typography>
                          <Typography>{userBalance} LP</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', color: '#f9bd22' }}>Unclaimed Rewards</Typography>
                          <Typography>{`${userRewardBalance} ${farmInfo.baseToken}`}</Typography>
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
  );
};

export default FarmCard;
