/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { User } from '../../types/user';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Input from '../input/input';
import { v4 as uuid } from 'uuid';
import Box from '@mui/material/Box';
import './dashboard.css';
import Web3 from 'web3';

interface DashboardProps {
  web3: Web3 | null;
}

// Replace these with your actual ABI and contract address
const contractAddress = "0xFcCcCDce631De82D170b7970688b6Efcb1E53779";
const contractABI = require('../../Datachain/build/contracts/UserData.json').abi;

const Dashboard: React.FC<DashboardProps> = ({ web3 }) => {
  if (!web3) {
    console.error("Web3 is not initialized.");
    return null;
  }

  const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

  const [users, setUsers] = useState<User[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleSaveData = (userData: User) => {
    userData.id = uuid();
    const existingData = sessionStorage.getItem('userData');
    let newUserData: User[] = existingData ? JSON.parse(existingData) : [];
    newUserData.push(userData);
    sessionStorage.setItem('userData', JSON.stringify(newUserData));
  };

  const retrieveUserData = async () => {
    const accounts = await web3.eth.getAccounts();
    const result = await contractInstance.methods.retrieveData().call({ from: accounts[0] });
    const userDataArray: User[] = [{
      id: accounts[0],
      name: 'User',
      data: result as any
    }];
    setUsers(userDataArray);
  };

  const handleDelete = async (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    if (userToDelete) {
      try {
        const accounts = await web3.eth.getAccounts();
        await contractInstance.methods.deleteData().send({ from: accounts[0] });
        const filteredUsers = users.filter(user => user.id !== id);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error deleting data from the smart contract:", error);
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditMode(id);
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setEditValue(userToEdit.data);
    }
  };

  const handleConfirmEdit = async (id: string) => {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      try {
        const accounts = await web3.eth.getAccounts();
        await (contractInstance.methods.editData as any)(editValue).send({ from: accounts[0] });
        const updatedUsers = users.map(user => 
          user.id === id ? { ...user, data: editValue } : user
        );
        setUsers(updatedUsers);
        setEditMode(null);
        setEditValue('');
      } catch (error) {
        console.error("Error editing data in the smart contract:", error);
      }
    }
  };

  return (
    <Box className="dashboard-container" sx={{ p: 2 }}>
      <Input onSave={handleSaveData} web3={web3} />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={retrieveUserData}>
          Retrieve Saved User Data
        </Button>
      </Box>
      <List sx={{ mt: 3 }}>
        {users.map(user => (
          <ListItem key={user.id} className="list-item">
            {editMode === user.id ? (
              <div className="edit-mode">
                <TextField 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)} 
                  variant="outlined"
                />
                <Button 
                  onClick={() => handleConfirmEdit(user.id)}
                  variant="contained" 
                  color="primary" 
                  size="small"
                >
                  Confirm
                </Button>
              </div>
            ) : (
              <ListItemText
                primary={user.name}
                secondary={`ID: ${user.id}, Data: ${user.data}`}
              />
            )}
            <ListItemSecondaryAction>
              {editMode !== user.id && (
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(user.id)}>
                  <EditIcon />
                </IconButton>
              )}
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(user.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Dashboard;
