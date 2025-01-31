import { useState, useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    //console.log("Redux user state (Login.tsx):", user);
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="auth-container">
      <h2>Log in</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Loging in...' : 'Log in'}</button>
      </form>
      <div className="navigate-container">
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/register")}>Register</button>  
      </div> 
    </div>
  );
};

export default Login;
