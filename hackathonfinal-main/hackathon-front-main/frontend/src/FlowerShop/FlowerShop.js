import React, { useState, useEffect } from 'react';
import { Button, Stack, Modal, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import flowerShopBackground from './flower_shop.jpg';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function FlowerShop() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duetime, setDueTime] = useState(null);
  const [taskType, setTaskType] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token being used for fetchUser:', token); // Debugging statement
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('/api/v1/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information:', error);
        if (error.message === 'No token found' || (error.response && error.response.status === 401)) {
          alert('Session has expired. Please log in again.');
          localStorage.removeItem('token'); // Remove expired token
          navigate('/login'); // Redirect to login page
        }
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!title || !description || !duetime || !taskType) {
      alert('You have missing input');
      return;
    }

    let token = localStorage.getItem('token');
    console.log('Token being used for handleSubmit:', token); // Debugging statement
    if (!token) {
      alert('User is not logged in. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/v1/task', {
        title,
        description,
        dueDate: new Date(duetime),
        taskType,
        isCompleted: false,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('タスクを作成しました');
      handleClose();
    } catch (error) {
      console.error('Error creating task:', error);

      if (error.response && error.response.status === 401) {
        // Token expired, try to refresh
        try {
          const refreshResponse = await axios.post('/api/auth/refresh-token', {}, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          token = refreshResponse.data.token;
          localStorage.setItem('token', token); // Update token in local storage

          // Retry the original request with the new token
          await axios.post('/api/v1/task', {
            title,
            description,
            dueDate: new Date(duetime),
            taskType,
            isCompleted: false,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('タスクを作成しました');
          handleClose();
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          alert('Session has expired. Please log in again.');
          localStorage.removeItem('token'); // Remove expired token
          navigate('/login'); // Redirect to login page
        }
      } else if (error.response && error.response.data.message === 'Please complete the tasks you currently have before adding a new one.') {
        alert('すでにタスクが８個あります、他のタスクを終わらしてから追加しましょう');
      } else {
        alert('タスクの作成に失敗しました');
      }
    }
  };

  return (
    <div style={{ 
      backgroundImage: `url(${flowerShopBackground})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      height: '100vh', 
      position: 'relative' 
    }}>
      <Stack spacing={2} direction="row" sx={{ position: 'absolute', top: '65%', left: '67%', transform: 'translate(-50%, -50%)' }}>
        <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#ffffff', color: '#a9a9a9' }}>タスクを作成</Button>      
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <h2 id="modal-title">タスク作成</h2>
          <TextField 
            fullWidth 
            label="タスク名" 
            variant="standard" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }} 
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="期限"
              value={duetime}
              onChange={(newValue) => setDueTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />
          </LocalizationProvider>
          <TextField 
            fullWidth 
            label="コメント" 
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }} 
          />
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel id="taskType-label">タスクタイプ</InputLabel>
            <Select
              labelId="taskType-label"
              id="taskType-select"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              label="タスクタイプ"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="study">勉強</MenuItem>
              <MenuItem value="housework">家事</MenuItem>
              <MenuItem value="activity">活動</MenuItem>
            </Select>
          </FormControl>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#ffffff', color: '#a9a9a9' }}>タスク作成</Button>        
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default FlowerShop;

