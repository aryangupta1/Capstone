import React, { useState } from 'react'
import { User } from '../../types/user'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Input from '../input/input'
import { v4 as uuid } from 'uuid'
import './dashboard.css'

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])

  const handleSaveData = (userData: User) => {
    userData.id = uuid()
    const existingData = sessionStorage.getItem('userData')
    let newUserData: User[] = existingData ? JSON.parse(existingData) : []
    newUserData.push(userData)
    sessionStorage.setItem('userData', JSON.stringify(newUserData))
  }

  const retrieveUserData = () => {
    const storedUserData = sessionStorage.getItem('userData')
    if (storedUserData) {
      const userDataArray: User[] = JSON.parse(storedUserData)
      setUsers(userDataArray)
    }
  }

  const handleDelete = (id: string) => {
    const filteredUsers = users.filter(user => user.id !== id)
    setUsers(filteredUsers)
    sessionStorage.setItem('userData', JSON.stringify(filteredUsers))
  }

  return (
    <div className="dashboard-container">
      <Input onSave={handleSaveData} />
      <Button variant="contained" color="primary" onClick={retrieveUserData}>
        Retrieve Saved User Data
      </Button>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            <ListItemText
              primary={user.name}
              secondary={`ID: ${user.id}, Data: ${user.data}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(user.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default Dashboard
