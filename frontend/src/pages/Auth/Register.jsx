import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { registerUser } from '../../api/auth';
import RegisterForm from '../../components/auth/RegisterForm';
import useNotification from '../../hooks/useNotification';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleRegisterSuccess = (userData, token) => {
    login(userData, token);
    notify('Account created successfully!', 'success');
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start tracking your game collection</p>
        </div>
        
        <RegisterForm 
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default Register;