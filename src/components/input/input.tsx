import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { User } from '../../types/user';

interface Props {
  onSave: (data: User) => void;
}

const Input: React.FC<Props> = ({ onSave }) => {
  const [inputData, setInputData] = useState<string>('');

  const handleSave = () => {
    const userData: User = {
      id: '2', // This is just a mock ID. In a real-world scenario, you'd generate or fetch this.
      name: 'New User',
      data: inputData,
    };
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
