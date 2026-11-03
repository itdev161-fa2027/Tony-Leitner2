import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Register from '../components/Register';
import './AuthPages.css';

const RegisterPage = () => {
  const { register, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleRegister = async (name, email, password) => {
    const result = await register(name, email, password);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  return (
    <div className="auth-page">
      <div>
        <Register onRegister={handleRegister} error={error} />
        <div className="auth-switch"><p>Already have an account? <Link to="/login">Login here</Link></p></div>
      </div>
    </div>
  );
};

export default RegisterPage;
