import React, { useState } from 'react'
import { User } from '../../types/user'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import TextField from '@mui/material/TextField'
import Input from '../input/input'
import { v4 as uuid } from 'uuid'
import Box from '@mui/material/Box'
import './dashboard.css'

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [editMode, setEditMode] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

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

  const handleEdit = (id: string) => {
    setEditMode(id)
    const userToEdit = users.find(user => user.id === id)
    if (userToEdit) {
      setEditValue(userToEdit.data)
    }
  }

  const handleConfirmEdit = (id: string) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, data: editValue } : user
    )
    setUsers(updatedUsers)
    sessionStorage.setItem('userData', JSON.stringify(updatedUsers))
    setEditMode(null)
    setEditValue('')
  }

  return (
    <Box className="dashboard-container" sx={{ p: 2 }}>
        <Input onSave={handleSaveData} />
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
                                variant="outlined"  /* Outlined variant for the input */
                            />
                            <Button 
                                onClick={() => handleConfirmEdit(user.id)}
                                variant="contained" 
                                color="primary" 
                                size="small"  /* Small size for the button */
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
)
}

export default Dashboard
