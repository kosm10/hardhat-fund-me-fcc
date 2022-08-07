const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

/*
above is same as:
const helperConfig = require("../helper-hardhat-config");
const networkConfig = helperConfig.networkConfig;

basically a way to take out a single attribute from the file
*/

//below is syntactic sugar version of above
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    //if chainId is X use address Y
    //const ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
    let ethUSDPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("MockV3Aggregator");
        ethUSDPriceFeedAddress = ethUSDAggregator.address;
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
    }

    //if the contract doesn't exist, we deploy a minimal version of it
    //for our local testing

    //when going for localhost or hardhat network we want to use a mock
    const args = [ethUSDPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        //args: [address], //put pricefeed in here, as this is passed to constructor
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }
    log("--------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
