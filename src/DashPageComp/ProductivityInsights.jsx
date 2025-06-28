import React, { useRef, useEffect, useState, useCallback } from 'react'
import Chart from 'chart.js/auto'
import taskService from '../api/taskService'
import { toast } from 'react-toastify'

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Updated to handle both API and code property names
const getCompletedTasksByPeriod = (tasks, period) => {
  if (!Array.isArray(tasks)) {
    console.warn('Expected tasks to be an array but received:', typeof tasks);
    return { labels: [], counts: Array(7).fill(0) };
  }

  const now = new Date();
  let daysArr = [];
  let labels = [];
  if (period === 'Week') {
    const startOfWeek = getStartOfWeek(now);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      daysArr.push(d);
    }
  } else if (period === 'Month') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      daysArr.push(d);
    }
  } else if (period === 'Year') {
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), i, 1);
      labels.push(d.toLocaleDateString('en-US', { month: 'short' }));
      daysArr.push(d);
    }
  }

  let counts = Array(7).fill(0);

  tasks.forEach(task => {
    if (!task) return;

    // Handle different property names (is_completed from API vs completed in code)
    const isCompleted = task.is_completed || task.completed;
    // Handle different property names (completed_at from API vs completedAt in code)
    const completionDate = task.completed_at || task.completedAt;

    if (isCompleted && completionDate) {
      try {
        const completedDate = new Date(completionDate);
        if (period === 'Week' || period === 'Month') {
          daysArr.forEach((d, idx) => {
            if (
              completedDate.getFullYear() === d.getFullYear() &&
              completedDate.getMonth() === d.getMonth() &&
              completedDate.getDate() === d.getDate()
            ) {
              counts[idx]++;
            }
          });
        } else if (period === 'Year') {
          daysArr.forEach((d, idx) => {
            if (
              completedDate.getFullYear() === d.getFullYear() &&
              completedDate.getMonth() === d.getMonth()
            ) {
              counts[idx]++;
            }
          });
        }
      } catch (e) {
        console.warn('Error parsing date:', completionDate, e);
      }
    }
  });

  return { labels, counts };
};

const ProductivityInsights = () => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);
  const [period, setPeriod] = useState('Week');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Updated to handle the API response structure
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAllTasks();
      console.log("Productivity API Response:", response);
      
      // Extract tasks array from the response
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
      
      console.log("Extracted tasks for productivity:", tasksArray);
      setTasks(tasksArray);
    } catch (error) {
      console.error('Error fetching tasks for productivity insights:', error);
      setError('Failed to load task data. Please try again.');
      toast.error('Failed to load productivity insights');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create or update chart when period or tasks change
  useEffect(() => {
    // Don't render chart if we're still loading or there's an error
    if (loading || error) {
      return;
    }
    
    const { labels, counts } = getCompletedTasksByPeriod(tasks, period);
    const ctx = chartRef.current?.getContext('2d');
    
    if (!ctx) {
      return; // Early return if canvas context isn't available
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tasks Completed',
            data: counts,
            backgroundColor: '#0c87e8',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#f1f5f9',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [period, tasks, loading, error]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Loading state UI
  if (loading && tasks.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='font-semibold text-lg'>Productivity Insights</h3>
          <div className='flex space-x-2'>
            {['Week', 'Month', 'Year'].map((p) => (
              <button
                key={p}
                className={`px-3 py-1 text-sm rounded-md ${p === period ? 'bg-purple-50 text-[#7738ea]' : 'text-[#64748b] hover:bg-gray-100'}`}
                disabled={true}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className='h-64 flex items-center justify-center'>
          <div className='w-12 h-12 border-4 border-t-4 border-gray-200 border-t-[#0c87e8] rounded-full animate-spin'></div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='font-semibold text-lg'>Productivity Insights</h3>
          <button
            className='px-3 py-1 text-sm rounded-md bg-purple-50 text-[#7738ea]'
            onClick={fetchTasks}
          >
            Retry
          </button>
        </div>
        <div className='h-64 flex flex-col items-center justify-center'>
          <p className='text-red-500 mb-2'>{error}</p>
          <p className='text-gray-500 text-sm'>Unable to load productivity data</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='font-semibold text-lg'>Productivity Insights</h3>
        <div className='flex space-x-2'>
          <button
            className={`px-3 py-1 text-sm rounded-md ${period === 'Week' ? 'bg-purple-50 text-[#7738ea]' : 'text-[#64748b] hover:bg-gray-100'}`}
            onClick={() => handlePeriodChange('Week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${period === 'Month' ? 'bg-purple-50 text-[#7738ea]' : 'text-[#64748b] hover:bg-gray-100'}`}
            onClick={() => handlePeriodChange('Month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${period === 'Year' ? 'bg-purple-50 text-[#7738ea]' : 'text-[#64748b] hover:bg-gray-100'}`}
            onClick={() => handlePeriodChange('Year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className='h-64'>
        {tasks.length === 0 ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-gray-400'>No task data available to display</p>
          </div>
        ) : (
          <canvas id='productivityChart' ref={chartRef}></canvas>
        )}
      </div>
    </div>
  );
};

export default ProductivityInsights;