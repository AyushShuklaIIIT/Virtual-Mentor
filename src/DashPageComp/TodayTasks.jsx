import React, { useEffect, useState, useCallback } from 'react'
import '../App.css'
import EditIcon from '../SVGs/EditIcon'
import TrashIcon from '../SVGs/TrashIcon'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import taskService from '../api/taskService'
import { toast } from 'react-toastify'

const TodayTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(false);
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
                // Check for the tasks property (from your API format)
                if (Array.isArray(response.tasks)) {
                    allTasks = response.tasks;
                } else {
                    // Fallback to other common patterns
                    allTasks = response.data || response.result || [];
                }
            }
            
            console.log("Today's tasks API response:", response);
            console.log("Extracted tasks array:", allTasks);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayTasks = allTasks.filter(task => {
                if (!task) return false;
                
                // Handle different property names (duedate from API vs dueDate in code)
                const dueDateValue = task.duedate || task.dueDate;
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
                const aDate = a.duedate || a.dueDate;
                const bDate = b.duedate || b.dueDate;
                
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

    // Toggle completion
    const handleToggleComplete = async (task) => {
        try {
            // Handle different property names (is_completed from API vs completed in code)
            const currentStatus = task.is_completed || task.completed;
            const newCompletionStatus = !currentStatus;
            
            // Optimistic update - update UI before API call completes
            setTasks(prevTasks => prevTasks.map(t => {
                if (t.id === task.id) {
                    return {
                        ...t,
                        // Update both property versions to ensure consistent UI
                        is_completed: newCompletionStatus,
                        completed: newCompletionStatus,
                        completed_at: newCompletionStatus ? new Date().toISOString() : null,
                        completedAt: newCompletionStatus ? new Date().toISOString() : null
                    };
                }
                return t;
            }));
            
            // Prepare data for API with the correct property names
            const updateData = {
                is_completed: newCompletionStatus
            };
            
            // Make the API call
            await taskService.updateTask(task.id, updateData);
            
            toast.success(`Task marked as ${newCompletionStatus ? 'completed' : 'pending'}`);
        } catch (error) {
            // Revert the optimistic update if the API call fails
            fetchTasks();
            toast.error('Failed to update task status');
            console.error('Error toggling task completion:', error);
        }
    };

    // Delete task
    const handleDelete = async (task) => {
        try {
            // Optimistic update - remove from UI before API call completes
            setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
            
            // Make the API call
            await taskService.deleteTask(task.id);
            
            toast.success('Task deleted successfully');
        } catch (error) {
            // Revert the optimistic update if the API call fails
            fetchTasks();
            toast.error('Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    // Start editing
    const handleStartEdit = (task) => {
        setEditingTaskId(task.id);
        setEditValue(task.title || '');
    };

    // Save edit
    const handleSaveEdit = async (task) => {
        const trimmed = editValue.trim();
        if (trimmed.length === 0) return;
        
        try {
            // Create update data with just the title field and preserve existing properties
            const updateData = {
                title: trimmed
            };
            
            // Optimistic update - update UI before API call completes
            setTasks(prevTasks => prevTasks.map(t => {
                if (t.id === task.id) {
                    return { ...t, title: trimmed };
                }
                return t;
            }));
            
            // Make the API call
            await taskService.updateTask(task.id, updateData);
            
            setEditingTaskId(null);
            setEditValue('');
            toast.success('Task updated successfully');
        } catch (error) {
            // Revert the optimistic update if the API call fails
            fetchTasks();
            toast.error('Failed to update task');
            console.error('Error updating task:', error);
            
            setEditingTaskId(null);
            setEditValue('');
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
                                <input
                                    type="checkbox"
                                    className='w-5 h-5 rounded border-gray-300 text-[#7738ea] focus:ring-[#8a5cf5] mr-3'
                                    // Handle both property names
                                    checked={!!(task.is_completed || task.completed)}
                                    onChange={() => handleToggleComplete(task)}
                                />
                                {editingTaskId === task.id ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        autoFocus
                                        className="border-b border-[#7738ea] bg-transparent focus:outline-none text-gray-800 text-base"
                                        onChange={e => setEditValue(e.target.value)}
                                        onBlur={() => handleSaveEdit(task)}
                                        onKeyDown={e => handleEditInputKeyDown(e, task)}
                                        style={{ maxWidth: 200 }}
                                    />
                                ) : (
                                    <span className={(task.is_completed || task.completed) ? 'line-through text-gray-400' : ''}>
                                        {task.title || 'Untitled task'}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center'>
                                <span className='text-[#64748b] text-sm mr-4'>
                                    {formatTime(task.duedate || task.dueDate)}
                                </span>
                                <div className='task-actions'>
                                    <button
                                        className='text-[#94a3b8] hover:text-[#475569] p-1'
                                        onClick={() => handleStartEdit(task)}
                                        aria-label="Edit task"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        className='text-[#94a3b8] hover:text-[#475569] p-1'
                                        onClick={() => handleDelete(task)}
                                        aria-label="Delete task"
                                    >
                                        <TrashIcon />
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