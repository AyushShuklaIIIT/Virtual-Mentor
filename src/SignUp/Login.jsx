import React, { useState } from 'react'
import './signup.css'
import { useNavigate, NavLink } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { email, password } = formData;

    try {
      const response = await fetch('https://hackdemo-backend.onrender.com/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if(!response.ok) {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      console.log("Login successful: ", data);
      setError('');
      setformData({ email: '', password: '' });
      
      // Add a small delay to show success state before navigation
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch(err) {
      console.error('Error: ', err.message);
      setError('Something went wrong. Please try again later.');
      setIsLoading(false);
    }
  }

  return (
    <div className='inter-text bg-signup flex items-center justify-center p-4'>
      <div className='geometric-bg'>
        <div className='geometric-shape' style={{ width: "400px", height: "400px", top: "-100px", left: "-100px" }}></div>
        <div className='geometric-shape' style={{ width: "300px", height: "300px", bottom: "-50px", right: "-50px" }}></div>
        <div className='geometric-shape' style={{ width: "200px", height: "200px", top: "50%", left: "80%" }}></div>
      </div>

      <div className='form-container rounded-2xl p-8 md:p-10 w-full max-w-md mx-auto'>
        <div className='flex justify-center mb-6'>
          <div className='w-16 h-16 bg-indigo-100 shadow-indigo-800 shadow-md/25 rounded-full flex items-center justify-center floating'>
            <img src="/logo-1.png" alt="Virtual Mentor Logo" className='w-12 h-12' />
          </div>
        </div>

        <div className='text-center mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Virtual Mentor</h1>
          <p className='text-gray-600 mt-1'>Your intelligent task companion.</p>
        </div>

        <form id="loginForm" onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className='input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className='input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                placeholder="Enter your password"
              />
            </div>

            <div className='flex justify-end'>
              <a href="#" className='text-sm text-purple-600 hover:text-purple-800 hover:underline'>Forgot Password?</a>
            </div>

            { error && <p className='text-red-500 text-sm bg-red-100 rounded-lg px-4 py-3 outline outline-red-300'>{error}</p> }

            <button 
              type="submit" 
              disabled={isLoading}
              className='login-btn gradient-bg w-full py-3 rounded-lg text-white font-semibold mt-2 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        <div className='text-center mt-8'>
          <p className='text-gray-600'>
            Don't have an account?
            <NavLink to="/signup" className='text-purple-600 font-medium hover:underline'> Sign Up</NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login