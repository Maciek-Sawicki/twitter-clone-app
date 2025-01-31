import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/slices/authSlice";
import { AppDispatch, RootState } from "./store/store";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const noNavbarRoutes = ["/", "/login", "/register"];
  const is404 = !["/", "/login", "/register", "/dashboard", "/profile"].includes(location.pathname);

  useEffect(() => {
    if (token && !noNavbarRoutes.includes(location.pathname)) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, location.pathname]);

  if (loading) return null; 

  return (
    <div className="app-container">
      {!noNavbarRoutes.includes(location.pathname) && !is404 && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
