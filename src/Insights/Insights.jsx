import React, { useEffect, useRef, useState, useCallback } from 'react'
import './insights.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faArrowUp, faBolt, faChartLine, faCheckCircle, faCheckDouble, faExclamationCircle, faFire, faLightbulb, faPlus, faQuoteLeft, faStar, faTrophy } from '@fortawesome/free-solid-svg-icons'
import Chart from 'chart.js/auto';
import DateRangePicker from './DateRangePicker';
import HamburgerIcon from '../SVGs/HamburgerIcon'
import taskService from '../api/taskService';
import { toast } from 'react-toastify';
import ProfileDropdown from '../Components/ProfileDropdown';

const productivityCircleRadius = 36;
const productivityScore = 0.85;

const allCategories = ['Work', 'Personal', 'Health', 'Urgent'];
const allHours = [6, 8, 10, 12, 14, 16, 18, 20, 22];

// Transform backend task object to match frontend expectations
const transformTask = (task) => ({
    ...task,
    completed: task.is_completed,
    completedAt: task.completed_at,
    dueDate: task.duedate,
    createdAt: task.created_at,
    // For time-based analysis, use created_at if no other time is available
    time: task.duedate || task.created_at
});

function normalizeToLocalDate(date) {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d;
}

function isDateInRange(taskDate, startDate, endDate) {
    const d = normalizeToLocalDate(taskDate);
    const s = normalizeToLocalDate(startDate);
    const e = normalizeToLocalDate(endDate);
    return d && s && e && d >= s && d <= e;
}

const getStreak = tasks => {
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let i = 0; i < 100; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const completed = tasks.some(t => t.completed && t.completedAt && normalizeToLocalDate(new Date(t.completedAt)).getTime() === day.getTime());
        if (completed) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

const isPerfectWeek = tasks => {
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dueTasks = tasks.filter(t => t.dueDate && normalizeToLocalDate(new Date(t.dueDate)).getTime() === day.getTime());
        if (dueTasks.length === 0) continue;
        const completedTasks = dueTasks.filter(t => t.completed && t.completedAt && normalizeToLocalDate(new Date(t.completedAt)).getTime() === day.getTime()).length;
        if (completedTasks < dueTasks.length) {
            return false;
        }
    }
    return true;
}

const getCategoryFromTag = tag => {
    if (!tag) return 'Work';
    const t = tag.toLowerCase();
    if (t === 'work') return 'Work';
    if (t === 'personal') return 'Personal';
    if (t === 'health') return 'Health';
    if (t === 'urgent') return 'Urgent';
    return 'Work';
}

const goals = [
    {
        title: "Complete 50 work tasks this month",
        progress: 56,
        sub: "28/50 tasks completed",
    },
    {
        title: "Maintain a 14-day streak",
        progress: 50,
        sub: "7/14 days completed",
    },
    {
        title: "Reduce overdue tasks to zero",
        progress: 70,
        sub: "3 tasks remaining",
    }
];

