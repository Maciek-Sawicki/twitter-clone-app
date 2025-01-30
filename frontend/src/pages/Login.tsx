import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
    navigate('/home');
  };

  return (
    <div>
      <h2>Logowanie</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Logowanie...' : 'Zaloguj'}</button>
      </form>
    </div>
  );
};

export default Login;
