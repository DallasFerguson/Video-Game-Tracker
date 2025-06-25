import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = () => {
    notify('Successfully logged in!', 'success');
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to track your game collection</p>
        </div>
        
        <LoginForm 
          onSuccess={handleLoginSuccess} 
          onSwitchToRegister={() => navigate('/register')}
        />

        <div className="auth-footer">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;