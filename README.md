# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Expects .env file to be provided in following format:
```
ALCHEMY_RINKEBY_URL=
RINKEBY_PRIVATE_KEY=
```
where ALCHEMY_RINKEBY_URL can be found after creating an https://www.alchemy.com/ account and demo app with Rinkeby Test Network environment
and RINKEBY_PRIVATE_KEY can be found after exporting your Metamask account private keys.
These environment variables will be used for deploying the smart contract to the Rinkeby Test Network.


Try running some of the following tasks:

```shell
nvm use
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/deploy.js
npx hardhat help
```
