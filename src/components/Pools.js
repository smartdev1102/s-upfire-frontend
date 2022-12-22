import React, { useEffect, useState } from "react";
import {
  Box,
  Switch,
  IconButton,
  Grid,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Typography,
  MenuItem,
  Divider,
  Menu,
  Card,
} from "@mui/material";
import moment from "moment";
import MenuIcon from "@mui/icons-material/Menu";
import RoundButton from "./common/RoundButton";
import SearchInput from "./common/SearchInput";
import SearchIcon from "@mui/icons-material/Search";
import PoolDlg from "./common/PoolDlg";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {
  address,
  erc20Abi,
  generatorWeb3,
  factory,
  pool,
  farm,
  tokenContract,
  sgeneratorWeb3,
  spoolWeb3,
  sfactory,
  tokenWeb3,
} from "../utils/ethers.util";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import Hidden from "@mui/material/Hidden";
import { useWeb3React } from "@web3-react/core";
import { poolService } from "../services/api.service";
import defaultIcon from "../assets/defaultIcon.png";
import airdropIcon from "../assets/icons/airdrop.svg";
import accountIcon from "../assets/icons/account.svg";

const admin = process.env.REACT_APP_ADMIN.toLowerCase();

const Pools = ({
  chain,
  walletAddress,
  stakePools,
  openWalletAlert,
  setPools,
}) => {
  // const [activeTab, setActiveTab] = useState('mining');
  const [openDlg, setOpenDlg] = useState(false);
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [openIndex, setOpenIndex] = useState([]);
  const [isMyPool, setIsMyPool] = useState(false);
  const [filterdPools, setFilteredPools] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState();
  const open = Boolean(anchorEl);

  const chainsName = {
    56: "smartchain",
    43114: "avalanchec",
  };

  console.log(filterdPools);

  const handleVisible = async (id, invisible) => {
    await poolService.setVisible({
      id: id,
      invisible: invisible,
    });
    const index = stakePools.findIndex((item) => item._id === id);
    let temp = [...stakePools];
    temp[index].invisible = invisible;
    setPools(temp);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isMyPool) {
      const temp = stakePools.filter((pool) => Number(pool.balance) > 0);
      setFilteredPools(temp);
    } else {
      setFilteredPools(stakePools);
    }
  }, [isMyPool, stakePools]);
  useEffect(() => {
    if (!!searchKey) {
      const temp = stakePools.filter((pool) =>
        pool.name.toLowerCase().includes(searchKey.toLowerCase())
      );
      setFilteredPools(temp);
    } else {
      setFilteredPools(stakePools);
    }
  }, [searchKey]);

  const { library } = useWeb3React();

  const handleCreatePool = () => {
    if (!walletAddress) {
      openWalletAlert();
    } else {
      setOpenDlg(true);
    }
  };

  const createPool = async (
    rewardToken,
    stakeToken,
    apr,
    amountIn,
    startBlock,
    endBlock
  ) => {
    const allowance = await tokenContract(chain, rewardToken).allowance(
      walletAddress,
      address[chain][0]["sgenerator"]
    );
    if (allowance < parseEther(amountIn)) {
      const tx = await tokenWeb3(rewardToken, library.getSigner()).approve(
        address[chain][0]["sgenerator"],
        parseEther(amountIn)
      );
      await tx.wait();
    }
    const tx = await sgeneratorWeb3(chain, library.getSigner()).createPool(
      rewardToken,
      stakeToken,
      (apr * 10000).toFixed(0),
      parseEther(amountIn)
    );
    await tx.wait();

    const length = await sfactory(chain).poolsLength();
    const poolAddress = await sfactory(chain).poolAtIndex(Number(length) - 1);
    const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
    const stakeSymbol = await tokenContract(chain, stakeToken).symbol();
    const res = await poolService.createPool({
      name: `${stakeSymbol}/${rewardSymbol}`,
      apr: Number(apr),
      owner: walletAddress,
      rewardToken: rewardToken,
      stakeToken: stakeToken,
      address: poolAddress,
      chain: chain,
      start: new Date(startBlock * 1000),
      end: new Date(endBlock * 1000),
      rewardSymbol: rewardSymbol,
    });
    setPools([...stakePools, res]);
    setOpenDlg(false);
  };

  const handleOpenIndex = (i) => {
    const index = openIndex.findIndex((ind) => ind === i);
    let temp = [...openIndex];
    if (index === -1) {
      temp.push(i);
      setOpenIndex(temp);
    } else {
      temp.splice(index, 1);
      setOpenIndex(temp);
    }
  };

  const stake = async (tokenAddress, poolAddress) => {
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
      window.alert("staked");
    } catch (err) {
      console.log(err);
    }
  };

  const unstake = async (poolAddress) => {
    try {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).unstake(
        parseEther(amountOut)
      );
      await tx.wait();
      window.alert("unstake");
    } catch (err) {
      console.log(err);
    }
  };

  const harvest = async (poolAddress) => {
    try {
      const tx = await spoolWeb3(poolAddress, library.getSigner()).harvest();
      await tx.wait();
      window.alert("harvest");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        p: "1%",
      }}
    >
      <PoolDlg
        open={openDlg}
        onClose={() => setOpenDlg(false)}
        chain={chain}
        walletAddress={walletAddress}
        create={createPool}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            px: { xs: "10px", sm: "40px" },
            py: "10px",
            background: "#001126",
            borderRadius: "20px",
          }}
          flexDirection={{ sm: "row", xs: "column" }}
        >
          <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box display={"flex"} alignItems="center">
              <Typography
                sx={{ mt: "7px" }}
                px={{ sm: "10px", xs: "10px" }}
                variant="h6"
                gutterBottom
                component="h6"
                textTransform={"capitalize"}
              >
                Total Pool liquidity
              </Typography>
              <Typography
                sx={{ mx: "5px", mt: "10px" }}
                variant="h5"
                gutterBottom
                component="h5"
              >
                0
              </Typography>
            </Box>
            <FormGroup sx={{ mx: "10px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMyPool}
                    onChange={(e) => setIsMyPool(e.target.checked)}
                  />
                }
                label="My pools"
              />
            </FormGroup>
          </Box>
          <Box sx={{ flexGrow: "1" }}></Box>
          <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box position={"relative"}>
              <SearchInput
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Search by name, symbol"
              />
              <IconButton
                sx={{ position: "absolute", top: "2px", right: "3px" }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
              <RoundButton
                onClick={handleCreatePool}
                sx={{
                  color: "text.primary",
                  border: "1px solid white",
                }}
                variant="outlined"
              >
                <Typography variant="h3" component="h3">
                  Create Pool
                </Typography>
              </RoundButton>
              <RoundButton
                sx={{
                  color: "text.primary",
                  border: "1px solid white",
                }}
                variant="outlined"
                id="filter-button"
                aria-controls={open ? "filter-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MenuIcon />
                {/* <ExpandMoreIcon /> */}
              </RoundButton>
              <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  "aria-labelledby": "filter-button",
                }}
              >
                <MenuItem>Filtered By</MenuItem>
                <Divider />
                <MenuItem onClick={() => handleFilter("apr")}>APR</MenuItem>
                <MenuItem onClick={() => handleFilter("liq")}>
                  Liquidity
                </MenuItem>
                <MenuItem onClick={() => handleFilter("alpha")}>
                  Alphabetic
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        className="stackss"
        sx={
          {
            // minWidth: '620px'
          }
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            px: "40px",
            background: "#001126",
            py: "10px",
            borderRadius: "15px",
            mt: "10px",
          }}
        >
          <Grid
            sx={{
              cursor: "pointer",
              alignItems: "center",
            }}
            container
            spacing={2}
          >
            <Grid item md={6} sm={7} xs={7}>
              <Grid container spacing={2}>
                {/* <Hidden smDown>
                    <Grid item xs={2}>
                    </Grid>
                  </Hidden> */}
                <Grid item md={4} sm={5} xs={5}>
                  <Typography variant="h3" component="h3">
                    Pool
                  </Typography>
                </Grid>
                {/* <Hidden smDown> */}
                <Grid item md={4} sm={4} xs={4}>
                  <Typography
                    sx={{
                      ml: "-20px",
                      marginLeft: {
                        md: "0px",
                        sm: "0px",
                        xs: "5px",
                      },
                    }}
                    variant="h3"
                    component="h3"
                  >
                    Reward
                  </Typography>
                </Grid>
                {/* </Hidden> */}
                <Grid item md={4} sm={3} xs={3}>
                  <Typography
                    sx={{
                      ml: "-15px",
                      marginLeft: {
                        md: "-5px",
                        sm: "5px",
                        xs: "5px",
                      },
                    }}
                    variant="h3"
                    component="h3"
                    className="asdasd"
                  >
                    APY
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} sm={3} xs={3}>
              <Grid container spacing={2}>
                <Hidden smDown>
                  <Grid item xs={1}></Grid>
                  <Grid sx={{ pl: "10px" }} item xs={5}>
                    <Typography variant="h3" component="h3">
                      Start Date
                    </Typography>
                  </Grid>
                </Hidden>
                <Grid item xs={10} sm={5}>
                  <Typography
                    sx={{ pr: "6px", ml: "10px" }}
                    variant="h3"
                    component="h3"
                  >
                    End Date
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container spacing={2}>
                <Grid item xs={10} sm={6}>
                  <Typography sx={{ ml: "20px" }} variant="h3" component="h3">
                    Liquidity
                  </Typography>
                </Grid>
                <Hidden smDown>
                  <Grid item xs={6}>
                    <Typography sx={{ ml: "20px" }} variant="h3" component="h3">
                      Stakers
                    </Typography>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {/* pools */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              minHeight: "50vh",
              width: "100%",
            }}
          >
            {filterdPools.map((pool, i) => (
              <Box key={i}>
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
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                    onClick={() => handleOpenIndex(i)}
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
                          <img
                            style={{
                              marginTop: "5px",
                              zIndex: "9",
                              borderRadius: "100%",
                            }}
                            className={"dualImg"}
                            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
                              chainsName[pool.chain]
                            }/assets/${pool.stakeToken}/logo.png`}
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
                            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
                              chainsName[pool.chain]
                            }/assets/${pool.rewardToken}/logo.png`}
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
                            {`${pool.name.toUpperCase()}`}
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
                            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
                              chainsName[pool.chain]
                            }/assets/${pool.address}/logo.png`}
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
                            {`${pool.rewardSymbol}`}
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
                            {`${pool.apr.toFixed(3)}%`}
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
                              {moment(pool.start).format("MMM DD YYYY")}
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
                            {moment(pool.end).format("MMM DD YYYY")}
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
                            <Typography variant="h3" component="div">
                              {0}
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
                              <Box sx={{ mr: "10px", mt: "5px" }}>
                                <img
                                  style={{ height: "20px" }}
                                  src={accountIcon}
                                />
                              </Box>
                              <Typography variant="h3" component="h3">
                                {0}
                              </Typography>
                            </Hidden>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {openIndex.includes(i) && (
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
                                  stake(pool.rewardToken, pool.address)
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
                                onClick={() => unstake(pool.address)}
                                variant="contained"
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
                                onClick={() => harvest(pool.address)}
                                variant="contained"
                              >
                                Harvest
                              </Button>
                            </Grid>
                            <Grid item xs={8}>
                              {(String(walletAddress).toLowerCase() === admin ||
                                String(walletAddress).toLowerCase() ===
                                  pool.owner.toLowerCase()) && (
                                <Box>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={!pool.invisible}
                                        onChange={(e) =>
                                          handleVisible(
                                            pool._id,
                                            !e.target.checked
                                          )
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
                    </Box>
                  )}
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <Pagination count={10} variant='outlined'/> */}
      </Box>
    </Box>
  );
};

export default Pools;
