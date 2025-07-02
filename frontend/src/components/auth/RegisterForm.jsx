import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { registerUser } from '../../api/auth';
import Button from '../ui/Button/Button';
import './Auth.css';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { user, token } = await registerUser({
        username: userData.username,
        email: userData.email,
        password: userData.password
      });
      login(user, token);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-form">
      <h2>Create an Account</h2>
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
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
            value={userData.email}
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
            value={userData.password}
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
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
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