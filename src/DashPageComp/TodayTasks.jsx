import React, { useEffect, useState, useCallback } from 'react'
import '../App.css'
import EditIcon from '../SVGs/EditIcon'
import TrashIcon from '../SVGs/TrashIcon'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import taskService from '../api/taskService'
import { toast } from 'react-toastify'

const TodayTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [operationLoading, setOperationLoading] = useState(null);
    const [error, setError] = useState(null);

    // Fetch tasks from the API and filter for today
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await taskService.getAllTasks();
            
            // Extract tasks array from the API response
            let allTasks = [];
            if (Array.isArray(response)) {
                allTasks = response;
            } else if (response && typeof response === 'object') {
                if (Array.isArray(response.tasks)) {
                    allTasks = response.tasks;
                } else {
                    allTasks = response.data || response.result || [];
                }
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayTasks = allTasks.filter(task => {
                if (!task) return false;
                
                const dueDateValue = task.duedate;
                if (!dueDateValue) return false;
                
                try {
                    const due = new Date(dueDateValue);
                    due.setHours(0, 0, 0, 0);
                    return due.getTime() === today.getTime();
                } catch (e) {
                    console.warn('Error parsing due date:', dueDateValue, e);
                    return false;
                }
            });

            // Sort by time if available
            todayTasks.sort((a, b) => {
                const aDate = a.duedate;
                const bDate = b.duedate;
                
                if (!aDate && !bDate) return 0;
                if (!aDate) return 1;
                if (!bDate) return -1;
                
                return new Date(aDate) - new Date(bDate);
            });

            setTasks(todayTasks);
        } catch (error) {
            setError('Failed to fetch tasks. Please try again later.');
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load today\'s tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load today's tasks
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // FIXED: Toggle completion using the correct endpoint
    const handleToggleComplete = async (task) => {
        setOperationLoading(`toggle-${task.id}`);
        try {
            const currentStatus = task.is_completed;
            const newCompletionStatus = !currentStatus;
            
            console.log(`🔄 Toggling task ${task.id}: ${currentStatus} -> ${newCompletionStatus}`);
            
            // Use the toggleTaskCompletion method which uses the correct endpoint
            await taskService.toggleTaskCompletion(task.id, newCompletionStatus);
            
            toast.success(`Task marked as ${newCompletionStatus ? 'completed' : 'pending'}`);
            
            // Refresh the task list from the API
            await fetchTasks();
            
        } catch (error) {
            console.error('❌ Toggle error:', error);
            toast.error('Failed to update task status');
        } finally {
            setOperationLoading(null);
        }
    };

    // Delete task
    const handleDelete = async (task) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        setOperationLoading(`delete-${task.id}`);
        try {
            await taskService.deleteTask(task.id);
            toast.success('Task deleted successfully');
            await fetchTasks();
        } catch (error) {
            console.error('❌ Delete error:', error);
            toast.error('Failed to delete task');
        } finally {
            setOperationLoading(null);
        }
    };

    // Start editing
    const handleStartEdit = (task) => {
        setEditingTaskId(task.id);
        setEditValue(task.title || '');
    };

    // FIXED: Save edit with minimal data to avoid backend issues
    const handleSaveEdit = async (task) => {
        const trimmed = editValue.trim();
        if (trimmed.length === 0) {
            handleCancelEdit();
            return;
        }
        
        setOperationLoading(`edit-${task.id}`);
        try {
            // Send only the fields that are being updated to minimize backend issues
            const updateData = {
                title: trimmed,
                // Include existing data to prevent backend from nullifying other fields
                description: task.description || '',
                priority: task.priority || 'medium',
                tag: task.tag || 'work',
                duedate: task.duedate
            };
            
            console.log('📤 Updating task with data:', updateData);
            
            await taskService.updateTask(task.id, updateData);
            
            toast.success('Task updated successfully');
            
            // Clear editing state
            setEditingTaskId(null);
            setEditValue('');
            
            // Refresh the task list from the API
            await fetchTasks();
            
        } catch (error) {
            console.error('❌ Edit error:', error);
            
            // Check if it's a 500 error and provide better feedback
            if (error.message.includes('Internal server error')) {
                toast.error('Backend error - unable to update task. Please try again later.');
            } else {
                toast.error('Failed to update task');
            }
            
            // Clear editing state on error
            setEditingTaskId(null);
            setEditValue('');
        } finally {
            setOperationLoading(null);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditValue('');
    };

    // For Enter key in edit field
    const handleEditInputKeyDown = (e, task) => {
        if (e.key === 'Enter') handleSaveEdit(task);
        if (e.key === 'Escape') handleCancelEdit();
    };

    // Format time from ISO date string
    const formatTime = (isoDateString) => {
        if (!isoDateString) return '--';
        
        try {
            const date = new Date(isoDateString);
            const hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            
            return `${hour12}:${minutes} ${ampm}`;
        } catch (e) {
            console.warn('Error formatting time:', isoDateString, e);
            return '--';
        }
    };

    // Show loading state
    if (loading && tasks.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Today's Tasks</h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading tasks...</p>
                </div>
            </div>
        );
    }
    
    // Show error state
    if (error && tasks.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Today's Tasks</h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-10 h-10 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                    </div>
                    <p className="text-gray-500 mb-2">{error}</p>
                    <button 
                        onClick={fetchTasks}
                        className="text-purple-600 hover:text-purple-800 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
                <h3 className='font-semibold text-lg'>Today's Tasks</h3>
                {loading && tasks.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Updating...
                    </div>
                )}
            </div>

            <div className='space-y-3'>
                {tasks.length === 0 ? (
                    <div className='text-gray-400 text-center py-8'>No tasks scheduled for today 🎉</div>
                ) : (
                    tasks.map((task, idx) => (
                        <div
                            className='task-item flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                            key={task.id || idx}
                        >
                            <div className='flex items-center'>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className='w-5 h-5 rounded border-gray-300 text-[#7738ea] focus:ring-[#8a5cf5] mr-3'
                                        checked={task.is_completed || false}
                                        onChange={() => handleToggleComplete(task)}
                                        disabled={operationLoading === `toggle-${task.id}`}
                                    />
                                    {operationLoading === `toggle-${task.id}` && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FontAwesomeIcon 
                                                icon={faSpinner} 
                                                className="animate-spin text-purple-600 text-xs"
                                            />
                                        </div>
                                    )}
                                </div>
                                {editingTaskId === task.id ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editValue}
                                            autoFocus
                                            className="border-b border-[#7738ea] bg-transparent focus:outline-none text-gray-800 text-base pr-6"
                                            onChange={e => setEditValue(e.target.value)}
                                            onBlur={() => handleSaveEdit(task)}
                                            onKeyDown={e => handleEditInputKeyDown(e, task)}
                                            style={{ maxWidth: 200 }}
                                            disabled={operationLoading === `edit-${task.id}`}
                                        />
                                        {operationLoading === `edit-${task.id}` && (
                                            <FontAwesomeIcon 
                                                icon={faSpinner} 
                                                className="animate-spin text-purple-600 text-xs absolute right-0 top-1"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <span className={task.is_completed ? 'line-through text-gray-400' : ''}>
                                        {task.title || 'Untitled task'}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center'>
                                <span className='text-[#64748b] text-sm mr-4'>
                                    {formatTime(task.duedate)}
                                </span>
                                <div className='task-actions'>
                                    <button
                                        className='text-[#94a3b8] hover:text-[#475569] p-1 disabled:opacity-50'
                                        onClick={() => handleStartEdit(task)}
                                        aria-label="Edit task"
                                        disabled={editingTaskId === task.id || operationLoading === `edit-${task.id}`}
                                    >
                                        {operationLoading === `edit-${task.id}` ? (
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                        ) : (
                                            <EditIcon />
                                        )}
                                    </button>
                                    <button
                                        className='text-[#94a3b8] hover:text-[#475569] p-1 disabled:opacity-50'
                                        onClick={() => handleDelete(task)}
                                        aria-label="Delete task"
                                        disabled={operationLoading === `delete-${task.id}`}
                                    >
                                        {operationLoading === `delete-${task.id}` ? (
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                        ) : (
                                            <TrashIcon />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className='mt-4 text-center'>
                <NavLink to="/tasks" className='text-[#7738ea] hover:text-[#6627cc] text-sm font-medium'>View All Tasks</NavLink>
            </div>
        </div>
    );
};

export default TodayTasks;