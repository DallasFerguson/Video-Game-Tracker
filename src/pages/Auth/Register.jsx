import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { login } = useAuth();

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
          <p>Join to start tracking your game collection</p>
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