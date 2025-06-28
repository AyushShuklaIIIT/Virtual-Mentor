import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import './team.css'
import Icon from '../SVGs/Icon'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faSearch, faTasks, faTimes, faUser, faUserMinus, faUserPlus, faUserTag } from '@fortawesome/free-solid-svg-icons'

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "admin",
    status: "active",
    img: "https://i.pravatar.cc/150?img=32",
    assigned: 20,
    completed: 18,
    overdue: 0
  },
  {
    id: 2,
    name: "Alex Chen",
    email: "alex.chen@example.com",
    role: "member",
    status: "active",
    img: "https://i.pravatar.cc/150?img=12",
    assigned: 15,
    completed: 12,
    overdue: 1
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    role: "member",
    status: "offline",
    img: "https://i.pravatar.cc/150?img=68",
    assigned: 12,
    completed: 8,
    overdue: 2
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "guest",
    status: "active",
    img: "https://i.pravatar.cc/150?img=25",
    assigned: 5,
    completed: 5,
    overdue: 0
  },
  {
    id: 5,
    name: "Robert Taylor",
    email: "robert.t@example.com",
    role: "admin",
    status: "offline",
    img: "https://i.pravatar.cc/150?img=53",
    assigned: 18,
    completed: 14,
    overdue: 1
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "member",
    status: "active",
    img: "https://i.pravatar.cc/150?img=44",
    assigned: 14,
    completed: 9,
    overdue: 3
  }
];

// Helper for progress calculation
const getProgressWidth = (completed, assigned) =>
  assigned ? `${Math.round((completed / assigned) * 100)}%` : "0%";

