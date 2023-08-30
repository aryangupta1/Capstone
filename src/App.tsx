import React, { useState } from 'react';
import './App.css';

import Web3 from 'web3';
import { Button, TextField, Container, Typography, List, ListItem, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
const contractAddress = '0x5248D9Ed445fFaD6af6E2B4C4a4859eDd48A7187';
const abi = require('./Datachain/build/contracts/UserData.json').abi;

interface UserDataContract {
  methods: {
    store(data: string): {
      send(transactionObject: { from: string }): Promise<any>;
    };
    update(index: number, data: string): {
      send(transactionObject: { from: string }): Promise<any>;
    };
    retrieve(): {
      call(transactionObject: { from: string }): Promise<string[]>;
    };
    remove(index: number): {
      send(transactionObject: { from: string }): Promise<any>;
    };
  };
}


const contract = new web3.eth.Contract(abi, contractAddress) as unknown as UserDataContract;

function App() {
    const [data, setData] = useState<string[]>([]);
    const [newData, setNewData] = useState<string>('');

    async function fetchData() {
      try {
          const accounts = await web3.eth.getAccounts();
          const result: string[] = await contract.methods.retrieve().call({ from: accounts[0] });
          setData(result);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }
  
  async function updateData(index: number, newData: string) {
      try {
          const accounts = await web3.eth.getAccounts();
          await contract.methods.update(index, newData).send({ from: accounts[0] });
      } catch (error) {
          console.error("Error updating data:", error);
      }
  }

  async function storeData() {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.store(newData).send({ from: accounts[0] });
      setData(prevData => [...prevData, newData]);
      setNewData(''); // Clear the new data input after storing
    } catch (error) {
      console.error("Error storing data:", error);
    }
  }
  
    
  async function deleteData(index: number) {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.remove(index).send({ from: accounts[0] });
      setData(prevData => prevData.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
  

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Dacentralised Data Storage
      </Typography>
      
      <List>
        {data.map((item, index) => (
          <ListItem key={index}>
            <TextField 
              variant="outlined"
              value={item} 
              onChange={(e) => {
                let updatedData = [...data];
                updatedData[index] = e.target.value;
                setData(updatedData);
              }} 
            />
            <IconButton onClick={() => updateData(index, data[index])}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteData(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      
      <TextField 
        variant="outlined"
        placeholder="Enter new data..."
        fullWidth
        margin="normal"
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={storeData} style={{marginRight: '10px'}}>
        Store New Data
      </Button>
      <Button variant="contained" color="secondary" onClick={fetchData}>
        Retrieve Data
      </Button>
    </Container>
  );
}

export default App;