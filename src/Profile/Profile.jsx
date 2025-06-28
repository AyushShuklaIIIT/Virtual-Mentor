import React, { useEffect, useRef } from 'react';
import './profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faCheck,
  faCheckCircle,
  faCommentAlt,
  faFire,
  faGem,
  faMedal,
  faMoon,
  faPencilAlt,
  faPlus,
  faStar,
  faSun,
  faTasks,
  faUserPlus,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const BADGES = [
  {
    name: 'Early Bird',
    level: 3,
    icon: faSun,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-500'
  },
  {
    name: 'Taskmaster',
    level: 5,
    icon: faTasks,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500'
  },
  {
    name: 'Focus Champ',
    level: 4,
    icon: faBullseye,
    color: 'bg-purple-100',
    iconColor: 'text-purple-500'
  },
  {
    name: 'Team Player',
    level: 3,
    icon: faUsers,
    color: 'bg-green-100',
    iconColor: 'text-green-500'
  },
  {
    name: 'Perfectionist',
    level: 2,
    icon: faGem,
    color: 'bg-red-100',
    iconColor: 'text-red-500'
  },
  {
    name: 'Night Owl',
    level: 1,
    icon: faMoon,
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-500'
  },
  {
    name: 'Weekend Warrior',
    level: 3,
    icon: faMedal,
    color: 'bg-orange-100',
    iconColor: 'text-orange-500'
  }
];

const PRODUCTIVITY_STATS = [
  {
    label: 'Tasks Completed',
    value: 248,
    icon: faCheckCircle,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-600',
    stat: '+12 this week'
  },
  {
    label: 'Longest Streak',
    value: '21 days',
    icon: faFire,
    color: 'bg-green-100',
    iconColor: 'text-green-500',
    textColor: 'text-green-600',
    stat: 'Current: 14 days'
  },
  {
    label: 'Goals in Progress',
    value: 3,
    icon: faBullseye,
    color: 'bg-purple-100',
    iconColor: 'text-purple-500',
    textColor: 'text-purple-600',
    stat: '75% average completion'
  }
];

const RECENT_ACTIVITY = [
  {
    section: 'Today',
    items: [
      {
        icon: faCheck,
        iconColor: 'bg-green-100 text-green-500',
        title: 'Completed Task: "Finalize Q3 report"',
        desc: 'Completed the quarterly report ahead of schedule',
        time: '2:45 PM'
      },
      {
        icon: faPlus,
        iconColor: 'bg-green-100 text-blue-500',
        title: 'Created task: "Prepare presentation slides"',
        desc: 'Due tomorrow at 10:00 AM',
        time: '11:20 AM'
      }
    ]
  },
  {
    section: 'Yesterday',
    items: [
      {
        icon: faStar,
        iconColor: 'bg-purple-100 text-purple-500',
        title: 'Earned badge: "Focus Champion Level 4"',
        desc: 'Completed 20 focused work sessions this week',
        time: '4:15 PM'
      },
      {
        icon: faCheck,
        iconColor: 'bg-green-100 text-green-500',
        title: 'Completed task: "Client meeting notes"',
        desc: 'Shared with 3 team members',
        time: '2:30 PM'
      },
      {
        icon: faPencilAlt,
        iconColor: 'bg-yellow-100 text-yellow-500',
        title: 'Updated goal: "Learn advanced Excel functions"',
        desc: 'Progress: 75% complete',
        time: '10:15 AM'
      }
    ]
  },
  {
    section: 'Earlier This Week',
    items: [
      {
        icon: faUsers,
        iconColor: 'bg-indigo-100 text-indigo-500',
        title: 'Started collaboration with Alex Chen',
        desc: 'Project: Marketing Campaign Analysis',
        time: 'Monday'
      },
      {
        icon: faCheck,
        iconColor: 'bg-green-100 text-green-500',
        title: 'Completed Task: "Weekly team report"',
        desc: 'Received positive feedback from manager',
        time: 'Monday'
      }
    ]
  }
];


function useFadeInAnimation() {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
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
}

function useHorizontalScroll(ref) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onWheel = (e) => {
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    };
    node.addEventListener('wheel', onWheel);
    return () => node.removeEventListener('wheel', onWheel);
  }, [ref]);
}

