import React, { useState, useEffect, useCallback } from 'react'
import Icon from '../SVGs/Icon'
import HomeIcon from '../SVGs/HomeIcon'
import TasksIcon from '../SVGs/TasksIcon'
import CalendarIcon from '../SVGs/CalendarIcon'
import InsightsIcon from '../SVGs/InsightsIcon'
import '../App.css'
import SettingsIcon from '../SVGs/SettingsIcon'
import CrossIcon from '../SVGs/CrossIcon'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'

const Sidebar = ({open, onClose}) => {
    const [userInfo, setUserInfo] = useState({
        name: 'User',
        email: '',
        initials: 'U'
    });
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnlineStatusChange = () => {
          setIsOnline(navigator.onLine);
        };
    
        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);
    
        return () => {
          window.removeEventListener('online', handleOnlineStatusChange);
          window.removeEventListener('offline', handleOnlineStatusChange);
        };
      }, []);

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
            if (data && data.name && typeof data.name === 'string') {
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

    // Load user info on mount
    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    return (
        <aside id='sidebar' className={`bg-white w-64 border-r border-gray-200 h-full flex-shrink-0 flex flex-col z-20 fixed md:relative transform md:translate-x-0 ${open ? 'translate-x-0': '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    <Icon></Icon>
                    <span className='font-bold text-lg text-[#1e293b]'>Task Mentor</span>
                </div>
                <button id='close-sidebar' className='md:hidden text-[#64748b] hover:text-[#334155]' onClick={onClose}>
                    <CrossIcon></CrossIcon>
                </button>
            </div>

            <div className='py-4 flex-1 overflow-y-auto'>
                <nav className='px-4 space-y-1'>
                    <NavLink to="/dashboard" className={(e) => `${e.isActive ? "sidebar-active" : "text-[#475569] hover:bg-gray-50"} flex items-center px-4 py-3 rounded-lg group`}>
                        <HomeIcon></HomeIcon>
                        <span className='font-medium'>Dashboard</span>
                    </NavLink>

                    <NavLink to="/tasks" className={(e) => `${e.isActive ? "sidebar-active" : "text-[#475569] hover:bg-gray-50"} flex items-center px-4 py-3 rounded-lg group`}>
                        <TasksIcon></TasksIcon>
                        <span className='font-medium'>Tasks</span>
                    </NavLink>

                    <NavLink to="/calendar" className={(e) => `${e.isActive ? "sidebar-active" : "text-[#475569] hover:bg-gray-50"} flex items-center px-4 py-3 rounded-lg group`}>
                        <CalendarIcon></CalendarIcon>
                        <span className='font-medium'>Calendar</span>
                    </NavLink>

                    <NavLink to="/ai-suggestions" className={(e) => `${e.isActive ? "sidebar-active" : "text-[#475569] hover:bg-gray-50"} flex items-center px-4 py-3 rounded-lg group`}>
                        <div className='mr-3 flex items-center justify-center'>
                            <FontAwesomeIcon 
                                icon={faLightbulb}
                                className='sidebar-icon w-6 h-6'
                            />
                        </div>
                        <span className='font-medium'>AI Suggestions</span>
                    </NavLink>

                    <NavLink to="/insights" className={(e) => `${e.isActive ? "sidebar-active" : "text-[#475569] hover:bg-gray-50"} flex items-center px-4 py-3 rounded-lg group`}>
                        <InsightsIcon></InsightsIcon>
                        <span className='font-medium'>Insights</span>
                    </NavLink>

                    <NavLink to="/settings" className={(e) => `${e.isActive ? "sidebar-active" : "text-[#475569] hover:bg-gray-50"} flex items-center px-4 py-3 rounded-lg group`}>
                        <SettingsIcon></SettingsIcon>
                        <span className='font-medium'>Settings</span>
                    </NavLink>
                </nav>
            </div>

            <div className='p-4 border-t border-gray-200'>
                <div className='bg-gray-50 rounded-lg p-3'>
                    <div className='flex items-center space-x-3'>
                        <div className='relative'>
                            <div className='w-10 h-10 rounded-full flex items-center justify-center text-[#6627cc] font-medium bg-purple-200'>
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    userInfo.initials
                                )}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className='flex-1 min-w-0'>
                            {loading ? (
                                <>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </>
                            ) : (
                                <>
                                    <p className='font-medium text-sm truncate' title={userInfo.name}>
                                        {userInfo.name}
                                    </p>
                                    <p className='text-xs text-[#64748b] truncate' title={userInfo.email || 'AI-Powered Learner'}>
                                        {userInfo.email || 'AI-Powered Learner'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar