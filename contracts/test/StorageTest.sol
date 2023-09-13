// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../Storage.sol";

contract StorageTest {

    Storage storageInstance;

    // This function is called before any test function and can be used for setup
    function beforeEach() public {
        storageInstance = new Storage();
    }

    function testCreateData() public {
        storageInstance.createData("Hello");
        uint count = storageInstance.dataCount(address(this));
        Assert.equal(count, 1, "Data count should be 1 after adding data");

        uint id;
        string memory content;
        (id, content) = storageInstance.allData(address(this), 0);
        Assert.equal(id, 0, "Data ID should be 0");
        Assert.equal(content, "Hello", "Data content should be 'Hello'");
    }

    function testEditData() public {
        storageInstance.createData("Hello");
        storageInstance.editData(0, "Hello World");

        uint id;
        string memory content;
        (id, content) = storageInstance.allData(address(this), 0);
        Assert.equal(content, "Hello World", "Data content should be 'Hello World'");
    }

    function testDeleteData() public {
        storageInstance.createData("Hello");
        storageInstance.deleteData(0);

        uint count = storageInstance.dataCount(address(this));
        Assert.equal(count, 0, "Data count should be 0 after deletion");
    }

    // Add tests to ensure events are emitted properly, and tests to check for fails like editing non-existing data, etc.
}
