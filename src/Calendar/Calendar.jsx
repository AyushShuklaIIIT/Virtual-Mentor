import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPlus, faChevronLeft, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './calendar.css';
import HamburgerIcon from '../SVGs/HamburgerIcon';
import taskService from '../api/taskService';
import { toast } from 'react-toastify';
import ProfileDropdown from '../Components/ProfileDropdown';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
};

// Extract date portion from ISO string
const getDateString = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
};

// Format time from ISO string
const formatTimeFromISO = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
        console.warn('Error formatting time:', e);
        return '';
    }
};

const Calendar = ({ onOpenSidebar }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Fetch tasks from the API with proper response handling
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await taskService.getAllTasks();
            console.log("Calendar API Response:", response);
            
            // Extract tasks array from the API response
            let tasksArray = [];
            if (Array.isArray(response)) {
                tasksArray = response;
            } else if (response && typeof response === 'object') {
                // Check for the tasks property (from your API format)
                if (Array.isArray(response.tasks)) {
                    tasksArray = response.tasks;
                } else {
                    // Fallback to other common patterns
                    tasksArray = response.data || response.result || [];
                }
            }
            
            console.log("Extracted tasks for calendar:", tasksArray);
            setTasks(tasksArray);
        } catch (error) {
            setError('Failed to fetch tasks. Please try again later.');
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchTasks();
    }, []);

    // Memoize the calendar grid calculation to avoid re-running it on every render
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];

        // Days from the previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay.getDay(); i > 0; i--) {
            const day = prevMonthLastDay - i + 1;
            days.push({ date: new Date(year, month - 1, day), isDifferentMonth: true });
        }

        // Days from the current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isDifferentMonth: false });
        }

        // Days from the next month to fill the grid (usually up to 42 cells)
        const nextMonthDays = 42 - days.length;
        for (let i = 1; i <= nextMonthDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isDifferentMonth: true });
        }
        return days;
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleGoToToday = () => {
        setCurrentDate(new Date());
    };

    const handleOpenModalForNew = (dueDate) => {
        setSelectedDate(dueDate);
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (task) => {
        setSelectedDate(null);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        setSelectedDate(null);
    };

    // Updated to refresh tasks after save operation
    const handleSaveTask = async (taskData) => {
        setModalLoading(true);
        try {
            // Prepare API data with correct property names
            const apiData = {
                title: taskData.title,
                description: taskData.description,
                duedate: taskData.dueDate, // API expects 'duedate' (lowercase)
                priority: taskData.priority,
                tag: taskData.tag
            };
            
            if (taskData.id) {
                // Update existing task
                await taskService.updateTask(taskData.id, apiData);
                toast.success('Task updated successfully');
            } else {
                // Create new task
                await taskService.createTask(apiData);
                toast.success('Task created successfully');
            }
            
            handleCloseModal();
            
            // Refresh the task list from the API
            await fetchTasks();
            
        } catch (error) {
            toast.error('Failed to save task. Please try again.');
            console.error('Error saving task:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setModalLoading(true);
            try {
                // Make the API call
                await taskService.deleteTask(taskId);
                
                toast.success('Task deleted successfully');
                handleCloseModal();
                
                // Refresh the task list from the API
                await fetchTasks();
                
            } catch (error) {
                toast.error('Failed to delete task. Please try again.');
                console.error('Error deleting task:', error);
            } finally {
                setModalLoading(false);
            }
        }
    };

    // Updated to refresh tasks after toggle completion
    const handleToggleCompletion = async (taskId, currentStatus) => {
        try {
            const newCompletionStatus = !currentStatus;
            
            // Use the API's expected property name
            const updateData = {
                is_completed: newCompletionStatus
            };
            
            // Make the API call
            await taskService.updateTask(taskId, updateData);
            
            toast.success(`Task marked as ${newCompletionStatus ? 'completed' : 'pending'}`);
            
            // Refresh the task list from the API
            await fetchTasks();
            
        } catch (error) {
            toast.error('Failed to update task status. Please try again.');
            console.error('Error toggling task completion:', error);
        }
    };

    const todayFormatted = formatDate(new Date());

    // Show loading state
    if (loading && tasks.length === 0) {
        return (
            <div className="flex-1 calendar-body flex items-center justify-center">
                <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-700">Loading calendar...</h3>
                </div>
            </div>
        );
    }
    
    // Show error state
    if (error && tasks.length === 0) {
        return (
            <div className="flex-1 calendar-body flex items-center justify-center">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faTimes} className="text-red-500 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Error Loading Tasks</h3>
                    <p className="text-gray-500 mt-1">{error}</p>
                    <button 
                        onClick={fetchTasks} 
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1 calendar-body min-h-screen flex flex-col overflow-y-auto'>
            <header className='bg-white shadow-sm py-3 px-4 md:px-6 flex justify-between items-center'>
                <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                    <HamburgerIcon />
                </button>
                <button
                    className='btn btn-primary text-white px-4 py-2 rounded-lg font-medium flex items-center'
                    onClick={() => handleOpenModalForNew(formatDate(new Date()))}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className='ml-2'>Add Task</span>
                </button>
                <ProfileDropdown />
            </header>

            {/* --- Calendar Controls --- */}
            <div className='calendar-header p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center'>
                <div className='flex items-center mb-4 md:mb-0'>
                    <button className='p-2 rounded-lg hover:bg-gray-100' onClick={handlePrevMonth}>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-gray-600' />
                    </button>
                    <h2 className='text-xl font-semibold text-gray-800 mx-4'>
                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                    </h2>
                    <button className='p-2 rounded-lg hover:bg-gray-100' onClick={handleNextMonth}>
                        <FontAwesomeIcon icon={faChevronRight} className='text-gray-600' />
                    </button>
                    <button className='ml-4 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100' onClick={handleGoToToday}>
                        Today
                    </button>
                </div>
                
                {/* Loading indicator for when tasks are being refreshed */}
                {loading && tasks.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Updating tasks...
                    </div>
                )}
            </div>

            {/* --- Calendar Grid --- */}
            <div className='flex-grow p-2 md:p-6'>
                <div className='calendar-container rounded-lg overflow-hidden'>
                    <div className='grid grid-cols-7 bg-gray-50 border-b border-gray-200'>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className='calendar-day-name py-2 text-center text-gray-600 font-medium'>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className='grid grid-cols-7'>
                        {calendarDays.map(({ date, isDifferentMonth }) => {
                            const dateStr = formatDate(date);
                            // Updated filtering to handle backend property names
                            const tasksForDay = tasks.filter(t => {
                                if (!t) return false;
                                
                                // Use backend property names (duedate, is_completed)
                                const taskDate = t.duedate ? getDateString(t.duedate) : '';
                                const isCompleted = t.is_completed || false;
                                
                                return taskDate === dateStr && !isCompleted;
                            });
                            
                            const isToday = dateStr === todayFormatted;

                            return (
                                <div
                                    key={dateStr}
                                    className={`calendar-cell p-2 relative ${isDifferentMonth ? 'different-month' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => !isDifferentMonth && handleOpenModalForNew(dateStr)}
                                >
                                    <div className='text-right mb-1'>{date.getDate()}</div>
                                    <div className='tasks-container text-xs space-y-1 overflow-hidden'>
                                        {tasksForDay.map(task => (
                                            <TaskChip key={task.id} task={task} onClick={() => handleOpenModalForEdit(task)} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    task={selectedTask}
                    date={selectedDate}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    onToggleCompletion={handleToggleCompletion}
                    onClose={handleCloseModal}
                    isLoading={modalLoading}
                />
            )}
        </div>
    );
};

// Updated to handle backend property names
const TaskChip = ({ task, onClick }) => {
    // Extract time from ISO date string using backend property name
    const dueDate = task.duedate;
    const timeDisplay = dueDate ? formatTimeFromISO(dueDate) + ' · ' : '';

    return (
        <div
            className={`task-chip priority-${task.priority}`}
            onClick={(e) => {
                e.stopPropagation(); // Prevent opening a new task modal
                onClick();
            }}
        >
            {`${timeDisplay}${task.title}`}
        </div>
    );
};

// Updated to handle backend property names and loading state
const TaskModal = ({ task, date, onSave, onDelete, onToggleCompletion, onClose, isLoading }) => {
    const isEditMode = !!task;
    
    // Initial form state
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        dueDate: date || formatDate(new Date()),
        time: '',
        priority: 'medium',
        tag: 'work',
        completed: false
    });

    // Initialize form when task or date changes - use backend property names
    useEffect(() => {
        if (isEditMode && task) {
            // Parse date and time from duedate for editing
            let dateValue = date || formatDate(new Date());
            let timeValue = '';
            
            // Use backend property name (duedate)
            const dueDateValue = task.duedate;
            
            if (dueDateValue) {
                try {
                    const dueDate = new Date(dueDateValue);
                    dateValue = formatDate(dueDate);
                    
                    // Format time as HH:MM for input
                    const hours = String(dueDate.getHours()).padStart(2, '0');
                    const minutes = String(dueDate.getMinutes()).padStart(2, '0');
                    timeValue = `${hours}:${minutes}`;
                } catch (e) {
                    console.warn('Error parsing date:', dueDateValue, e);
                }
            }
            
            // Use backend property names (is_completed, completed_at)
            const isCompleted = task.is_completed || false;
            const completionTime = task.completed_at;
            
            setFormData({
                id: task.id,
                title: task.title || '',
                description: task.description || '',
                dueDate: dateValue,
                time: timeValue,
                priority: task.priority || 'medium',
                tag: task.tag || 'work',
                completed: isCompleted,
                completedAt: completionTime
            });
        } else {
            setFormData({
                id: '',
                title: '',
                description: '',
                dueDate: date || formatDate(new Date()),
                time: '',
                priority: 'medium',
                tag: 'work',
                completed: false
            });
        }
    }, [task, date, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Please enter a task title');
            return;
        }
        
        // Combine date and time for backend
        const { dueDate, time, ...restData } = formData;
        
        let combinedDueDate = null;
        if (dueDate) {
            try {
                if (time) {
                    // Combine date and time into ISO format
                    const [year, month, day] = dueDate.split('-');
                    const [hours, minutes] = time.split(':');
                    combinedDueDate = new Date(year, month - 1, day, hours, minutes).toISOString();
                } else {
                    // Use only date with default time (beginning of day)
                    const [year, month, day] = dueDate.split('-');
                    combinedDueDate = new Date(year, month - 1, day).toISOString();
                }
            } catch (e) {
                console.warn('Error creating date:', dueDate, time, e);
                // Fallback to just the date string if there's an error
                combinedDueDate = dueDate;
            }
        }
        
        onSave({
            ...restData,
            dueDate: combinedDueDate
        });
    };

    const handleToggle = () => {
        if (isEditMode) {
            // For editing, use the backend property name (is_completed)
            const currentStatus = task.is_completed || false;
            onToggleCompletion(task.id, currentStatus);
        } else {
            setFormData(prev => ({
                ...prev,
                completed: !prev.completed
            }));
        }
    };

    const modalDisplayDate = formData.dueDate ? 
        new Date(formData.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        }) : '';

    return (
        <div className='modal flex items-center justify-center p-4'>
            <div className='modal-content p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {isEditMode ? 'Edit Task' : 'Add Task'} for {modalDisplayDate}
                    </h3>
                    <button 
                        className='text-gray-500 hover:text-gray-700' 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor="taskTitle" className='block text-sm font-medium text-gray-700 mb-1'>Task Title</label>
                        <input 
                            type="text" 
                            id='taskTitle' 
                            name='title' 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100'
                            placeholder='Enter task title'
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="taskDescription" className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                        <textarea 
                            id='taskDescription' 
                            name='description' 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows={3} 
                            disabled={isLoading}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100'
                            placeholder='Enter task description'
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label htmlFor="taskPriority" className='block text-sm font-medium text-gray-700 mb-1'>Priority</label>
                            <select 
                                name="priority" 
                                id="taskPriority" 
                                value={formData.priority} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100'
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taskTag" className='block text-sm font-medium text-gray-700 mb-1'>Tag</label>
                            <select 
                                name="tag" 
                                id="taskTag" 
                                value={formData.tag} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100'
                            >
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="health">Health</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label htmlFor="taskDueDate" className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                            <input 
                                type="date" 
                                name='dueDate' 
                                id='taskDueDate' 
                                value={formData.dueDate} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100'
                            />
                        </div>
                        <div>
                            <label htmlFor="taskTime" className='block text-sm font-medium text-gray-700 mb-1'>Time</label>
                            <input 
                                type="time" 
                                name="time" 
                                id="taskTime" 
                                value={formData.time} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100'
                            />
                        </div>
                    </div>

                    <div className='flex items-center mb-4'>
                        <input 
                            type="checkbox" 
                            id="taskCompleted" 
                            checked={formData.completed} 
                            onChange={handleToggle} 
                            disabled={isLoading}
                            className='mr-2' 
                        />
                        <label htmlFor='taskCompleted' className='text-sm font-medium text-gray-700'>Mark as completed</label>
                        {isEditMode && formData.completed && formData.completedAt && (
                            <span className='ml-4 text-xs text-green-500'>
                                Completed at: {new Date(formData.completedAt).toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className='flex justify-between items-center'>
                        {isEditMode && (
                            <button 
                                type='button' 
                                className='btn px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center' 
                                onClick={() => onDelete(task.id)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                ) : null}
                                Delete
                            </button>
                        )}
                        <button 
                            type='submit' 
                            className='btn btn-primary px-4 py-2 text-white rounded-lg font-medium ml-auto hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                            ) : null}
                            {isLoading ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Calendar;