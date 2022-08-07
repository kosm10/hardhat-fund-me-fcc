const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    //const chainId = network.config.chainId;

    if (developmentChains.includes(network.name)) {
        log("Local network detected.  Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        log("Mocks deployed");
        log("----------------------------------------------------------");
    }
};

//adding so we can choose which to deploy (all or just mocks)
//specify by yarn hardhat deploy --tags mocks
module.exports.tags = ["all", "mocks"];
