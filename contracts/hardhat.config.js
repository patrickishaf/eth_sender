// https://eth-ropsten.alchemyapi.io/v2/yz-4M1Lp9KTdiaIWvtYh6tJrmFEMG7XW

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/yz-4M1Lp9KTdiaIWvtYh6tJrmFEMG7XW',
      accounts: []
    }
  }
}