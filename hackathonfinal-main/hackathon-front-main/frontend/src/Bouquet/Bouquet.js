
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import background from './bouquet.jpg';
import redHealthy from './bouquetflowers/Red/redbouquet1.PNG';
import redDying from './bouquetflowers/Red/redbouquet2.PNG';
import redDead from './bouquetflowers/Red/redbouquet3.PNG';
import whiteHealthy from './bouquetflowers/White/whitebouquet1.PNG';
import whiteDying from './bouquetflowers/White/whitebouquet2.PNG';
import whiteDead from './bouquetflowers/White/whitebouquet3.PNG';
import yellowHealthy from './bouquetflowers/Yellow/yellowbouquet1.PNG';
import yellowDying from './bouquetflowers/Yellow/yellowbouquet2.PNG';
import yellowDead from './bouquetflowers/Yellow/yellowbouquet3.PNG';
import balancedHealthy from './bouquetflowers/Balanced/balancebouquet1.PNG';
import balancedDying from './bouquetflowers/Balanced/balancebouquet3.PNG';
import balancedDead from './bouquetflowers/Balanced/balancebouquet4.PNG';
import { Button } from '@mui/material'; // MUIのButtonをインポート

const Bouquet = () => {
  const [bouquetInfo, setBouquetInfo] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    console.log('Tooltip visible:', tooltipVisible);
    setTooltipVisible(!tooltipVisible);
    const randomNumber = Math.random();
    if (randomNumber < 0.5){
      window.location.href = 'https://www.naist.jp/';
    }
    else{
      window.location.href = 'https://www.doshisha.ac.jp/';
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get('/api/v1/tasks/completed-this-week', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.length > 0) {
        calculateBouquet(response.data);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  };

  const calculateBouquet = (tasks) => {
    let studyCount = 0;
    let activityCount = 0;
    let houseworkCount = 0;
    let points = 0;

    tasks.forEach((task) => {
      const condition = task.flowerStatus;
      console.log(`Task ID: ${task._id}, Flower Status: ${condition}`);

      if (condition === 'healthy') points += 2;
      else if (condition === 'dying') points += 1;
      else if (condition === 'dead') points += 0;

      if (task.taskType === 'study') studyCount++;
      else if (task.taskType === 'activity') activityCount++;
      else if (task.taskType === 'housework') houseworkCount++;
    });

    const totalTasks = tasks.length;
    console.log(`Total tasks: ${totalTasks}`);
    console.log(`Points: ${points}`);

    const completionRatio = points / (totalTasks * 2);
    const studyRatio = studyCount / totalTasks;
    const houseworkRatio = houseworkCount / totalTasks;
    const activityRatio = activityCount / totalTasks;

    console.log(`Completion Ratio: ${completionRatio}`);
    console.log(`Study Ratio: ${studyRatio}`);
    console.log(`Housework Ratio: ${houseworkRatio}`);
    console.log(`Activity Ratio: ${activityRatio}`);

    let majorityType;

    // Check if ratios are balanced
    if (studyRatio >= 0.25 && studyRatio <= 0.45 &&
        houseworkRatio >= 0.25 && houseworkRatio <= 0.45 &&
        activityRatio >= 0.25 && activityRatio <= 0.45) {
      majorityType = 'Balanced';
    } else {
      // Create an array of ratios with their corresponding types
      const ratios = [
        { type: 'Red', ratio: studyRatio },
        { type: 'White', ratio: activityRatio },
        { type: 'Yellow', ratio: houseworkRatio }
      ];

      // Sort the ratios in descending order
      ratios.sort((a, b) => b.ratio - a.ratio);

      if (ratios[0].ratio === ratios[1].ratio) {
        // Randomly choose between the top two if there's a tie
        majorityType = Math.random() < 0.5 ? ratios[0].type : ratios[1].type;
      } else {
        // Choose the highest ratio as majorityType
        majorityType = ratios[0].type;
      }
    }

    const bouquetCondition = (completionRatio >= 0.75) ? 'Healthy' :
                             (completionRatio >= 0.25) ? 'Dying' : 'Dead';

    setBouquetInfo({ majorityType, bouquetCondition });
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const getBouquetImages = (type, bouquetStatus) => {
    if (type === 'Red') {
      if (bouquetStatus === 'Healthy') {
        return redHealthy;
      } else if (bouquetStatus === 'Dying') {
        return redDying;
      } else if (bouquetStatus === 'Dead') {
        return redDead;
      }
    } else if (type === 'White') {
      if (bouquetStatus === 'Healthy') {
        return whiteHealthy;
      } else if (bouquetStatus === 'Dying') {
        return whiteDying;
      } else if (bouquetStatus === 'Dead') {
        return whiteDead;
      }
    } else if (type === 'Yellow') {
      if (bouquetStatus === 'Healthy') {
        return yellowHealthy;
      } else if (bouquetStatus === 'Dying') {
        return yellowDying;
      } else if (bouquetStatus === 'Dead') {
        return yellowDead;
      }
    } else {
      if (bouquetStatus === 'Healthy') {
        return balancedHealthy;
      } else if (bouquetStatus === 'Dying') {
        return balancedDying;
      } else if (bouquetStatus === 'Dead') {
        return balancedDead;
      }
    }
  };

  return (
    <BouquetContainer>
      {bouquetInfo.majorityType && bouquetInfo.bouquetCondition && (
        <FlowerWrapper>
          <BouquetImage
            src={getBouquetImages(bouquetInfo.majorityType, bouquetInfo.bouquetCondition)}
            alt="Bouquet"
            onClick={toggleTooltip}
          />
          {tooltipVisible && (
            <Tooltip>
              <p>カテゴリ：{bouquetInfo.majorityType}</p>
              <p>状態：{bouquetInfo.bouquetCondition}</p>
              <Button variant="contained" onClick={toggleTooltip}>花を購入する</Button>
            </Tooltip>
          )}
        </FlowerWrapper>
      )}
    </BouquetContainer>
  );
};

const FlowerWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 10px;
`;

const Tooltip = styled.div`
  visibility: visible;
  width: 200px;
  background-color: white;
  color: #000;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 80%; /* Adjust this value to position the tooltip above the image */
  left: -30%;
  transform: translateX(-50%);
  opacity: 1;
`;

const BouquetContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const BouquetImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  margin-left: -200px;
  margin-top: 100px; 
`;

export default Bouquet;
