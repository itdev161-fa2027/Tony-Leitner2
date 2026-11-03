import { useState } from 'react';
import './Register.css';

const Register = ({ onRegister, error: authError }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { name, email, password } = formData;

  const onChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) setErrors({ ...errors, [event.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await onRegister(name, email, password);
    setLoading(false);
  };

  return (
    <form className="register-form" onSubmit={onSubmit} noValidate>
      <h2>Create an Account</h2>
      <p className="register-subtitle">Join our blog community</p>
      {authError && <div className="error-message">{authError}</div>}
      <div className="form-group">
        <label htmlFor="register-name">Name</label>
        <input id="register-name" className={errors.name ? 'input-error' : ''} type="text" name="name" value={name} onChange={onChange} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input id="register-email" className={errors.email ? 'input-error' : ''} type="email" name="email" value={email} onChange={onChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input id="register-password" className={errors.password ? 'input-error' : ''} type="password" name="password" value={password} onChange={onChange} />
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>
      <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Register'}</button>
    </form>
  );
};

export default Register;
