import React, { useState } from 'react'
import './signup.css'
import Fig1 from '../SVGs/Fig1'
import PhoneIcon from '../SVGs/PhoneIcon'
import RobotIcon from '../SVGs/RobotIcon'
import ClockIcon from './ClockIcon'
import { useNavigate, NavLink } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setformData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, password, confirmPassword } = formData;

        if(password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('https://hackdemo-backend.onrender.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: fullName,
                    email,
                    password,
                }),
            });

            const data = await res.json();
            if(!res.ok) {
                setError(data.message || 'Signup failed');
                return;
            }

            console.log('User registered: ', data);
            setError('');
            setformData({fullName: '', email: '', password: '', confirmPassword: ''});
            navigate('/login');
        } catch (err) {
            console.error('Error during signup: ', err);
            setError('Something went wrong. Please try again.');
        }
    }

    return (
        <div className='inter-text flex items-center justify-center p-4 bg-signup'>
            <div className='geometric-bg'>
                <div className='geometric-shape' style={{ width: "400px", height: "400px", top: "-100px", left: "-100px" }}></div>
                <div className='geometric-shape' style={{ width: "300px", height: "300px", bottom: "-50px", right: "-50px" }}></div>
                <div className='geometric-shape' style={{ width: "200px", height: "200px", top: "50%", left: "80%" }}></div>
            </div>

            <div className='form-container relative rounded-2xl p-8 md:p-10 w-full max-w-md mx-auto'>
                <div className='flex justify-center mb-6'>
                    <div className='w-16 h-16 bg-indigo-100 shadow-indigo-800 shadow-md/25 rounded-full flex items-center justify-center floating'>
                        <Fig1></Fig1>
                    </div>
                </div>

                <h1 className='text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6'>Create your Virtual Mentor account</h1>

                <form id='signupForm' onSubmit={handleSubmit}>
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor="fullName" className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                            <input type="text" id='fullName' name='fullName' value={formData.fullName} onChange={handleChange} required className='input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none' placeholder='Enter your full name' />
                        </div>

                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                            <input type="email" id='email' name='email' value={formData.email} onChange={handleChange} required className='input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none' placeholder='Enter your email' />
                        </div>

                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                            <input type="password" id='password' name='password' value={formData.password} onChange={handleChange} required className='input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none' placeholder='Create a password' />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700 mb-1'>Confirm Password</label>
                            <input type="password" id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} required className='input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none' placeholder='Confirm your password' />
                        </div>

                        { error && <p className='text-red-500 text-sm bg-red-100 rounded-lg px-4 py-3 outline outline-red-300'>{error}</p> }

                        <button type='submit' className='signup-btn gradient-bg w-full py-3 rounded-lg text-white font-semibold mt-6 focus:outline-none'>Sign Up</button>

                        <div className='text-center mt-4'>
                            <p className='text-gray-600'>
                                Already have an account?
                                <NavLink to="/login" className='text-purple-600 font-medium hover:underline'> Sign in</NavLink>
                            </p>
                        </div>
                    </div>
                </form>

                <div className='mt-12 flex justify-center space-x-8'>
                    <div className='feature-icon text-center'>
                        <div className='w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2'>
                            <PhoneIcon></PhoneIcon>
                        </div>
                        <p className='text-xs text-gray-600'>Offline Access</p>
                    </div>

                    <div className='feature-icon text-center'>
                        <div className='w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2'>
                            <RobotIcon></RobotIcon>
                        </div>
                        <p className='text-xs text-gray-600'>AI Assistance</p>
                    </div>

                    <div className='feature-icon text-center'>
                        <div className='w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2'>
                            <ClockIcon></ClockIcon>
                        </div>
                        <p className='text-xs text-gray-600'>Pomodoro Timer</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup