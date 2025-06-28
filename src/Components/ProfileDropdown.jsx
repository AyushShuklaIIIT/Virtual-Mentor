import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
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
        return;
      }

      console.log("Logout successful: ", data);
      navigate('/');
    } catch(err) {
      console.error('Error: ', err.message);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
      >
        <span className="text-gray-700 font-medium">JD</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <NavLink
            to="/profile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-500" />
            View Profile
          </NavLink>
          
          <hr className="my-1 border-gray-200" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-500" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;