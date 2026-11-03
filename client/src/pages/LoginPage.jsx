import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Login from '../components/Login';
import './AuthPages.css';

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  return (
    <div className="auth-page">
      <div>
        <Login onLogin={handleLogin} error={error} />
        <div className="auth-switch"><p>Don't have an account? <Link to="/register">Register here</Link></p></div>
      </div>
    </div>
  );
};

export default LoginPage;
