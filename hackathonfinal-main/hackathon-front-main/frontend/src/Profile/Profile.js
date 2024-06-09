
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import background from './profile.jpg';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/sign-in');
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileField>
          <ProfileName>{userInfo.name || "User Name"}</ProfileName>
          <Line />
        </ProfileField>
        <ProfileField>
          <ProfileEmail>{userInfo.email || "user@example.com"}</ProfileEmail>
          <Line />
        </ProfileField>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ProfileContent>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileContent = styled.div`
  text-align: center;
  color: black;
`;

const ProfileField = styled.div`
  position: relative;
  margin: 20px 0;
`;

const ProfileName = styled.div`
  font-size: 20px;
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
`;

const ProfileEmail = styled.div`
  font-size: 18px;
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: black;
  margin: 0 auto;
`;

const LogoutButton = styled.button`
  margin-top: 40px;
  padding: 10px 20px;
  background-color: #008080;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

export default Profile;
