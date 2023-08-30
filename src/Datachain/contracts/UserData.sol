// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserData {
    string[] public data;

    function store(string memory _data) public {
        data.push(_data);
    }

    function retrieve() public view returns (string[] memory) {
        return data;
    }

    function update(uint index, string memory _data) public {
        require(index < data.length, "Index out of bounds!");
        data[index] = _data;
    }

    function remove(uint index) public {
        require(index < data.length, "Index out of bounds!");
        data[index] = data[data.length - 1];
        data.pop();
    }
}
