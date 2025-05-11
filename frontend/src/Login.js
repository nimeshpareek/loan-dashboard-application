import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Username:', username);
    console.log('Password:', password);

    // Hardcoded credentials for admin and verifier
    if (username === 'admin' && password === 'admin123') {
      console.log('Logging in as admin');
      localStorage.setItem('role', 'admin');
      navigate('/admin-dashboard');
      return;
    }

    if (username === 'verifier' && password === 'verifier123') {
      console.log('Logging in as verifier');
      localStorage.setItem('role', 'verifier');
      navigate('/verifier-dashboard');
      return;
    }

    // If not admin or verifier, proceed with API call for regular users
    try {
      console.log('Attempting API login for regular user');
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      console.log('API Response:', response.data);

      // Save token, role, and userId in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId); // Save user ID

      // Redirect to user dashboard
      console.log('Login successful, redirecting to user dashboard');
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Login error:', err);

      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
