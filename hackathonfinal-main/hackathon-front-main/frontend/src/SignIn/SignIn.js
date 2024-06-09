import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, TextField, Typography } from '@mui/material';
import background from './signup-back.jpg';
import axios from 'axios';
import {toast} from 'react-hot-toast';
const SignIn = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email:'',
    password:'',
  })

  const handleSignIn = async (event) => {
    event.preventDefault();
    const {email, password} = data
    try {
      // const {data} = await axios.post('/api/auth/login', {email,password})
      const response = await axios.post('/api/auth/login', {email,password})
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token in local storage
      if(data.error){
        toast.error(data.error);
      }else{
        setData({});
        navigate('/flower-shop');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Invalid email or password');
    }
  };

  return (
<AppContainer>
      <StyledPaper>
        <form className='form' onSubmit={handleSignIn}>
          <Typography variant={'h5'}>Sign In</Typography>
          <TextField 
            label="Email address" 
            variant="standard" 
            className="text" 
            value={data.email}
            onChange={(e) => setData({...data, email:e.target.value})}
          />
          <TextField 
            label="Password" 
            variant="standard" 
            className="text" 
            type="password"
            value={data.password}
            onChange={(e) => setData({...data, password:e.target.value})}
          />
          <center>
            <Button type="submit" className="signup btn">Sign In</Button>
          </center>
        </form>
        <center>
          <Button variant="outlined" onClick={() => navigate('/Register')}>Register</Button>
        </center>
      </StyledPaper>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 960px;
  height: 540px;
  .form {
    width: 60%;
    margin: 3rem;
    text-align: center;
  }
  .text {
    width: 100%;
    margin: 1rem 0;
  }
  .btn {
    width: 60%;
    color: white;
    text-align: center;
    margin: 1.5rem 0;
  }
  .login {
    background-color: #66cdaa;
  }
  .signup {
    background-color: #008080;
  }
`;

export default SignIn;
