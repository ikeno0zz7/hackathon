
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import background from './garden_back.jpg';
import axios from 'axios';
import TaskFlower from './TaskFlower/TaskFlower';

const Garden = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const fetchRandomMessage = async () => {
    try {
      const response = await axios.get('/api/v2/random-message');
      console.log('Response from /api/random-message:', response);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching random message:', error);
    }
  };

  const fetchTasks = async () => {
    const data = await getAllTasks();
    console.log('Tasks fetched:', data); 
    setTasks(data.filter(task => !task.completedAt)); // Filter out completed tasks
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchRandomMessage();
  }, []);

  const getAllTasks = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get('/api/v1/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      return [];
    }
  };
  

  const checkFlowerCondition = (task) => {
    if (task.completedAt) {
      return task.flowerStatus; // Return the current flower status if the task is completed
    }
    const BloomingTime = 0.5;

    const dueDate = new Date(task.dueDate);
    const createdAt = new Date(task.createdAt);
    const now = new Date();

    const diffTime = (dueDate - createdAt);
    const limitTime = (dueDate - now);
    const timeRatio = limitTime / diffTime;

    console.log(timeRatio);

    if (timeRatio > 1.0) {
      console.log('dead');
      return 'dead';
    } else if (timeRatio >= BloomingTime && timeRatio <= 1.0) {
      console.log('healthy');
      return 'healthy';
    } else if (timeRatio < BloomingTime && timeRatio > 0) {
      console.log('dying');
      return 'dying';
    } else {
      console.log('dead');
      return 'dead';
    }
  };

  return (
    <GardenContainer>
      <Content>
      <MessageBox>
        {message}
      </MessageBox>
        {tasks.map((task, index) => (
          <TaskFlower
            key={task._id}
            task={task}
            index={index}
            checkFlowerCondition={checkFlowerCondition}
            refreshTasks={fetchTasks}
          />
        ))}
      </Content>
    </GardenContainer>
  );
};

const GardenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageBox = styled.div`
  background: none;
  color: black;
  padding: 20px;
  max-width: 300px;
  text-align: center;
  position: absolute;
  bottom: 70px;
  right: 100px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  text-align: center;
  color: white;
  margin-left: -300px; /* Adjust this value to move the flowers to the left */
  margin-top: -50px; /* Adjust this value to move the flowers up */
`;

export default Garden;
