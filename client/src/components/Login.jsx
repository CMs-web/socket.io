import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginuser } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "./features/userSlice";
// import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate()  
  const dispatch = useDispatch()
  const { isAuthenticated, userin } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (isAuthenticated) {
      return navigate("/")
    }
  },[isAuthenticated])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginuser({email,password}))
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Login
        </h2>
        <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => handleChange(e)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md  focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              required
              onChange={(e) => handleChange(e)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md  focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold mt-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
