// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {

    struct Data {
        uint id;
        string content;
    }

    event DataCreated (
        uint id,
        string content
    );

    // constructor() {
    //     createData("Hello World");
    // }

    mapping(address => mapping(uint => Data)) public allData;
    mapping(address => uint) public dataCount;

    function createData(string memory _content) public {
        uint count = dataCount[msg.sender];
        allData[msg.sender][count] = Data(count, _content);
        emit DataCreated(count, _content);
        dataCount[msg.sender]++;
    }
}