const TeamMemberCard = React.memo(function TeamMemberCard({
  member, onDropdown, dropdownOpenId, setDropdownOpenId
}) {
  const cardRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownOpenId === member.id && cardRef.current && !cardRef.current.contains(e.target)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpenId, member.id, setDropdownOpenId]);

  return (
    <div
      className={`card p-5 member-card fade-in`}
      data-role={member.role}
      data-status={member.status}
      ref={cardRef}
    >
      <div className='flex justify-between'>
        <div className='flex items-start'>
          <div className='relative'>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
              <img src={member.img} alt={member.name} className='w-full h-full object-cover' />
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 ${member.status === "active" ? "bg-green-500" : "bg-gray-400"} rounded-full border-2 border-white`}></div>
          </div>
          <div className='ml-3'>
            <div className='flex items-center'>
              <h3 className='font-semibold text-gray-800'>{member.name}</h3>
              <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  member.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : member.role === "guest"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
            </div>
            <p className='text-gray-600 text-sm'>{member.email}</p>
          </div>
        </div>
        <div className='card-actions'>
          <div className='dropdown'>
            <button
              className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
              aria-label="Show options"
              onClick={(e) => {
                e.stopPropagation();
                onDropdown(member.id);
              }}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <div
              className={`dropdown-content${dropdownOpenId === member.id ? " open" : ""}`}
              style={{ display: dropdownOpenId === member.id ? "block" : undefined }}
            >
              <a href="#" className='dropdown-item text-gray-700' onClick={() => setDropdownOpenId(null)}>
                <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-500' />
                <span>View Profile</span>
              </a>
              <a href="#" className='dropdown-item text-gray-700' onClick={() => setDropdownOpenId(null)}>
                <FontAwesomeIcon icon={faTasks} className='mr-3 text-gray-500' />
                <span>Assign Task</span>
              </a>
              <a href="#" className='dropdown-item text-gray-700' onClick={() => setDropdownOpenId(null)}>
                <FontAwesomeIcon icon={faUserTag} className='mr-3 text-gray-500' />
                <span>Change Role</span>
              </a>
              <a href="#" className='dropdown-item text-gray-700' onClick={() => setDropdownOpenId(null)}>
                <FontAwesomeIcon icon={faUserMinus} className='mr-3 text-gray-500' />
                <span>Remove</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Task Summary */}
      <div className='mt-5 pt-4 border-t border-gray-100'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-600'>Tasks</span>
          <span className='text-sm font-medium text-gray-800'>
            {member.completed}/{member.assigned}
          </span>
        </div>
        <div className='progress-bar'>
          <div
            className={`progress-fill ${member.completed === member.assigned ? "bg-green-500" : "bg-blue-500"}`}
            style={{
              width: getProgressWidth(member.completed, member.assigned)
            }}
          ></div>
        </div>
        <div className='mt-4 flex justify-between text-sm'>
          <div>
            <span className='text-gray-500'>Assigned</span>
            <p className='font-medium text-gray-800'>{member.assigned}</p>
          </div>
          <div>
            <span className='text-gray-500'>Completed</span>
            <p className='font-medium text-gray-800'>{member.completed}</p>
          </div>
          <div>
            <span className='text-gray-500'>Overdue</span>
            <p className='font-medium text-gray-800'>{member.overdue}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

function InviteModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setRole('member');
      setMessage('');
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, role, message });
    setEmail('');
    setRole('member');
    setMessage('');
  };

  return (
    <div className='modal active' onClick={onClose}>
      <div className='modal-content card p-6' onClick={e => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-gray-800'>Invite New Member</h2>
          <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors' onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor="invite-email" className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
            <input
              type="email"
              id="invite-email"
              placeholder='colleague@example.com'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="invite-role" className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
            <select
              id="invite-role"
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <div className='mb-6'>
            <label htmlFor="invite-message" className='block text-sm font-medium text-gray-700 mb-1'>Personal Message (Optional)</label>
            <textarea
              id="invite-message"
              rows="3"
              placeholder='Join our team to collaborate on projects...'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              onClick={onClose}
            >Cancel Invitation</button>
            <button type='submit' className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>Send Invitation</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Team = () => {
  // State for invite modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // State for filters and search
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // State for dropdown menus
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // Memoized list of filtered members
  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter(member => {
      const searchTerm = search.trim().toLowerCase();
      const name = member.name.toLowerCase();
      const email = member.email.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        name.includes(searchTerm) ||
        email.includes(searchTerm);
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  // Handle body scroll lock for modal
  useEffect(() => {
    if (inviteModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [inviteModalOpen]);

  // Fade-in animation (keep for progressive reveal)
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 100);
    });
  }, []);

  // Handle invite form submission
  const handleInvite = useCallback(({ email, role }) => {
    alert(`Invitation sent to ${email} for role: ${role}`);
    setInviteModalOpen(false);
  }, []);

  return (
    <div className='team-bg'>
      <div className='min-h-screen flex flex-col'>
        {/* Top Navigation Bar */}
        <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
          <div className='flex justify-between items-center'>
            {/* Logo and App Name */}
            <div className='flex items-center'>
              <div className='w-10 h-10 flex items-center justify-center mr-3'>
                <Icon />
              </div>
              <h1 className='text-xl font-semibold text-gray-800 hidden md:block'>Virtual Mentor</h1>
            </div>
            {/* Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              <NavLink to="/dashboard" className='text-gray-600 hover:text-gray-900'>Dashboard</NavLink>
              <NavLink to="/calendar" className='text-gray-600 hover:text-gray-900'>Calendar</NavLink>
              <NavLink to="/tasks" className='text-gray-600 hover:text-gray-900'>Tasks</NavLink>
              <NavLink to="/insights" className='text-gray-600 hover:text-gray-900'>Insights</NavLink>
              <NavLink to="/settings" className='text-gray-600 hover:text-gray-900'>Settings</NavLink>
            </nav>

            {/* Profile */}
            <div className='flex items-center space-x-4'>
              <NavLink to="/profile" className='w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer'>
                <span className='text-gray-700 font-medium'>JD</span>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-grow p-4 md:p-6'>
          <div className='max-w-6xl mx-auto team-container'>
            {/* Page Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 fade-in'>
              <h1 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>Team Management</h1>
              <button
                className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center'
                onClick={() => setInviteModalOpen(true)}
              >
                <FontAwesomeIcon icon={faUserPlus} className='mr-2' />
                <span>Invite New Member</span>
              </button>
            </div>

            {/* Filters and Search */}
            <div className='card p-4 mb-6 fade-in'>
              <div className='flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4'>
                {/* Search Bar */}
                <div className='relative flex-grow'>
                  <input
                    type="text"
                    id='search-input'
                    placeholder='Search team members...'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
                {/* Role Filter */}
                <div className='w-full md:w-48'>
                  <select
                    id="role-filter"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
                {/* Status Filter */}
                <div className='w-full md:w-48'>
                  <select
                    id="status-filter"
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
              {filteredMembers.length === 0 ? (
                <div className='col-span-full text-center py-10' id='no-results'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
                    <FontAwesomeIcon icon={faSearch} className='text-gray-400 text-xl' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-800 mb-1'>No team members found</h3>
                  <p className='text-gray-600'>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredMembers.map(member => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    dropdownOpenId={dropdownOpenId}
                    setDropdownOpenId={setDropdownOpenId}
                    onDropdown={id => setDropdownOpenId(dropdownOpenId === id ? null : id)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
      <InviteModal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} onSubmit={handleInvite} />
    </div>
  );
};

export default Team;