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

    event DataUpdated (
        uint id,
        string newContent
    );

    event DataDeleted(uint id);


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

    function editData(uint _id, string memory _newContent) public {
        require(_id < dataCount[msg.sender], "ID not found for the sender");
        allData[msg.sender][_id].content = _newContent;
        emit DataUpdated(_id, _newContent);
    }

    function deleteData(uint _id) public {
    require(_id < dataCount[msg.sender], "ID not found for the sender");

    for (uint i = _id; i < dataCount[msg.sender] - 1; i++) {
        allData[msg.sender][i] = allData[msg.sender][i+1];
    }
    delete allData[msg.sender][dataCount[msg.sender] - 1];
    dataCount[msg.sender]--;

    emit DataDeleted(_id);
}
}
