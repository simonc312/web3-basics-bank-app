// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Bank {
    address public bankOwner;
    string public bankName;
    mapping(address => uint256) public balanceOf;

    event Withdrawal(address indexed to, address indexed from, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    modifier onlyOwner() {
        require(bankOwner == msg.sender, "Only the Bank Owner is authorized");
        _;
    }

    constructor() {
        bankOwner = msg.sender;
    }

    function depositMoney() public payable {
        require(msg.value != 0, "You need to deposit some amount of money!");
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function setBankName(string memory _name) external onlyOwner {
        bankName = _name;
    }

    function withdrawMoney(address payable _to, uint256 _total) public {
        require(
            _total <= balanceOf[msg.sender],
            "You have insuffient funds to withdraw"
        );

        balanceOf[msg.sender] -= _total;
        (bool success, ) = _to.call{value:_total}("");
        require(success, "withdraw money failed.");
        emit Withdrawal(_to, msg.sender, _total);
    }

    function getbalanceOf() external view returns (uint256) {
        return balanceOf[msg.sender];
    }

    function getBankBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
