import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, TextField, Typography } from '@mui/material';
import background from './signup-back.jpg';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    const { email, password } = data;
    console.log("Start")
    console.log(data.email)
    try {
      console.log("iuwandiandixnawdijnawjidxnawijdnxawidn aidjn aiwdjn a")
      const { data: responseData } = await axios.post('/api/auth/register', { email, password });

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        setData({});
        alert('Successfully registered');
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContainer>
      <StyledPaper>
        <form className='form' onSubmit={handleRegister}>
          <Typography variant={'h5'}>Register</Typography>
          <TextField 
            label="Email address" 
            variant="standard" 
            className="text" 
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <TextField 
            label="Password" 
            variant="standard" 
            className="text" 
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <center>
            <Button type="submit" className="signup btn">Register</Button>
          </center>
          <center>
            <Button variant="outlined" onClick={() => navigate('/sign-in')}>Back to Sign In</Button>
          </center>
        </form>
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
    background-color: #008080;
  }
`;

export default Register;
