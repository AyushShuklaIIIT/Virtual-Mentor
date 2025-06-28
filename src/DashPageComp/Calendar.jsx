import React, { useEffect, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom';
import taskService from '../api/taskService';
import { toast } from 'react-toastify';

function getUpcomingTasks(tasks, count = 3) {
  if (!Array.isArray(tasks)) return [];
  
  const now = new Date();
  return tasks
    .filter(task => {
      if (!task) return false;
      
      // Handle different property names (duedate from API vs dueDate in code)
      const dueDate = task.duedate || task.dueDate;
      if (!dueDate) return false;
      
      // Handle different property names (is_completed from API vs completed in code)
      const completed = task.is_completed || task.completed;
      if (completed) return false;
      
      const taskDate = new Date(dueDate);
      return taskDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.duedate || a.dueDate);
      const dateB = new Date(b.duedate || b.dueDate);
      return dateA - dateB;
    })
    .slice(0, count);
}

function formatMonth(date) {
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

function formatDay(date) {
  return date.getDate();
}

function formatTimeRange(task) {
  // Handle different property names
  const dueDate = task.duedate || task.dueDate;
  if (!dueDate) return "All day";
  
  const date = new Date(dueDate);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  if (hours === 0 && minutes === '00') return "All day";
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

const Calendar = () => {
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAllTasks();
      
      // Debug the response structure
      console.log("Calendar API Response:", response);
      
      // Extract tasks array from the response based on the provided format
      let tasks = [];
      
      // Handle the specific response format you provided: { tasks: [...] }
      if (response && typeof response === 'object' && Array.isArray(response.tasks)) {
        tasks = response.tasks;
      } 
      // Fallback handling for different response formats
      else if (Array.isArray(response)) {
        tasks = response;
      } 
      // Additional fallbacks
      else if (response && typeof response === 'object') {
        tasks = response.data || response.result || [];
      }
      
      console.log("Extracted tasks for calendar:", tasks);
      setUpcomingTasks(getUpcomingTasks(tasks));
    } catch (err) {
      setError('Failed to load upcoming tasks. Please try again.');
      console.error('Error fetching upcoming tasks:', err);
      toast.error('Failed to load upcoming tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading && upcomingTasks.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
        <h3 className='font-semibold text-lg mb-4'>Upcoming Schedule</h3>
        <div className='flex justify-center py-8'>
          <div className='w-8 h-8 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin'></div>
        </div>
      </div>
    );
  }

  if (error && upcomingTasks.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
        <h3 className='font-semibold text-lg mb-4'>Upcoming Schedule</h3>
        <div className='text-center py-4'>
          <p className='text-red-500 mb-2'>{error}</p>
          <button 
            onClick={fetchTasks}
            className='text-purple-600 hover:text-purple-800 text-sm font-medium'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
      <h3 className='font-semibold text-lg mb-4'>Upcoming Schedule</h3>

      <div className='space-y-4'>
        {upcomingTasks.length === 0 && (
          <div className='text-[#64748b] text-sm text-center'>No upcoming tasks</div>
        )}
        {upcomingTasks.map(task => {
          // Handle different property names
          const dueDate = task.duedate || task.dueDate;
          const d = new Date(dueDate);
          return (
            <div className='flex items-center space-x-3' key={task.id}>
              <div className='w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center'>
                <span className='text-xs text-[#7738ea] font-medium'>{formatMonth(d)}</span>
                <span className='text-lg font-bold text-[#6627cc]'>{formatDay(d)}</span>
              </div>
              <div>
                <p className='font-medium'>{task.title || "Untitled Task"}</p>
                <p className='text-sm text-[#64748b]'>{formatTimeRange(task)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-4 text-center'>
        <NavLink to="/calendar" className='text-[#7738ea] hover:text-[#6627cc] text-sm font-medium'>View Calendar</NavLink>
      </div>
    </div>
  )
}

export default Calendar