const Badge = React.memo(function Badge({ name, level, icon, color, iconColor }) {
  return (
    <div className='badge flex flex-col items-center min-w-[100px]'>
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-2`}>
        <FontAwesomeIcon icon={icon} className={`${iconColor} text-xl`} />
      </div>
      <span className='text-gray-800 font-medium text-sm text-center'>{name}</span>
      <span className='text-gray-500 text-xs text-center'>Level {level}</span>
    </div>
  );
});

const StatCard = React.memo(function StatCard({ label, value, icon, color, iconColor, textColor, stat }) {
  return (
    <div className={`card p-5 ${color.replace('100', '50')} stat-card`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className={`${textColor} font-medium`}>{label}</p>
          <h3 className='text-3xl font-bold text-gray-800 mt-1'>{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className={`${iconColor} text-xl`} />
        </div>
      </div>
      <p className='text-gray-600 text-sm mt-2'>{stat}</p>
    </div>
  );
});

const ActivityItem = React.memo(function ActivityItem({ icon, iconColor, title, desc, time }) {
  return (
    <div className='activity-item pl-10 relative'>
      <div className={`activity-icon absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${iconColor.split(' ').slice(0,1).join(' ')} ${iconColor.split(' ').slice(1).join(' ')}`}>
        <FontAwesomeIcon icon={icon} className={iconColor.split(' ').slice(1).join(' ')} />
      </div>
      <div className='card p-4 bg-gray-50'>
        <div className='flex justify-between items-start'>
          <div>
            <h4 className='text-gray-800 font-medium'>{title}</h4>
            <p className='text-gray-600 text-sm mt-1'>{desc}</p>
          </div>
          <span className='text-gray-500 text-xs'>{time}</span>
        </div>
      </div>
    </div>
  );
});

const Profile = () => {
  const scrollRef = useRef(null);

  useFadeInAnimation();
  useHorizontalScroll(scrollRef);

  return (
    <div className='profile-bg'>
      <div className='min-h-screen flex flex-col'>
        {/* Top Navigation Bar */}
        <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
          <div className='flex justify-between items-center'>
            {/* Logo and App Name */}
            <div className='flex items-center'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center mr-3'>
                <img src="/logo-1.png" alt="Virtual Mentor Logo" className='w-10 h-10' />
              </div>
              <h1 className='text-xl font-semibold text-gray-800 hidden md:block'>Virtual Mentor</h1>
            </div>
            {/* Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              <NavLink to="/dashboard" className='text-gray-600 hover:text-gray-900'>Dashboard</NavLink>
              <NavLink to="/tasks" className='text-gray-600 hover:text-gray-900'>Tasks</NavLink>
              <NavLink to="/calendar" className='text-gray-600 hover:text-gray-900'>Calendar</NavLink>
              <NavLink to="/insights" className='text-gray-600 hover:text-gray-900'>Insights</NavLink>
              <NavLink to="/settings" className='text-gray-600 hover:text-gray-900'>Settings</NavLink>
            </nav>
          </div>
        </header>
        {/* Main Content */}
        <main className='flex-grow p-4 md:p-6'>
          <div className='max-w-4xl mx-auto profile-container'>
            {/* Top Section - User Profile */}
            <div className='card p-6 mb-6 fade-in'>
              <div className='flex flex-col md:flex-row'>
                {/* Profile Picture and Basic Info */}
                <div className='flex flex-col items-center md:items-start md:flex-row mb-6 md:mb-0'>
                  <div className='relative'>
                    <div className='w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                      <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className='w-full h-full object-cover' />
                    </div>
                    <div className='absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white'></div>
                  </div>
                  <div className='mt-4 md:mt-0 md:ml-6 text-center md:text-left'>
                    <div className='flex items-center justify-center md:justify-start'>
                      <h1 className='text-2xl font-bold text-gray-800'>Jane Doe</h1>
                      <span className='ml-3 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full'>Admin</span>
                    </div>
                    <p className='text-gray-600 mt-1'>jane.doe@example.com</p>
                    <p className='text-gray-700 font-medium mt-2'>"Focused on deep work!"</p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className='flex flex-col md:ml-auto space-y-3 md:space-x-3'>
                  <button className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center w-full'>
                    <FontAwesomeIcon icon={faCommentAlt} className='mr-2' />
                    <span>Send Message</span>
                  </button>
                  <button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center w-full'>
                    <FontAwesomeIcon icon={faUserPlus} className='mr-2' />
                    <span>Start Collaboration</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Middle Section - Stats and Badges */}
            <div className='mb-6 fade-in'>
              {/* Summary Cards */}
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>Productivity Stats</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                {PRODUCTIVITY_STATS.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
              {/* Badges/Achievements */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-800'>Achievements</h2>
                  <span className='text-purple-600 text-sm font-medium cursor-pointer'>View All</span>
                </div>
                <div
                  className='scroll-container flex space-x-4 overflow-x-auto pb-4'
                  ref={scrollRef}
                >
                  {BADGES.map((badge) => (
                    <Badge key={badge.name} {...badge} />
                  ))}
                </div>
              </div>
            </div>
            {/* Bottom Section - Recent Activity */}
            <div className='card p-6 fade-in'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-semibold text-gray-800'>Recent Activity</h2>
                <div className='flex items-center'>
                  <span className='text-gray-500 text-sm mr-2'>Filter:</span>
                  <select className='text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500'>
                    <option value="all" className='option'>All Activity</option>
                    <option value="tasks" className='option'>Tasks</option>
                    <option value="goals" className='option'>Goals</option>
                    <option value="collaboration" className='option'>Collaboration</option>
                  </select>
                </div>
              </div>
              <div className='space-y-6'>
                {RECENT_ACTIVITY.map((section) => (
                  <div key={section.section}>
                    <h3 className='text-sm font-medium text-gray-500 mb-3'>{section.section}</h3>
                    <div className='space-y-4'>
                      {section.items.map((item, idx) => (
                        <ActivityItem key={item.title + idx} {...item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-6 text-center'>
                <button className='px-4 py-2 text-purple-600 hover:text-purple-800 font-medium transition-colors'>
                  View More Activity
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;