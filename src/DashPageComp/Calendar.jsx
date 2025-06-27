import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'virtualMentorTasks';

function getUpcomingTasks(tasks, count = 3) {
  const now = new Date();
  return tasks
    .filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      if (task.completed) return false;
      return taskDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate + (a.time ? 'T' + a.time : ''));
      const dateB = new Date(b.dueDate + (b.time ? 'T' + b.time : ''));
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
  if (!task.time) return "All day";
  return task.time;
}

const Calendar = () => {
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let allTasks = [];
    if (stored) {
      try {
        allTasks = JSON.parse(stored);
      } catch {
        allTasks = [];
      }
    }
    setUpcomingTasks(getUpcomingTasks(allTasks));
  }, []);

  return (
    <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
      <h3 className='font-semibold text-lg mb-4'>Upcoming Schedule</h3>

      <div className='space-y-4'>
        {upcomingTasks.length === 0 && (
          <div className='text-[#64748b] text-sm text-center'>No upcoming tasks</div>
        )}
        {upcomingTasks.map(task => {
          const d = new Date(task.dueDate);
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