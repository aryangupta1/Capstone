import React, { useState } from 'react'
import { User } from '../../types/user'
import './dashboard.css'

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
    <div>
      <button onClick={fetchUserData}>Fetch User Data</button>
      {user && (
        <div>
          <h2>User Details</h2>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Data: {user.data}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
