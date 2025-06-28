import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: '',
    initials: 'U'
  });
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Function to get initials from name
  const getInitials = useCallback((name) => {
    if (!name || typeof name !== 'string') return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }, []);

  // Fetch user information
  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://hackdemo-backend.onrender.com/api/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User info response:', data);

      // Handle the API response format: { name: "Name", email: "example@gmail.com" }
      if (typeof data?.name === 'string') {
        const name = data.name.trim();
        const email = data.email || '';
        const initials = getInitials(name);
        
        setUserInfo({
          name,
          email,
          initials
        });
      } else {
        console.warn('Unexpected user info response format:', data);
        setUserInfo({
          name: 'User',
          email: '',
          initials: 'U'
        });
      }

    } catch (err) {
      console.error('Error fetching user info:', err);
      setUserInfo({
        name: 'User',
        email: '',
        initials: 'U'
      });
    } finally {
      setLoading(false);
    }
  }, [getInitials]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('https://hackdemo-backend.onrender.com/api/user/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if(!response.ok) {
        alert(data.message || 'Logout failed');
        setIsLoggingOut(false);
        return;
      }

      console.log("Logout successful: ", data);
      
      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Small delay to show the loading state, then navigate
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch(err) {
      console.error('Error: ', err.message);
      alert('Something went wrong. Please try again later.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
        disabled={isLoggingOut}
        title={userInfo.name}
      >
        {isLoggingOut || loading ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-700 text-xs" />
        ) : (
          <span className="text-gray-700 font-medium text-xs">
            {userInfo.initials}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-purple-700 font-medium text-xs">
                  {userInfo.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate" title={userInfo.name}>
                  {userInfo.name}
                </p>
                {userInfo.email && (
                  <p className="text-xs text-gray-500 truncate" title={userInfo.email}>
                    {userInfo.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <NavLink
              to="/profile"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-500" />
              View Profile
            </NavLink>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-3 text-red-500" />
                  Logging out...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-500" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 