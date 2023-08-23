// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserData {
    mapping(address => string) private data;

    function storeData(string memory _data) public {
        data[msg.sender] = _data;
    }

    function retrieveData() public view returns (string memory) {
        return data[msg.sender];
    }

    function editData(string memory _newData) public {
        data[msg.sender] = _newData;
    }

    function deleteData() public {
        delete data[msg.sender];
    }
}
