import React, { useEffect, useState } from 'react'
import '../App.css'
import EditIcon from '../SVGs/EditIcon'
import TrashIcon from '../SVGs/TrashIcon'
import { NavLink } from 'react-router-dom'

const LOCAL_STORAGE_KEY = 'virtualMentorTasks';

const TodayTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Load today's tasks
    useEffect(() => {
        loadTodayTasks();
    }, []);

    function loadTodayTasks() {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let allTasks = [];
        if (stored) {
            try {
                allTasks = JSON.parse(stored);
            } catch {
                allTasks = [];
            }
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTasks = allTasks.filter(task => {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            return due.getTime() === today.getTime();
        });

        // Sort by time if available
        todayTasks.sort((a, b) => {
            if (!a.time && !b.time) return 0;
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
        });

        setTasks(todayTasks);
    }

    // Toggle completion
    function handleToggleComplete(task) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let allTasks = [];
        if (stored) {
            try {
                allTasks = JSON.parse(stored);
            } catch {
                allTasks = [];
            }
        }
        const idx = allTasks.findIndex(t => t.id === task.id);
        if (idx !== -1) {
            allTasks[idx].completed = !allTasks[idx].completed;
            // Optionally set completedAt
            allTasks[idx].completedAt = allTasks[idx].completed
                ? new Date().toISOString()
                : null;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allTasks));
        }
        loadTodayTasks();
    }

    // Delete task
    function handleDelete(task) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let allTasks = [];
        if (stored) {
            try {
                allTasks = JSON.parse(stored);
            } catch {
                allTasks = [];
            }
        }
        const updatedTasks = allTasks.filter(t => t.id !== task.id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
        loadTodayTasks();
    }

    // Start editing
    function handleStartEdit(task) {
        setEditingTaskId(task.id);
        setEditValue(task.title || task.name || '');
    }

    // Save edit
    function handleSaveEdit(task) {
        const trimmed = editValue.trim();
        if (trimmed.length === 0) return;
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let allTasks = [];
        if (stored) {
            try {
                allTasks = JSON.parse(stored);
            } catch {
                allTasks = [];
            }
        }
        const idx = allTasks.findIndex(t => t.id === task.id);
        if (idx !== -1) {
            allTasks[idx].title = trimmed;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allTasks));
        }
        setEditingTaskId(null);
        setEditValue('');
        loadTodayTasks();
    }

    // Cancel edit
    function handleCancelEdit() {
        setEditingTaskId(null);
        setEditValue('');
    }

    // For Enter key in edit field
    function handleEditInputKeyDown(e, task) {
        if (e.key === 'Enter') handleSaveEdit(task);
        if (e.key === 'Escape') handleCancelEdit();
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
                                    checked={!!task.completed}
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
                                    <span className={task.completed ? 'line-through text-gray-400' : ''}>
                                        {task.title || task.name || 'Untitled task'}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center'>
                                <span className='text-[#64748b] text-sm mr-4'>{task.time ? task.time : '--'}</span>
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
    )
}

export default TodayTasks