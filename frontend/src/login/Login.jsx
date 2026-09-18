import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [userInput, setuserInput] = useState({
    Email: "",
    Password: "",
  });

  const [loading, setloading] = useState(false);

  const handelInput = (e) => {
    setuserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const login = await axios.post("/api/auth/login", userInput, { withCredentials: true });
      const data = login.data;

      if (data.success === false) {
        setloading(false);
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      localStorage.setItem('To Talk Under Me', JSON.stringify(data.user));
      setAuthUser(data.user);
      setloading(false);
      navigate('/');
    } catch (error) {
      setloading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter bg-opacity-30">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login <span className="text-gray-950">To Talk Under Me</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="Email" className="label p-1">
              <span className="font-bold text-gray-950 text-xl label-text">Email :</span>
            </label>
            <input
              id="Email"
              name="Email"
              type="email"
              value={userInput.Email}
              onChange={handelInput}
              required
              className="w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label htmlFor="Password" className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Password :</span>
            </label>
            <input
              id="Password"
              name="Password"
              type="password"
              value={userInput.Password}
              onChange={handelInput}
              required
              className="w-full input input-bordered h-10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg hover:bg-gray-900 text-white rounded-lg hover:scale-105"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Why you don't have an Account?{" "}
            <Link to="/register">
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Register Now!!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;