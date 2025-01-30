import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./store/slices/authSlice";
import { AppDispatch } from "./store/store";
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser()); 
  }, [dispatch]);

  return (
    <div className="app-container">
      <Navbar /> 

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<h1>404 - Not found</h1>} />

      </Routes>
    </div>
  );
}

export default App;
