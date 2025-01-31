// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { registerUser } from '../store/slices/authSlice';
// import { AppDispatch } from '../store/store';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await dispatch(registerUser({ username, email, password, fullName }));
//     navigate('/login');
//   };

//   return (
//     <div className="auth-container">
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Full name" onChange={(e) => setFullName(e.target.value)} required />
//         <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
//         <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Register</button>
//       </form>
//       <div className="navigate-container">
//         <p>Already have an account?</p>
//         <button onClick={() => navigate('/login')}>Log in</button>
//       </div>
//     </div>
//   );
// };

// export default Register;


// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../store/slices/authSlice";
// import { AppDispatch, RootState } from "../store/store";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state: RootState) => state.auth);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     fullName: "",
//   });

//   const [successMessage, setSuccessMessage] = useState(""); 

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccessMessage(""); 

//     const result = await dispatch(registerUser(formData));

//     if (registerUser.fulfilled.match(result)) {
//       setSuccessMessage("Registration completed successfully!"); 

//       setTimeout(() => {
//         setFormData({ username: "", email: "", password: "", fullName: "" });
//         navigate("/login");
//       }, 1500);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Register</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} 

//       <form onSubmit={handleSubmit}>
//       <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username} 
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="fullName"
//           placeholder="Full name"
//           value={formData.fullName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required/>
//         <button type="submit" disabled={loading}>{loading ? "Registration..." : "Register"}</button>
//       </form>
//     </div>
//   );
// };

// export default Register;

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../store/slices/authSlice";
// import { AppDispatch, RootState } from "../store/store";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state: RootState) => state.auth);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     fullName: "",
//   });

//   const [successMessage, setSuccessMessage] = useState(""); 

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSuccessMessage(""); 

//     const result = await dispatch(registerUser(formData));

//     if (registerUser.fulfilled.match(result)) {
//       setSuccessMessage("Registration completed successfully!"); 

//       // ✅ Czyszczenie formularza **TYLKO w przypadku sukcesu**
//       setTimeout(() => {
//         setFormData({ username: "", email: "", password: "", fullName: "" });
//         navigate("/login");
//       }, 1500);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Register</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} 

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username} 
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="fullName"
//           placeholder="Full name"
//           value={formData.fullName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      setTimeout(() => {
        setFormData({ username: "", email: "", password: "", fullName: "" }); // ✅ Czyści formularz TYLKO po sukcesie
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} 

      <form onSubmit={handleSubmit} noValidate> {/* ✅ Wyłączamy standardowe dymki */}
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

