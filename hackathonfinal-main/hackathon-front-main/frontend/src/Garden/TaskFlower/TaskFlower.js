import React, { useState } from 'react';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import axios from 'axios';

import tulip_healthy from '../FlowersIMGFile/Tulip/tulip_alive.png';
import tulip_dying from '../FlowersIMGFile/Tulip/tulip_dying.png';
import tulip_dead from '../FlowersIMGFile/Tulip/tulip_dead.png';
import poppy_healthy from '../FlowersIMGFile/Tulip/poppy_alive.png';
import poppy_dying from '../FlowersIMGFile/Tulip/poppy_dying.png';
import poppy_dead from '../FlowersIMGFile/Tulip/poppy_dead.png';
import lily_healthy from '../FlowersIMGFile/Tulip/lily_alive.png';
import lily_dying from '../FlowersIMGFile/Tulip/lily_dying.png';
import lily_dead from '../FlowersIMGFile/Tulip/lily_dead.png';

const TaskFlower = ({ task, index, checkFlowerCondition, refreshTasks }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    console.log('toggleTooltip');
    setTooltipVisible(!tooltipVisible);
  };

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      await axios.delete(`/api/v1/task/${task._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('タスクを削除しました');
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('タスクの削除に失敗しました');
    }
  };

  const markAsCompleted = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const flowerStatus = checkFlowerCondition(task);
      await axios.put(`/api/v1/task/complete/${task._id}`, {
        flowerStatus,
        taskType: task.taskType,
        completedAt: new Date(),
        isCompleted: true,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('タスクを完了しました');
      refreshTasks();
    } catch (error) {
      console.error('Error marking task as completed:', error);
      alert('タスクの完了に失敗しました');
    }
  };

  const getFlowerImage = (flowerStatus, taskType) => {
    if (taskType === 'study') {
      if (flowerStatus === 'healthy') {
        return tulip_healthy;
      } else if (flowerStatus === 'dying') {
        return tulip_dying;
      } else {
        return tulip_dead;
      }
    } else if (taskType === 'housework') {
      if (flowerStatus === 'healthy') {
        return poppy_healthy;
      } else if (flowerStatus === 'dying') {
        return poppy_dying;
      } else {
        return poppy_dead;
      }
    } else if (taskType === 'activity') {
      if (flowerStatus === 'healthy') {
        return lily_healthy;
      } else if (flowerStatus === 'dying') {
        return lily_dying;
      } else {
        console.log(lily_dead)
        return lily_dead;
        
      }
    }
  };

  return (
    <FlowerWrapper>
      <FlowerImage
        index={index}
        src={getFlowerImage(checkFlowerCondition(task), task.taskType)}
        alt={'flower'}
        onClick={toggleTooltip}
      />
      {tooltipVisible && (
        <Tooltip>
          <p>タイトル：{task.title}</p>
          <p>内容：{task.description}</p>
          <p>期限：{task.dueDate}</p>
          <Button variant="contained" color="primary" onClick={markAsCompleted}>完了</Button>
          <Button variant="contained" color="secondary" onClick={deleteTask}>削除</Button>
        </Tooltip>
      )}
    </FlowerWrapper>
  );
};

const FlowerWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 10px;
`;

const FlowerImage = styled.img`
  width: 150px;
  height: 150px;
  cursor: pointer;
`;

const Tooltip = styled.div`
  visibility: visible;
  width: 200px;
  background-color: white;
  color: #5e5e5e;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 80%;
  left: 50%;
  margin-left: -100px;
  opacity: 1;
  transition: opacity 0.3s;
`;

export default TaskFlower;