const Insights = ({ onOpenSidebar }) => {
    const [timePeriod, setTimePeriod] = useState('weekly');
    const [categoryChartType, setCategoryChartType] = useState('donut');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 6)),
        endDate: new Date()
    });
    const [completedChangeStr, setCompletedChangeStr] = useState("");
    const [overdueChangeStr, setOverdueChangeStr] = useState("");
    const [currOverdue, setCurrOverdue] = useState(0);
    const [currCompleted, setCurrCompleted] = useState(0);
    const [completedChange, setCompletedChange] = useState(0);
    const [overdueChange, setOverdueChange] = useState(0);

    const [allTasks, setAllTasks] = useState([]);
    const [transformedTasks, setTransformedTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tasks from API
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskService.getAllTasks();
            const tasksArray = Array.isArray(data) ? data : [];
            setAllTasks(tasksArray);
            
            // Transform tasks to match frontend expectations
            const transformed = tasksArray.map(transformTask);
            setTransformedTasks(transformed);
        } catch (err) {
            console.error('Error fetching tasks for insights:', err);
            setError('Failed to load task data. Please try again.');
            toast.error('Failed to load insights data');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Calculate metrics when date range or tasks change
    useEffect(() => {
        if (loading || error || transformedTasks.length === 0) return;
        
        const days = Math.floor((normalizeToLocalDate(dateRange.endDate) - normalizeToLocalDate(dateRange.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        const prevEnd = new Date(normalizeToLocalDate(dateRange.startDate));
        prevEnd.setDate(prevEnd.getDate() - 1);
        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevStart.getDate() - (days - 1));

        const currCompleted = transformedTasks.filter(t => {
            return t.completed &&
                t.completedAt &&
                isDateInRange(t.completedAt, dateRange.startDate, dateRange.endDate)
        }).length;

        const prevCompleted = transformedTasks.filter(t => {
            return t.completed &&
                t.completedAt &&
                isDateInRange(t.completedAt, prevStart, prevEnd);
        }).length;

        setCurrCompleted(currCompleted);
        setCompletedChange(
            prevCompleted === 0
                ? (currCompleted === 0 ? 0 : 100)
                : ((currCompleted - prevCompleted) / prevCompleted) * 100
        );
        setCompletedChangeStr(
            (prevCompleted === 0 && currCompleted === 0)
                ? "0%"
                : ((currCompleted - prevCompleted) >= 0 ? "+" : "") +
                ((prevCompleted === 0)
                    ? 100
                    : (((currCompleted - prevCompleted) / prevCompleted) * 100).toFixed(0)) + "%"
        );

        const now = new Date();
        now.setHours(0,0,0,0);
        const currOverdue = transformedTasks.filter(t =>
            !t.completed &&
            t.dueDate &&
            isDateInRange(t.dueDate, dateRange.startDate, dateRange.endDate) &&
            normalizeToLocalDate(new Date(t.dueDate)) < now
        ).length;

        const prevOverdue = transformedTasks.filter(t =>
            !t.completed &&
            t.dueDate &&
            isDateInRange(t.dueDate, prevStart, prevEnd) &&
            normalizeToLocalDate(new Date(t.dueDate)) < prevEnd
        ).length;

        setCurrOverdue(currOverdue);
        setOverdueChange(prevOverdue === 0 ? (currOverdue === 0 ? 0 : 100) : ((currOverdue - prevOverdue) / prevOverdue) * 100);
        setOverdueChangeStr(
            (prevOverdue === 0 && currOverdue === 0)
                ? "0%"
                : ((currOverdue - prevOverdue) >= 0 ? "+" : "") +
                ((prevOverdue === 0)
                    ? 100
                    : (((currOverdue - prevOverdue) / prevOverdue) * 100).toFixed(0)) + "%"
        );
    }, [dateRange.endDate, dateRange.startDate, transformedTasks, loading, error]);

    // If loading or error, don't calculate filtered tasks
    const filteredTasks = loading || error ? [] : transformedTasks.filter(t => {
        const dueInRange = t.dueDate && isDateInRange(t.dueDate, dateRange.startDate, dateRange.endDate);
        const completedInRange = t.completed && t.completedAt && isDateInRange(t.completedAt, dateRange.startDate, dateRange.endDate);
        return dueInRange || completedInRange;
    });

    // Time chart data: Weekly (group by day), Monthly (group by week)
    let timeChartData = { labels: [], data: [] };
    if (!loading && !error && filteredTasks.length > 0) {
        if (timePeriod === 'weekly') {
            const days = [];
            const dataMap = {};
            for (let i = 0; i < 7; ++i) {
                const day = new Date(normalizeToLocalDate(dateRange.startDate));
                day.setDate(day.getDate() + i);
                const label = day.toLocaleDateString(undefined, { weekday: 'short' });
                days.push(label);
                dataMap[label] = 0;
            }
            filteredTasks.forEach(t => {
                if (t.completed && t.completedAt) {
                    const d = normalizeToLocalDate(new Date(t.completedAt));
                    if (isDateInRange(d, dateRange.startDate, dateRange.endDate)) {
                        const label = d.toLocaleDateString(undefined, { weekday: 'short' });
                        if (label in dataMap) dataMap[label]++;
                    }
                }
            });
            timeChartData.labels = days;
            timeChartData.data = days.map(label => dataMap[label]);
        } else if (timePeriod === 'monthly') {
            // Divide into weeks
            const start = new Date(normalizeToLocalDate(dateRange.startDate));
            const end = new Date(normalizeToLocalDate(dateRange.endDate));
            const weeks = [];
            const weekLabels = [];
            let curr = new Date(start);
            let i = 1;
            while (curr <= end) {
                weekLabels.push(`Week ${i++}`);
                const weekEnd = new Date(curr);
                weekEnd.setDate(weekEnd.getDate() + 6);
                weeks.push({ start: new Date(curr), end: weekEnd });
                curr = new Date(curr);
                curr.setDate(curr.getDate() + 7);
            }
            // Count per week
            const weekCounts = Array(weeks.length).fill(0);
            filteredTasks.forEach(t => {
                if (t.completed && t.completedAt) {
                    const td = normalizeToLocalDate(new Date(t.completedAt));
                    weeks.forEach((w, idx) => {
                        if (td >= normalizeToLocalDate(w.start) && td <= normalizeToLocalDate(w.end)) weekCounts[idx]++;
                    });
                }
            });
            timeChartData.labels = weekLabels;
            timeChartData.data = weekCounts;
        }
    }

    // Category chart data
    const categoryCounts = {};
    allCategories.forEach(cat => categoryCounts[cat] = 0);
    if (!loading && !error && filteredTasks.length > 0) {
        filteredTasks.forEach(t => {
            if (t.completed && t.completedAt && isDateInRange(t.completedAt, dateRange.startDate, dateRange.endDate)) {
                const cat = getCategoryFromTag(t.tag);
                categoryCounts[cat]++;
            }
        });
    }
    const categoryChartData = {
        labels: allCategories,
        data: allCategories.map(cat => categoryCounts[cat])
    };

    // Hourly productivity chart data (group by hour)
    const hourCounts = {};
    allHours.forEach(h => hourCounts[h] = 0);
    if (!loading && !error && filteredTasks.length > 0) {
        filteredTasks.forEach(t => {
            if (t.completed && t.completedAt) {
                const d = normalizeToLocalDate(new Date(t.completedAt));
                if (isDateInRange(d, dateRange.startDate, dateRange.endDate)) {
                    // Extract hour from completedAt, dueDate, or createdAt
                    let hour = 8; // default
                    if (t.completedAt) {
                        hour = new Date(t.completedAt).getHours();
                    } else if (t.dueDate) {
                        hour = new Date(t.dueDate).getHours();
                    } else if (t.createdAt) {
                        hour = new Date(t.createdAt).getHours();
                    }
                    
                    const slot = allHours.reduce((prev, curr) => Math.abs(curr - hour) < Math.abs(prev - hour) ? curr : prev, allHours[0]);
                    hourCounts[slot]++;
                }
            }
        });
    }
    const hourlyChartData = {
        labels: allHours.map(h => {
            if (h < 12) return `${h}AM`;
            if (h === 12) return `12PM`;
            return `${h - 12}PM`;
        }),
        data: allHours.map(h => hourCounts[h])
    };

    // Stats
    const streak = loading || error ? 0 : getStreak(transformedTasks);
    const dailyAvg = loading || error ? 0 : (
        filteredTasks.filter(t => t.completed && t.completedAt && isDateInRange(t.completedAt, dateRange.startDate, dateRange.endDate)
        ).length / ((normalizeToLocalDate(dateRange.endDate) - normalizeToLocalDate(dateRange.startDate)) / 86400000 + 1)
    ).toFixed(1);
    
    const stats = [
        {
            icon: faCheckCircle,
            title: "Tasks Completed",
            value: currCompleted,
            change: completedChangeStr,
            changeIcon: completedChange >= 0 ? faArrowUp : faArrowDown,
            changeClass: completedChange >= 0 ? "text-green-500" : "text-red-500",
            sub: "vs. previous period",
        },
        {
            icon: faFire,
            title: "Current Streak",
            value: streak,
            sub: "Best: 14 days",
            changeClass: "text-orange-500",
            extra: "days"
        },
        {
            icon: faChartLine,
            title: "Daily Average",
            value: dailyAvg,
            changeClass: "text-blue-500",
            sub: "Completed per day",
            extra: "tasks"
        },
        {
            icon: faExclamationCircle,
            title: "Tasks Overdue",
            value: currOverdue,
            change: overdueChangeStr,
            changeIcon: overdueChange >= 0 ? faArrowUp : faArrowDown,
            changeClass: overdueChange >= 0 ? "text-red-500" : "text-green-500",
            sub: "vs. previous period",
        }
    ];

    // Chart refs and Chart.js instance holders
    const timeChartRef = useRef(null);
    const categoryChartRef = useRef(null);
    const hourlyChartRef = useRef(null);
    const productivityCircleRef = useRef(null);
    const chartInstances = useRef({});

    useEffect(() => {
        if (productivityCircleRef.current) {
            const circle = productivityCircleRef.current;
            const circumference = 2 * Math.PI * productivityCircleRadius;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference * (1 - productivityScore);
        }
    }, []);

    // Time Chart (depends on timePeriod and dateRange)
    useEffect(() => {
        if (loading || error || !timeChartRef.current) return;
        
        if (chartInstances.current.timeChart) {
            chartInstances.current.timeChart.destroy();
        }
        
        const ctx = timeChartRef.current.getContext('2d');
        chartInstances.current.timeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeChartData.labels,
                datasets: [{
                    label: 'Tasks Completed',
                    data: timeChartData.data,
                    borderColor: '#7738ea',
                    backgroundColor: 'rgba(119, 56, 234, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#7738ea',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            title: ctx => ctx[0].label,
                            label: function (context) {
                                let value = context.parsed;
                                if (value !== null && typeof value === 'object' && 'y' in value) {
                                    value = value.y;
                                }
                                return `${value} tasks completed`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 2, precision: 0 }
                    }
                }
            }
        });
        const chartRefCopy = chartInstances.current;
        return () => { if (chartRefCopy.timeChart) chartRefCopy.timeChart.destroy(); }
    }, [timePeriod, dateRange, timeChartData.data, timeChartData.labels, loading, error]);

    // Category Chart (depends on dateRange and categoryChartType)
    useEffect(() => {
        if (loading || error || !categoryChartRef.current) return;
        
        if (chartInstances.current.categoryChart) {
            chartInstances.current.categoryChart.destroy();
        }
        
        const ctx = categoryChartRef.current.getContext('2d');
        chartInstances.current.categoryChart = new Chart(ctx, {
            type: categoryChartType === 'donut' ? 'doughnut' : 'bar',
            data: {
                labels: categoryChartData.labels,
                datasets: [{
                    data: categoryChartData.data,
                    backgroundColor: ['#7738ea', '#3b82f6', '#10b981', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: categoryChartType === 'donut' ? '70%' : 0,
                plugins: {
                    legend: {
                        display: categoryChartType === 'donut',
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: function (context) {
                                let value = context.parsed;
                                if (value !== null && typeof value === 'object' && 'y' in value) {
                                    value = value.y;
                                }
                                return `${value} tasks completed`;
                            }
                        }
                    }
                },
                scales: categoryChartType === 'bar' ? {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 10, precision: 0 }
                    }
                } : undefined
            }
        });
        const chartRefCopy = chartInstances.current;
        return () => { if (chartRefCopy.categoryChart) chartRefCopy.categoryChart.destroy(); }
    }, [categoryChartType, dateRange, categoryChartData.data, categoryChartData.labels, loading, error]);

    // Hourly Productivity Chart (depends on dateRange)
    useEffect(() => {
        if (loading || error || !hourlyChartRef.current) return;
        
        if (chartInstances.current.hourlyChart) {
            chartInstances.current.hourlyChart.destroy();
        }
        
        const ctx = hourlyChartRef.current.getContext('2d');
        chartInstances.current.hourlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hourlyChartData.labels,
                datasets: [{
                    label: 'Tasks Completed',
                    data: hourlyChartData.data,
                    backgroundColor: function (context) {
                        const value = context.dataset.data[context.dataIndex];
                        const alpha = 0.2 + (value / 10) * 0.8;
                        return `rgba(119, 56, 234, ${alpha})`;
                    },
                    borderRadius: 4,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        callbacks: {
                            title: ctx => ctx[0].label,
                            label: function (context) {
                                let value = context.parsed;
                                if (value !== null && typeof value === 'object' && 'y' in value) {
                                    value = value.y;
                                }
                                return `${value} tasks completed`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 2, precision: 0 }
                    }
                }
            }
        });
        const chartRefCopy = chartInstances.current;
        return () => { if (chartRefCopy.hourlyChart) chartRefCopy.hourlyChart.destroy(); }
    }, [dateRange, hourlyChartData.data, hourlyChartData.labels, loading, error]);

    const handleTimePeriodChange = useCallback((period) => setTimePeriod(period), []);
    const handleCategoryChartTypeChange = useCallback((type) => setCategoryChartType(type), []);
    const handleDateRangeChange = useCallback((range) => setDateRange(range), []);

    // Calculate achievements based on task data
    const completedTasks = !loading && !error ? transformedTasks.filter(t => t.completed && t.completedAt) : [];
    const earlyBirdCount = !loading && !error ? completedTasks.filter(t => {
        const date = new Date(t.completedAt || t.dueDate || t.createdAt);
        return date && date.getHours() < 10;
    }).length : 0;
    
    const dailyCounts = {};
    if (!loading && !error) {
        completedTasks.forEach(t => {
            if (t.completedAt) {
                const d = normalizeToLocalDate(new Date(t.completedAt)).toDateString();
                dailyCounts[d] = (dailyCounts[d] || 0) + 1;
            }
        });
    }
    
    const maxTasksInADay = !loading && !error ? Math.max(0, ...Object.values(dailyCounts)) : 0;
    const perfectWeek = !loading && !error ? isPerfectWeek(transformedTasks) : false;
    const completedCount = completedTasks.length;
    
    const achievements = [
        {
            icon: faFire,
            iconClass: "bg-purple-100 text-purple-600",
            title: "7-Day Streak",
            desc: "Complete tasks 7 days in a row",
            earned: streak >= 7,
            progress: streak < 7 ? { value: Math.min((streak / 7) * 100, 100), text: `${streak}/7 days` } : null
        },
        {
            icon: faBolt,
            iconClass: "bg-blue-100 text-blue-600",
            title: "Early Bird",
            desc: "Complete 5 tasks before 10 AM",
            earned: earlyBirdCount >= 5,
            progress: earlyBirdCount < 5 ? { value: Math.min((earlyBirdCount / 5) * 100, 100), text: `${earlyBirdCount}/5 tasks` } : null
        },
        {
            icon: faCheckDouble,
            iconClass: "bg-green-100 text-green-600",
            title: "Overachiever",
            desc: "Complete 10+ tasks in one day",
            earned: maxTasksInADay >= 10,
            progress: maxTasksInADay < 10 ? { value: Math.min((maxTasksInADay / 10) * 100, 100), text: `${maxTasksInADay}/10 tasks` } : null
        },
        {
            icon: faStar,
            iconClass: "bg-gray-100 text-gray-400",
            title: "Perfect Week",
            desc: "Complete all planned tasks for a week",
            earned: perfectWeek,
            progress: !perfectWeek ? { value: 0, text: "In progress" } : null
        },
        {
            icon: faTrophy,
            iconClass: "bg-gray-100 text-gray-400",
            title: "Task Master",
            desc: "Complete 100 tasks total",
            earned: completedCount >= 100,
            progress: completedCount < 100 ? { value: Math.min((completedCount / 100) * 100, 100), text: `${completedCount}/100 tasks` } : null
        }
    ];

    // Loading component for chart containers
    const LoadingChart = () => (
        <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-4 border-t-[#7738ea] animate-spin"></div>
        </div>
    );

    // Error component for chart containers
    const ErrorChart = ({ onRetry }) => (
        <div className="h-64 flex flex-col items-center justify-center">
            <div className="text-red-500 mb-3">Failed to load chart data</div>
            <button 
                onClick={onRetry} 
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                Retry
            </button>
        </div>
    );

    // If initial loading and no data yet
    if (loading && allTasks.length === 0) {
        return (
            <div className='insights-bg flex-1 flex-grow min-w-0'>
                <div className='min-h-screen flex flex-col'>
                    {/* Top Navigation Bar */}
                    <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center'>
                                <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                                    <HamburgerIcon />
                                </button>
                            </div>
                            <div className='flex items-center'>
                                <ProfileDropdown />
                            </div>
                        </div>
                    </header>
                    
                    {/* Loading State */}
                    <main className='flex-grow p-2 sm:p-4 md:p-6'>
                        <div className='max-w-7xl mx-auto flex flex-col items-center justify-center h-[80vh]'>
                            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Loading insights data...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // If error loading all data
    if (error && allTasks.length === 0) {
        return (
            <div className='insights-bg flex-1 flex-grow min-w-0'>
                <div className='min-h-screen flex flex-col'>
                    {/* Top Navigation Bar */}
                    <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center'>
                                <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                                    <HamburgerIcon />
                                </button>
                            </div>
                            <div className='flex items-center'>
                                <ProfileDropdown/>
                            </div>
                        </div>
                    </header>
                    
                    {/* Error State */}
                    <main className='flex-grow p-2 sm:p-4 md:p-6'>
                        <div className='max-w-7xl mx-auto flex flex-col items-center justify-center h-[80vh]'>
                            <div className="text-red-500 text-xl mb-4">{error}</div>
                            <button 
                                onClick={fetchTasks}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Retry
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className='insights-bg flex-1 flex-grow min-w-0'>
            <div className='min-h-screen flex flex-col'>
                {/* Top Navigation Bar */}
                <header className='bg-white shadow-sm py-3 px-4 md:px-6'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <button id='open-sidebar' className='md:hidden mr-4 text-[#64748b] hover:text-[#334155]' onClick={onOpenSidebar}>
                                <HamburgerIcon />
                            </button>
                        </div>
                        <div className='flex items-center'>
                            <ProfileDropdown />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className='flex-grow p-2 sm:p-4 md:p-6'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Page Title and Date Range */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
                            <div>
                                <h1 className='text-2xl font-bold text-gray-800'>Insights</h1>
                                <p className='text-gray-600 mt-1'>Track your productivity and achievements</p>
                            </div>
                            <div className='mt-4 md:mt-0 flex items-center'>
                                <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
                            </div>
                        </div>

                        <div className='quote-card p-4 rounded-lg mb-6 fade-in'>
                            <div className='flex items-start'>
                                <FontAwesomeIcon icon={faQuoteLeft} className='text-purple-500 text-xl mr-3 mt-1' />
                                <div>
                                    <p className='text-gray-700 italic'>"The key is not to prioritize what's on your schedule, but to schedule your priorities."</p>
                                    <p className='text-gray-500 text-sm mt-1'>- Stephen Covey</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className='stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                            {stats.map((stat, i) => {
                                let statBgClass = '';
                                if (stat.changeClass?.includes('green')) {
                                    statBgClass = 'bg-green-100';
                                } else if (stat.changeClass?.includes('red')) {
                                    statBgClass = 'bg-red-100';
                                } else if (stat.title === "Current Streak") {
                                    statBgClass = 'bg-orange-100';
                                } else if (stat.title === "Daily Average") {
                                    statBgClass = 'bg-blue-100';
                                }
                                return (
                                    <div className={`card stat-card p-5 fade-in fade-in-delay-${i + 1}`} key={stat.title}>
                                        <div className='flex items-center justify-between mb-2'>
                                            <h3 className='text-gray-500 font-medium'>{stat.title}</h3>
                                            <div className={`w-8 h-8 rounded-full ${statBgClass} flex items-center justify-center`}>
                                                <FontAwesomeIcon icon={stat.icon} className={stat.changeClass ? stat.changeClass : ''} />
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                                        ) : (
                                            <div className='flex items-end'>
                                                <span className='text-3xl font-bold text-gray-800'>{stat.value}</span>
                                                {stat.extra && <span className='text-sm ml-2 mb-1'>{stat.extra}</span>}
                                                {stat.change && (
                                                    <span className={`${stat.changeClass} text-sm ml-2 mb-1 flex items-center`}>
                                                        <FontAwesomeIcon icon={stat.changeIcon} className='mr-1' />
                                                        <span>{stat.change.replace(/[-+]/, '')}</span>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <p className='text-gray-500 text-sm mt-1'>{stat.sub}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Charts Grid */}
                        <div className='charts-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                            <div className='card p-4 sm:p-5 fade-in'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='font-semibold text-gray-800'>Tasks Completed Over Time</h3>
                                    <div className='toggle-btn'>
                                        <span
                                            className={`toggle-option ${timePeriod === 'weekly' ? 'active' : ''}`}
                                            onClick={() => handleTimePeriodChange('weekly')}
                                        >Weekly</span>
                                        <span
                                            className={`toggle-option ${timePeriod === 'monthly' ? 'active' : ''}`}
                                            onClick={() => handleTimePeriodChange('monthly')}
                                        >Monthly</span>
                                    </div>
                                </div>
                                <div className='chart-container-responsive'>
                                    {loading ? <LoadingChart /> : 
                                     error ? <ErrorChart onRetry={fetchTasks} /> :
                                     <canvas ref={timeChartRef}></canvas>}
                                </div>
                            </div>

                            <div className='card p-4 sm:p-5 fade-in'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='font-semibold text-gray-800'>Task Category Breakdown</h3>
                                    <div className='toggle-btn'>
                                        <span
                                            className={`toggle-option ${categoryChartType === 'donut' ? 'active' : ''}`}
                                            onClick={() => handleCategoryChartTypeChange('donut')}
                                        >Donut</span>
                                        <span
                                            className={`toggle-option ${categoryChartType === 'bar' ? 'active' : ''}`}
                                            onClick={() => handleCategoryChartTypeChange('bar')}
                                        >Bar</span>
                                    </div>
                                </div>
                                <div className='chart-container-responsive'>
                                    {loading ? <LoadingChart /> : 
                                     error ? <ErrorChart onRetry={fetchTasks} /> :
                                     <canvas ref={categoryChartRef}></canvas>}
                                </div>
                            </div>

                            <div className='card p-4 sm:p-5 fade-in'>
                                <h3 className='font-semibold text-gray-800 mb-4'>Hourly Productivity</h3>
                                <div className='chart-container-responsive'>
                                    {loading ? <LoadingChart /> : 
                                     error ? <ErrorChart onRetry={fetchTasks} /> :
                                     <canvas ref={hourlyChartRef}></canvas>}
                                </div>
                            </div>

                            <div className='card p-4 sm:p-5 fade-in'>
                                <h3 className='font-semibold text-gray-800 mb-4'>Productivity Score</h3>
                                <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
                                    <div className='circular-progress'>
                                        <svg width={80} height={80}>
                                            <circle className='bg' cx={40} cy={40} r={36}></circle>
                                            <circle className='progress' cx={40} cy={40} r={36} ref={productivityCircleRef}></circle>
                                        </svg>
                                        <div className='text'>85%</div>
                                    </div>
                                    <div className='sm:ml-4 flex-grow w-full sm:w-auto'>
                                        <div className='flex justify-between mb-1'>
                                            <span className='text-sm text-gray-600'>Task Completion Rate</span>
                                            <span className='text-sm font-medium'>92%</span>
                                        </div>
                                        <div className='progress-bar mb-3'>
                                            <div className='progress-fill bg-green-500' style={{ width: "92%" }}></div>
                                        </div>
                                        <div className='flex justify-between mb-1'>
                                            <span className='text-sm text-gray-600'>On-time Completion</span>
                                            <span className='text-sm font-medium'>78%</span>
                                        </div>
                                        <div className='progress-bar mb-3'>
                                            <div className='progress-fill bg-yellow-500' style={{ width: "78%" }}></div>
                                        </div>
                                        <div className='flex justify-between mb-1'>
                                            <span className='text-sm text-gray-600'>Focus Score</span>
                                            <span className='text-sm font-medium'>85%</span>
                                        </div>
                                        <div className='progress-bar'>
                                            <div className='progress-fill bg-purple-500' style={{ width: "85%" }}></div>
                                        </div>
                                    </div>
                                </div>
                                <p className='text-gray-600 text-sm'>Your productivity score is calculated based on task completion rate, on-time performance and focus.</p>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className='mb-6'>
                            <h3 className='font-semibold text-gray-800 mb-4'>Achievements</h3>
                            <div className='overflow-x-auto pb-2'>
                                <div className='flex space-x-4' style={{ minWidth: "max-content" }}>
                                    {achievements.map((ach) => (
                                        <div className={`achievement-card p-4 text-center fade-in ${ach.earned ? '' : 'locked'}`} key={ach.title}>
                                            <div className={`achievement-icon ${ach.iconClass} mb-3 ${ach.progress ? '' : 'pulse'}`}>
                                                <FontAwesomeIcon icon={ach.icon} />
                                            </div>
                                            <h4 className={`font-medium ${!ach.earned ? 'text-gray-400' : 'text-gray-800'}`}>{ach.title}</h4>
                                            <p className={`text-sm mt-1 ${!ach.earned ? 'text-gray-400' : 'text-gray-500'}`}>{ach.desc}</p>
                                            {ach.progress && (
                                                <div className='mt-2'>
                                                    <div className='progress-bar'>
                                                        <div className='progress-fill bg-gray-300' style={{ width: `${ach.progress.value}%` }}></div>
                                                    </div>
                                                    <p className='text-gray-400 text-xs mt-1'>{ach.progress.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Goals Section */}
                        <div className='card p-5 mb-6 fade-in'>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='font-semibold text-gray-800'>Goals Progress</h3>
                                <button className='text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center'>
                                    <FontAwesomeIcon icon={faPlus} className='mr-1' />
                                    <span>Add Goal</span>
                                </button>
                            </div>
                            <div className='space-y-4'>
                                {goals.map((goal) => (
                                    <div key={goal.title}>
                                        <div className='flex justify-between mb-1'>
                                            <div>
                                                <h4 className='font-medium text-gray-800'>{goal.title}</h4>
                                                <p className='text-gray-500 text-sm'>{goal.sub}</p>
                                            </div>
                                            <span className='text-purple-600 font-medium'>{goal.progress}%</span>
                                        </div>
                                        <div className='progress-bar'>
                                            <div className='progress-fill gradient-bg' style={{ width: `${goal.progress}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Productivity Tips */}
                        <div className='bg-white rounded-lg p-5 border border-gray-200 fade-in'>
                            <h3 className='font-semibold text-gray-800 mb-3'>Productivity Tip</h3>
                            <div className='flex'>
                                <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0'>
                                    <FontAwesomeIcon icon={faLightbulb} className='text-purple-600' />
                                </div>
                                <div>
                                    <p className='text-gray-700'>Try the <span className='font-medium'>Pomodoro Technique</span>: Work for 25 minutes, then take a 5-minute break.</p>
                                    <button className='text-purple-600 hover:text-purple-800 text-sm font-medium mt-2 flex items-center'>
                                        <span>Learn More</span>
                                        <FontAwesomeIcon icon={faArrowRight} className='ml-1 text-xs' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Insights;