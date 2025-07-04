import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { loginUser } from '../../api/auth';
import Button from '../ui/Button/Button';
import './Auth.css';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { user, token } = await loginUser(credentials);
      login(user, token);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-form">
      <h2>Login to GameTracker</h2>
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
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
            value={credentials.password}
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
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="auth-footer">
        Don't have an account?{' '}
        <button 
          type="button" 
          className="auth-switch" 
          onClick={onSwitchToRegister}
        >
          Register here
        </button>
      </div>
    </div>
  );
};

export default LoginForm;