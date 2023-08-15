import React, { useState } from 'react';
import { User } from '../../types/user';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // This is a placeholder. In a real-world scenario, you'd fetch the user data from Ethereum.
  const fetchUserData = async () => {
    // Fetch user data logic here...
    const userData: User = {
      id: '1',
      name: 'John Doe',
      data: 'Sample encrypted data',
    };
    setUser(userData);
  };

  return (
    <div className="dashboard-container">
      <Button variant="contained" color="primary" onClick={fetchUserData}>
        Fetch User Data
      </Button>
      {user && (
        <Card className="user-card">
          <CardContent>
            <Typography variant="h5" component="div">
              User Details
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ID: {user.id}
            </Typography>
            <Typography variant="body1">
              Name: {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Data: {user.data}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
