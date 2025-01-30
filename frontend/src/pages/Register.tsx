import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(registerUser({ username, email, password, fullName }));
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full name" onChange={(e) => setFullName(e.target.value)} required />
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
