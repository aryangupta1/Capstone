import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { User } from '../../types/user';
import Web3 from 'web3';

interface Props {
  onSave: (data: User) => void;
  web3: Web3 | null;
}

const Input: React.FC<Props> = ({ onSave, web3 }) => {
  const [inputData, setInputData] = useState<string>('');

  // smart contract instance
  const contractAddress = "0xFcCcCDce631De82D170b7970688b6Efcb1E53779";
  const contractABI = require('../../Datachain/build/contracts/UserData.json').abi;

  const handleSave = async () => {
    if (!web3) {
      console.error("Web3 is not initialized.");
      return;
    }

    const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

    const userData: User = {
      id: '2', // This is just a mock ID. In a real-world scenario, you'd generate or fetch this.
      name: 'New User',
      data: inputData as any,
    };

    const accounts = await web3.eth.getAccounts();
    await (contractInstance.methods.storeData as any)(inputData).send({ from: accounts[0] });

    onSave(userData);
    setInputData(''); // Clear the input after saving
  };

  return (
    <Card variant="outlined" style={{ margin: '20px' }}>
      <CardContent>
        <Typography variant="h6">Enter Data to Save</Typography>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Data"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default Input;
