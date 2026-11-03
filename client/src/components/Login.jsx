import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, error: authError }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { email, password } = formData;

  const onChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) setErrors({ ...errors, [event.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  return (
    <form className="login-form" onSubmit={onSubmit} noValidate>
      <h2>Welcome Back</h2>
      <p className="login-subtitle">Login to your account</p>
      {authError && <div className="error-message">{authError}</div>}
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" className={errors.email ? 'input-error' : ''} type="email" name="email" value={email} onChange={onChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input id="login-password" className={errors.password ? 'input-error' : ''} type="password" name="password" value={password} onChange={onChange} />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>
      <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
};

export default Login;
