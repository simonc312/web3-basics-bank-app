const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Bank Contract", function () {




    // Mocha has four functions that let you hook into the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for tests, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.

    let BankContract;
    let contract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        BankContract = await ethers.getContractFactory("Bank");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // To deploy our contract, we just have to call deploy() and await
        // for it to be deployed(), which happens once its transaction has been
        // mined.
        contract = await BankContract.deploy();
    });

    it("Should not have a Bank Name initially", async function () {
        expect(await contract.bankName()).to.equal("");
    })


    it("Should return the new Bank Name once it's changed by owner", async function () {

        const newBankName = "Bankless Bank of Banking";
        const setBankNameTx = await contract.setBankName(newBankName);

        // wait until the transaction is mined
        await setBankNameTx.wait();

        expect(await contract.bankName()).to.equal(newBankName);
    });

    it("Should not be able to change Bank Name if is not the owner", async function () {

        const newBankName = "Another Bank of Banking";

        await expect(contract.connect(addr1).setBankName(newBankName)).to.be.revertedWith("Only the Bank Owner is authorized");;
    });

    it("Should allow deposit of ether", async function () {

        const depositAmount = ethers.utils.parseEther("1");
        const depositTx = await contract.depositMoney({ value: depositAmount });

        // wait until the transaction is mined
        await depositTx.wait();

        expect(await contract.getbalanceOf()).to.equal(depositAmount);
    })

    it("Should only allow owner to see total bank balance", async function () {

        const depositAmount = ethers.utils.parseEther("1");
        const depositTx = await contract.depositMoney({ value: depositAmount });

        // wait until the transaction is mined
        await depositTx.wait();

        const depositTx2 = await contract.connect(addr1).depositMoney({ value: depositAmount });

        // wait until the transaction is mined
        await depositTx2.wait();

        expect(await contract.getBankBalance()).to.equal(ethers.utils.parseEther("2"));

        await expect(contract.connect(addr1).getBankBalance()).to.revertedWith("Only the Bank Owner is authorized");
    })

    it("Should allow money from your deposited balance to be withdrawn", async function () {
        const withdrawAmount = ethers.utils.parseEther("1");
        const depositAmount = ethers.utils.parseEther("1");
        const emptyAmount = ethers.utils.parseEther("0");
        const depositTx = await contract.connect(addr1).depositMoney({ value: depositAmount });
        await depositTx.wait();
        expect(await contract.connect(addr1).getbalanceOf()).to.equal(depositAmount);
        expect(await contract.getBankBalance()).to.equal(depositAmount);
        const withdrawTx = await contract.connect(addr1).withdrawMoney(addr1.address, withdrawAmount);
        await withdrawTx.wait();
        expect(await contract.connect(addr1).getbalanceOf()).to.equal(emptyAmount);
        expect(await contract.getBankBalance()).to.equal(emptyAmount);
    })

    it("Should fail if not enough money to withdraw", async function () {
        const withdrawAmount = ethers.utils.parseEther("1");
        const addr1Address = await addr1.getAddress(); //another way to get signer address
        await expect(contract.withdrawMoney(addr1Address, withdrawAmount)).to.be.revertedWith("You have insuffient funds to withdraw");
    })

});
