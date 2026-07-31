import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [userInput, setuserInput] = useState({
        Fullname: "",
        Username: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        Gender: "",
    });

    const [loading, setloading] = useState(false);

    const handelInput = (e) => {
        setuserInput({ ...userInput, [e.target.name]: e.target.value });
    };

    const selectGender = (selectedGender) => {
        setuserInput((prev) => ({
            ...prev,
            Gender: selectedGender,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userInput.Password !== userInput.ConfirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setloading(true);
        try {
            const { Fullname, Username, Email, Password, Gender } = userInput;

            const register = await axios.post(
                "/api/auth/register",
                { Fullname, Username, Email, Password, Gender },
                { withCredentials: true }
            );
            const data = register.data;

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
            <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter bg-opacity-30">
                <h1 className="text-3xl font-bold text-center text-gray-300 mb-4">
                    Register <span className="text-gray-950">To Talk Under Me</span>
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="Fullname" className="label p-1">
                            <span className="font-bold text-gray-950 text-sm label-text">Full Name :</span>
                        </label>
                        <input
                            id="Fullname"
                            name="Fullname"
                            type="text"
                            value={userInput.Fullname}
                            onChange={handelInput}
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div>
                        <label htmlFor="Username" className="label p-1">
                            <span className="font-bold text-gray-950 text-sm label-text">Username :</span>
                        </label>
                        <input
                            id="Username"
                            name="Username"
                            type="text"
                            value={userInput.Username}
                            onChange={handelInput}
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div>
                        <label htmlFor="Email" className="label p-1">
                            <span className="font-bold text-gray-950 text-sm label-text">Email :</span>
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
                        <label htmlFor="Password" className="label p-1">
                            <span className="font-bold text-gray-950 text-sm label-text">Password :</span>
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

                    <div>
                        <label htmlFor="ConfirmPassword" className="label p-1">
                            <span className="font-bold text-gray-950 text-sm label-text">Confirm Password :</span>
                        </label>
                        <input
                            id="ConfirmPassword"
                            name="ConfirmPassword"
                            type="password"
                            value={userInput.ConfirmPassword}
                            onChange={handelInput}
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div id='Gender' className='flex gap-4'>
                        <label className="cursor-pointer label flex gap-2">
                            <span className="label-text font-semibold text-gray-950">Male</span>
                            <input
                                type='radio'
                                name="Gender"
                                checked={userInput.Gender === 'male'}
                                onChange={() => selectGender('male')}
                                className='radio radio-info'
                            />
                        </label>

                        <label className="cursor-pointer label flex gap-2">
                            <span className="label-text font-semibold text-gray-950">Female</span>
                            <input
                                type='radio'
                                name="Gender"
                                checked={userInput.Gender === 'female'}
                                onChange={() => selectGender('female')}
                                className='radio radio-info'
                            />
                        </label>

                        <label className="cursor-pointer label flex gap-2">
                            <span className="label-text font-semibold text-gray-950">Other</span>
                            <input
                                type='radio'
                                name="Gender"
                                checked={userInput.Gender === 'other'}
                                onChange={() => selectGender('other')}
                                className='radio radio-info'
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg hover:bg-gray-900 text-white rounded-lg hover:scale-105 disabled:opacity-60"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="pt-2 text-center">
                    <p className="text-sm font-semibold text-gray-800">
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                                Login Koro Bokasoda!!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register