import React, { useEffect, useState } from "react";
import {
  Box,
  Switch,
  IconButton,
  Grid,
  FormGroup,
  FormControlLabel,
  Typography,
  MenuItem,
  Divider,
  Menu,
  Pagination
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RoundButton from "./common/RoundButton";
import SearchInput from "./common/SearchInput";
import SearchIcon from "@mui/icons-material/Search";
import PoolDlg from "./common/PoolDlg";
import {
  address,
  tokenContract,
  sgeneratorWeb3,
  sfactory,
  tokenWeb3,
  pair
} from "../utils/ethers.util";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import Hidden from "@mui/material/Hidden";
import { useWeb3React } from "@web3-react/core";
import { poolService } from "../services/api.service";
import PoolCard from "./common/PoolCard";

const Pools = ({
  chain,
  walletAddress,
  stakePools,
  openWalletAlert,
  setPools,
  poolAddress,
  itemsPerPage
}) => {
  // const [activeTab, setActiveTab] = useState('mining');
  const [openDlg, setOpenDlg] = useState(false);
  const [isMyPool, setIsMyPool] = useState(false);
  const [filterdPools, setFilteredPools] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState();
  const open = Boolean(anchorEl);
  const [page, setPage] = useState(1);

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
    const sorted = [...filterdPools];
    if (filter === "apr") {
      sorted.sort((a, b) => {
        if (Number(a.apr) < Number(b.apr)) {
          return 1;
        } else if (Number(a.apr) > Number(b.apr)) {
          return -1;
        }
        return 0;
      });
      setFilteredPools(sorted);
    }
    if (filter === "liq") {
      sorted.sort((a, b) => {
        // if (BigNumber.from.apply(a.supply).lt(BigNumber.from(b.supply))) {
        //   return -1;
        // } else if (
        //   BigNumber.from.apply(a.supply).gt(BigNumber.from(b.supply))
        // ) {
        //   return 1;
        // }
        // return 0;
        return 1;
      });
      setFilteredPools(sorted);
    }
    if (filter === "alpha") {
      sorted.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      setFilteredPools(sorted);
    }
  }, [filter, stakePools]);

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

  useEffect(() => {
    const poolIndex = filterdPools.findIndex((pool) => poolAddress.toLowerCase() === pool.address.toLowerCase())
    setPage(parseInt((poolIndex + 1) / itemsPerPage) + 1)
  }, [filterdPools])

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
    rewardBlock,
    rewardDecimals,
    amountIn,
    startBlock,
    endBlock,
    multiplier,
    bonusPeriod,
    lockPeriod,
    isBonus,
    isLock
  ) => {
    const allowance = await tokenContract(chain, rewardToken).allowance(
      walletAddress,
      address[chain][0]["sgenerator"]
    );

    if (allowance.lt(parseUnits(amountIn, rewardDecimals))) {
      const tx = await tokenWeb3(rewardToken, library.getSigner()).approve(
        address[chain][0]["sgenerator"],
        parseUnits(amountIn, rewardDecimals)
      );
      await tx.wait();
    }
    const apr = parseFloat(rewardBlock) * 365 * 86400 / amountIn * 100 / 12;
    const ethFee = await sgeneratorWeb3(chain, library.getSigner()).ethFee();
    console.log(ethFee);
    const tx = await sgeneratorWeb3(chain, library.getSigner()).createPool(
      rewardToken,
      stakeToken,
      (apr * 10).toFixed(0),
      parseUnits(amountIn, rewardDecimals),
      lockPeriod,
      (multiplier * 100).toFixed(0),
      bonusPeriod.toString(),
      { value: ethFee }
    );
    await tx.wait();

    const length = await sfactory(chain).poolsLength();
    const poolAddress = await sfactory(chain).poolAtIndex(Number(length) - 1);
    const rewardSymbol = await tokenContract(chain, rewardToken).symbol();
    const stakeSymbol = await tokenContract(chain, stakeToken).symbol();
    const amount = await pair(chain, rewardToken).balanceOf(poolAddress);

    const res = await poolService.createPool({
      name: `${stakeSymbol}/${rewardSymbol}`,
      apr: apr * 12,
      owner: walletAddress,
      rewardToken: rewardToken,
      stakeToken: stakeToken,
      rewardPerBlock: rewardBlock,
      supply: parseFloat(formatUnits(amount, rewardDecimals)),
      address: poolAddress,
      chain: chain,
      start: new Date(startBlock * 1000),
      end: new Date(endBlock * 1000),
      rewardSymbol: rewardSymbol,
      multiplier: multiplier,
      bonusPeriod: parseFloat(bonusPeriod) * 1000,
      lockPeriod: parseFloat(lockPeriod),
      isBonus: isBonus,
      isLock: isLock
    });
    setPools([...stakePools, res]);
    setOpenDlg(false);
  };

  const setPageChange = (e, currentPage) => {
    setPage(currentPage);
  }

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
                Total Staking liquidity
              </Typography>
              <Typography
                sx={{ mx: "5px", mt: "10px" }}
                variant="h5"
                gutterBottom
                component="h5"
              >
                0 $
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
                <MenuItem onClick={() => handleFilter("apr")}>APY</MenuItem>
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
              (i >= (page - 1) * itemsPerPage && i < page * itemsPerPage) && (
                <PoolCard
                  key={i}
                  poolInfo={pool}
                  chain={chain}
                  walletAddress={walletAddress}
                  handleVisible={handleVisible}
                  poolAddress={poolAddress}
                />
              )
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
        <Pagination
          count={parseInt(filterdPools.length / itemsPerPage) + 1}
          color="primary"
          onChange={setPageChange}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default Pools;
