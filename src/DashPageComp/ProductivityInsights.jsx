import React, { useRef, useEffect, useState } from 'react'
import Chart from 'chart.js/auto'

const LOCAL_STORAGE_KEY = 'virtualMentorTasks';

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getCompletedTasksByPeriod = (tasks, period) => {
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
    if (task.completed && task.completedAt) {
      const completedDate = new Date(task.completedAt);
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
    }
  });

  return { labels, counts };
};

const ProductivityInsights = () => {
  const chartRef = useRef()
  const chartInstanceRef = useRef(null)
  const [period, setPeriod] = useState('Week')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch {
        setTasks([])
      }
    } else {
      setTasks([])
    }
  }, [])

  useEffect(() => {
    const { labels, counts } = getCompletedTasksByPeriod(tasks, period)
    const ctx = chartRef.current.getContext('2d')

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
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
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [period, tasks])

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
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
        <canvas id='productivityChart' ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default ProductivityInsights