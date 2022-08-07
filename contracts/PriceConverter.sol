// SPDX-License-Identifier: MIT

//This is a library
//You can do uint256.function from here, and it will be treated like the first parameter in functions
//If you want second parameters, need to include it in the function call

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int price, , , ) = priceFeed.latestRoundData();
        //ETH in terms of USD
        //has 8 decimals instead of 18, need them to match up
        return uint256(price * 1e10);
    }

    //function withdraw() {

    //}

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        //Always multiply before divide in solidity
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
