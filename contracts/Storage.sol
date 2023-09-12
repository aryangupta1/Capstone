// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {

    struct Data {
        uint id;
        string content;
    }

    mapping(address => Data[]) private userDatas;

    function createData(string memory _content) public {
        uint id = userDatas[msg.sender].length;
        Data memory newData = Data(id, _content);
        userDatas[msg.sender].push(newData);
    }

    function editData(uint _id, string memory _newContent) public {
        require(_id < userDatas[msg.sender].length, "ID not found for the sender");
        userDatas[msg.sender][_id].content = _newContent;
    }

    function deleteData(uint _id) public {
        require(_id < userDatas[msg.sender].length, "ID not found for the sender");
        delete userDatas[msg.sender][_id];
    }

    function getDataCount(address _user) public view returns (uint) {
        return userDatas[_user].length;
    }

    function getData(address _user, uint _id) public view returns (Data memory) {
        require(_id < userDatas[_user].length, "ID not found for the specified user");
        return userDatas[_user][_id];
    }
}
