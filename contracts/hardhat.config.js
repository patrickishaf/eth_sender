require('dotenv').config();
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/yz-4M1Lp9KTdiaIWvtYh6tJrmFEMG7XW',
      accounts: [
        '6bddbba93784b7f1958f6241a0ee5f375f48de93938d70728c759d3cc21b8e70'
      ],
    },
  },
};