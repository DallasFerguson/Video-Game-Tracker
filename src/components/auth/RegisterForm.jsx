import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button/Button'; // Adjust path if necessary

const RegisterForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use your specific API URL
      const API_URL = 'http://localhost:3001/api/auth/register';
      
      console.log('Submitting registration:', { username, email, password: '******' });
      
      const response = await axios.post(API_URL, {
        username,
        email,
        password
      });

      console.log('Registration response:', response.data);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard or home page
      navigate('/');
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Extract error message from response
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0]?.msg ||
                          'Registration failed. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
            minLength="3"
            maxLength="20"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          disabled={isLoading}
          className="auth-button"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <button 
          type="button" 
          className="auth-switch" 
          onClick={onSwitchToLogin}
        >
          Login here
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;