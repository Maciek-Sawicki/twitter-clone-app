// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUser } from "./store/slices/authSlice";
// import { AppDispatch, RootState } from "./store/store";
// import Navbar from "./components/Navbar";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";
// import PrivateRoute from "./components/PrivateRoute";
// import UserProfile from "./pages/UserProfile";

// const App = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, token } = useSelector((state: RootState) => state.auth);
//   const location = useLocation();

//   const noNavbarRoutes = ["/", "/login", "/register"];
//   const showNavbar = !noNavbarRoutes.includes(location.pathname);
//   const isNoNavbar = noNavbarRoutes.includes(location.pathname) || location.pathname.startsWith("/profile/");
//   const knownRoutes = ["/", "/login", "/register", "/dashboard", "/profile", "/settings"];
//   const is404 = !knownRoutes.some((route) => location.pathname === route || location.pathname.startsWith("/profile/"));

//   useEffect(() => {
//     if (token && showNavbar) {
//       dispatch(fetchUser());
//     }
//   }, [dispatch, token, location.pathname]);

//   if (loading) return null; 

//   return (
//     <div className="app-container">
//       {!isNoNavbar && !is404 && <Navbar />}

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="*" element={<NotFound />} />
//         <Route path="/profile/:username" element={<UserProfile />} />

//         <Route element={<PrivateRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/profile" element={<Profile />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// };

// export default App;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/slices/authSlice";
import { AppDispatch, RootState } from "./store/store";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // 📌 🔥 Ścieżki, na których **NIE MA NAVBARA**
  const noNavbarRoutes = ["/", "/login", "/register"];

  // 📌 🔥 Sprawdzenie, czy navbar ma się wyświetlić
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  // 📌 🔥 Sprawdzenie, czy obecna ścieżka to 404
  const knownRoutes = ["/", "/login", "/register", "/dashboard", "/profile", "/settings"];
  const is404 = !knownRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith("/profile/")
  );

  useEffect(() => {
    if (token && showNavbar) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, location.pathname]);

  if (loading) return null;

  return (
    <div className="app-container">
      {showNavbar && !is404 && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
