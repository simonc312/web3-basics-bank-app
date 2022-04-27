// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Bank {
    address public bankOwner;
    string public bankName;
    mapping(address => uint256) public balanceOf;

    constructor() {
        bankOwner = msg.sender;
    }

    function depositMoney() public payable {
        require(msg.value != 0, "You need to deposit some amount of money!");
        balanceOf[msg.sender] += msg.value;
    }

    function setBankName(string memory _name) external {
        require(
            msg.sender == bankOwner,
            "You must be the owner to set the name of the bank"
        );
        bankName = _name;
    }

    function withdrawMoney(address payable _to, uint256 _total) public {
    	//require(msg.sender == bankOwner, "You must be the owner to make withdrawals");
        require(
            _total <= balanceOf[msg.sender],
            "You have insuffient funds to withdraw"
        );

        balanceOf[msg.sender] -= _total;
        (bool success, ) = _to.call{value:_total}("");
        require(success, "withdraw money failed.");
    }

    function getbalanceOf() external view returns (uint256) {
        return balanceOf[msg.sender];
    }

    function getBankBalance() public view returns (uint256) {
        require(
            msg.sender == bankOwner,
            "You must be the owner of the bank to see all balances."
        );
        return address(this).balance;
    }
}
