import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    localStorage.removeItem("registerForm");
  }, []); 

  const getSavedFormData = (): FormData => {
    const savedData = localStorage.getItem("registerForm");
    return savedData ? JSON.parse(savedData) : { username: "", email: "", password: "", fullName: "" };
  };

  const [formData, setFormData] = useState<FormData>(getSavedFormData);

  useEffect(() => {
    localStorage.setItem("registerForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      setTimeout(() => {
        localStorage.removeItem("registerForm"); 
        setFormData({ username: "", email: "", password: "", fullName: "" });
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} 

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
