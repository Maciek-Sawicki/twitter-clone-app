import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.fullName}!</h1>
      <p>This is your dashboard.</p>

      <div className="button-group">
        <Link to="/profile" className="primary-btn">Go to Profile</Link>
        <button onClick={handleLogout} className="secondary-btn">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
