import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faCommentAlt,
    faDownload,
    faExclamationTriangle,
    faSlidersH,
    faSyncAlt,
    faTasks,
    faTrashAlt,
    faUser,
    faPlus,
    faMinus
} from '@fortawesome/free-solid-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import './settings.css';
import HamburgerIcon from '../SVGs/HamburgerIcon';
import { NavLink } from 'react-router-dom';
import ProfileDropdown from '../Components/ProfileDropdown';

/** Section Card with collapsible functionality */
const Section = ({ icon, iconClass, title, children, defaultCollapsed = false }) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
        <div className='card p-5 mb-6 fade-in'>
            <button
                type="button"
                className={`section-header flex items-center mb-4 w-full focus:outline-none ${collapsed ? 'collapsed' : ''}`}
                onClick={() => setCollapsed((c) => !c)}
                aria-expanded={!collapsed}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${iconClass}`}>{icon}</div>
                <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
                <FontAwesomeIcon icon={collapsed ? faPlus : faMinus} className={`ml-auto text-gray-400 chevron-icon${collapsed ? ' rotated' : ''}`} />
            </button>
            <div className={`section-content${collapsed ? ' collapsed' : ''}`}>
                {children}
            </div>
        </div>
    );
};

const Settings = ({ onOpenSidebar }) => {
    // Form state for controlled inputs
    const [profilePic, setProfilePic] = useState('https://i.pravatar.cc/150?img=32');
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [currPassword, setCurrPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [defaultView, setDefaultView] = useState('task-list');
    const [defaultPriority, setDefaultPriority] = useState('Low');

    const inputRef = useRef(null);

    // Fade-in animation on scroll
    useEffect(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new window.IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        fadeElements.forEach((el) => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(10px)';
            observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    // Profile picture upload handler
    const handleProfilePicChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Password change handler (mock)
    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (!currPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
            alert('Please fill all password fields correctly.');
            return;
        }
        // TODO: Implement password update logic
        alert('Password updated!');
        setCurrPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    // Delete account (mock)
    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            // TODO: Implement account deletion
            alert('Account deleted.');
        }
    };

    // Sync Now (mock)
    const handleSync = () => {
        // TODO: Implement sync
        alert('Data synced!');
    };

    // Clear Cache (mock)
    const handleClearCache = () => {
        // TODO: Implement cache clearing
        alert('Cache cleared!');
    };

    // Export CSV (mock)
    const handleExportCSV = () => {
        // TODO: Implement data export
        alert('CSV exported!');
    };

    // Feedback (mock)
    const handleFeedback = () => {
        // TODO: Implement feedback logic
        alert('Feedback sent!');
    };

    return (
        <div className='settings-bg'>
            <div className='min-h-screen flex flex-col'>
                {/* Top Navigation Bar */}
                <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                                <HamburgerIcon />
                            </button>
                        </div>
                        <div className='flex items-center'>
                            <ProfileDropdown />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className='flex-grow p-4 md:p-6'>
                    <div className='max-w-3xl mx-auto settings-container'>
                        {/* Page Title */}
                        <div className='flex justify-between items-center mb-6'>
                            <h1 className='text-2xl font-bold text-gray-800'>Settings</h1>
                        </div>

                        {/* Account Settings Section */}
                        <Section
                            icon={<FontAwesomeIcon icon={faUser} className='text-purple-600' />}
                            iconClass="bg-purple-100"
                            title="Account Settings"
                        >
                            {/* Profile Info */}
                            <div className='flex flex-col md:flex-row items-start md:items-center mb-6 pb-6 border-b border-gray-200'>
                                <div
                                    className='profile-upload mb-4 md:mb-0 cursor-pointer'
                                    onClick={() => inputRef.current?.click()}
                                    title="Upload new profile picture"
                                >
                                    <div className='w-20 h-20 rounded-full bg-gray-200 overflow-hidden relative'>
                                        <img src={profilePic} alt="Profile" className='w-full h-full object-cover' />
                                        <div className='upload-overlay absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                                            <FontAwesomeIcon icon={faCamera} className='text-white' />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        className='hidden'
                                        id="profile-pic-upload"
                                        ref={inputRef}
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                    />
                                </div>
                                <div className='md:ml-6 flex-grow w-full'>
                                    <div className='mb-4'>
                                        <label htmlFor="name" className='block text-sm font-medium text-gray-600 mb-1'>Full Name</label>
                                        <input
                                            type="text"
                                            id='name'
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors'
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className='block text-sm font-medium text-gray-600 mb-1'>Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Change */}
                            <form className='mb-6 pb-6 border-b border-gray-200' onSubmit={handlePasswordUpdate} autoComplete="off">
                                <h3 className='text-md font-medium text-gray-800 mb-4'>Change Password</h3>
                                <div className='space-y-4'>
                                    <div>
                                        <label htmlFor="current-password" className='block text-sm font-medium text-gray-600 mb-1'>Current Password</label>
                                        <input
                                            type="password"
                                            id="current-password"
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors'
                                            value={currPassword}
                                            onChange={e => setCurrPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new-password" className='block text-sm font-medium text-gray-600 mb-1'>New Password</label>
                                        <input
                                            type="password"
                                            id="new-password"
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors'
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirm-password" className='block text-sm font-medium text-gray-600 mb-1'>Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirm-password"
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors'
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div className='flex justify-end'>
                                        <button type="submit" className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors btn'>
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Delete Account */}
                            <div>
                                <h3 className='text-md font-medium text-gray-800 mb-4'>Delete Account</h3>
                                <p className='text-gray-600 text-sm mb-4'>Once you delete your account, there is no going back. Please be certain.</p>
                                <button
                                    type="button"
                                    className='px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 font-medium'
                                    onClick={handleDeleteAccount}
                                >
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </Section>

                        {/* Preferences Section */}
                        <Section
                            icon={<FontAwesomeIcon icon={faSlidersH} className='text-blue-600' />}
                            iconClass="bg-blue-100"
                            title="Preferences"
                        >
                            <div className='space-y-6'>
                                {/* Notifications toggle */}
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h3 className='text-md font-medium text-gray-800'>Notifications</h3>
                                        <p className='text-gray-500 text-sm'>Enable push notifications</p>
                                    </div>
                                    <label className='toggle-switch'>
                                        <span className="sr-only">Enable notifications</span>
                                        <input
                                            type="checkbox"
                                            checked={notificationsEnabled}
                                            onChange={() => setNotificationsEnabled((v) => !v)}
                                        />
                                        <span className='toggle-slider'></span>
                                    </label>
                                </div>

                                {/* Default View */}
                                <div>
                                    <h3 className='text-md font-medium text-gray-800 mb-2'>Default View</h3>
                                    <p className='text-gray-500 text-sm mb-3'>Choose which view to show when you open the app</p>
                                    <select
                                        className='custom-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        value={defaultView}
                                        onChange={e => setDefaultView(e.target.value)}
                                    >
                                        <option value="task-list">Task List</option>
                                        <option value="calendar">Calendar</option>
                                        <option value="insights">Insights</option>
                                    </select>
                                </div>
                            </div>
                        </Section>

                        {/* Task Behaviour Section */}
                        <Section
                            icon={<FontAwesomeIcon icon={faTasks} className='text-green-600' />}
                            iconClass="bg-green-100"
                            title="Task Behaviour"
                        >
                            <div className='space-y-6'>
                                {/* Default Priority */}
                                <div>
                                    <h3 className='text-md font-medium text-gray-800 mb-2'>Default Priority</h3>
                                    <p className='text-gray-500 text-sm mb-3'>Set the default priority for new tasks</p>
                                    <div className='space-x-4'>
                                        {['Low', 'Medium', 'High'].map((level) => (
                                            <label className='flex items-center' key={level}>
                                                <input
                                                    type="radio"
                                                    name="priority"
                                                    className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded-full'
                                                    value={level}
                                                    checked={defaultPriority === level}
                                                    onChange={() => setDefaultPriority(level)}
                                                />
                                                <span className='ml-2 text-gray-700'>{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Data & Sync Section */}
                        <Section
                            icon={<FontAwesomeIcon icon={faSyncAlt} className='text-orange-600' />}
                            iconClass="bg-orange-100"
                            title="Data & Sync"
                        >
                            <div className='space-y-6'>
                                {/* Sync Now */}
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                                    <div className='mb-3 md:mb-0'>
                                        <h3 className='text-md font-medium text-gray-800'>Sync Data</h3>
                                        <p className='text-gray-500 text-sm'>Last Synced: Today at 2:45 PM</p>
                                    </div>
                                    <button
                                        type="button"
                                        className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center'
                                        onClick={handleSync}
                                    >
                                        <FontAwesomeIcon icon={faSyncAlt} className='mr-2' />
                                        <span>Sync Now</span>
                                    </button>
                                </div>

                                {/* Offline Cache */}
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                                    <div className='mb-3 md:mb-0'>
                                        <h3 className='text-md font-medium text-gray-800'>Offline Cache</h3>
                                        <p className='text-gray-500 text-sm'>Clear locally stored data (24.5 MB)</p>
                                    </div>
                                    <button
                                        type="button"
                                        className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center'
                                        onClick={handleClearCache}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} className='mr-2' />
                                        <span>Clear Cache</span>
                                    </button>
                                </div>

                                {/* Data Export */}
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                                    <div className='mb-3 md:mb-0'>
                                        <h3 className='text-md font-medium text-gray-800'>Export Data</h3>
                                        <p className='text-gray-500 text-sm'>Download your data as CSV file</p>
                                    </div>
                                    <button
                                        type="button"
                                        className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center'
                                        onClick={handleExportCSV}
                                    >
                                        <FontAwesomeIcon icon={faDownload} className='mr-2' />
                                        <span>Export CSV</span>
                                    </button>
                                </div>
                            </div>
                        </Section>

                        {/* Footer Section */}
                        <div className='py-6 border-t border-gray-200 fade-in'>
                            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
                                <div className='mb-4 md:mb-0'>
                                    <p className='text-gray-500 text-sm'>App Version: 1.0</p>
                                    <p className='text-gray-500 text-sm'>
                                        <FontAwesomeIcon icon={faCopyright} /> 2025 Virtual Mentor
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center'
                                    onClick={handleFeedback}
                                >
                                    <FontAwesomeIcon icon={faCommentAlt} className='mr-2' />
                                    <span>Send Feedback</span>
                                </button>
                            </div>
                            <div className='flex flex-wrap gap-4'>
                                <a href="#" className='text-purple-600 hover:text-purple-800 text-sm'>Terms of Service</a>
                                <a href="#" className='text-purple-600 hover:text-purple-800 text-sm'>Privacy Policy</a>
                                <a href="#" className='text-purple-600 hover:text-purple-800 text-sm'>Help Center</a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;