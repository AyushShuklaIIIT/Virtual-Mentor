import React, { useEffect, useState } from 'react'
import Progress from '../SVGs/Progress'
import MainContentLeftCol from './MainContentLeftCol'
import MainContentRightCol from './MainContentRightCol'

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function normalizeToLocalDate(date) {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getCurrentStreak(tasks) {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 100; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const completed = tasks.some(t =>
            t.completed &&
            t.completedAt &&
            normalizeToLocalDate(t.completedAt).getTime() === day.getTime()
        );
        if (completed) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function getStreakHistory(tasks, days = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let history = [];
    for (let i = days - 1; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const completed = tasks.some(t =>
            t.completed &&
            t.completedAt &&
            normalizeToLocalDate(t.completedAt).getTime() === day.getTime()
        );
        history.push(completed);
    }
    return history;
}

const LOCAL_STORAGE_KEY = 'virtualMentorTasks';

const MainDashboardContent = () => {
    const [greeting, setGreeting] = useState(getGreeting());
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [personalBest, setPersonalBest] = useState(0);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [streakHistory, setStreakHistory] = useState([]);

    useEffect(() => {
        // Update greeting when time changes
        const interval = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Load all tasks
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let allTasks = [];
        if (stored) {
            try {
                allTasks = JSON.parse(stored);
            } catch {
                allTasks = [];
            }
        }

        // Calculate start and end of week (Monday-Sunday)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Monday of this week
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        weekStart.setHours(0, 0, 0, 0);

        // Sunday of this week
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // All tasks due this week
        const tasksThisWeek = allTasks.filter(t =>
            t.dueDate &&
            normalizeToLocalDate(t.dueDate) >= weekStart &&
            normalizeToLocalDate(t.dueDate) <= weekEnd
        );

        // Of those, how many are completed
        const completedThisWeek = tasksThisWeek.filter(t => t.completed).length;

        setTasksCompleted(completedThisWeek);

        // Calculate percentage (0-100%) of tasks completed this week
        const percent = tasksThisWeek.length > 0 ? Math.round((completedThisWeek / tasksThisWeek.length) * 100) : 0;
        setPercentCompleted(percent);

        // Calculate current streak
        const streak = getCurrentStreak(allTasks);
        setCurrentStreak(streak);

        // Calculate personal best streak
        let best = 0, current = 0;
        const completedDatesSet = new Set(
            allTasks
                .filter(t => t.completed && t.completedAt)
                .map(t => normalizeToLocalDate(t.completedAt).getTime())
        );
        const allDates = Array.from(completedDatesSet).sort((a, b) => a - b);
        if (allDates.length) {
            let prev = allDates[0];
            current = 1;
            best = 1;
            for (let i = 1; i < allDates.length; ++i) {
                if (allDates[i] - prev === 86400000) {
                    current++;
                } else if (allDates[i] !== prev) {
                    current = 1;
                }
                prev = allDates[i];
                if (current > best) best = current;
            }
        }
        setPersonalBest(best);

        // Calculate streak history for last 7 days
        setStreakHistory(getStreakHistory(allTasks, 7));
    }, []);

    // Always render Mon-Sun left to right (no reordering)
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <main className='flex-1 overflow-y-auto bg-gray-50 p-4'>
            <div className='max-w-7xl mx-auto'>
                {/* Welcome Section */}
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold mb-1'>{greeting}, John!</h2>
                    <p className='text-[#64748b]'>Here's what's happening with your tasks today.</p>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-semibold text-[#64748b]'>Tasks Completed</h3>
                        </div>
                        <div className='flex items-end justify-between'>
                            <div>
                                <p className='text-3xl font-bold'>{tasksCompleted}</p>
                                <p className='text-[#94a3b8] text-sm'>This week</p>
                            </div>
                            <div className='w-16 h-16 md:flex items-center justify-center hidden'>
                                <Progress percent={percentCompleted} stroke="#0c87e8" fill="#0c87e8"></Progress>
                            </div>
                        </div>
                    </div>

                    {/* Current Streak Card */}
                    <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-semibold text-[#64748b]'>Current Streak</h3>
                        </div>
                        {/* Responsive flex-col on small, flex-row on large */}
                        <div className='flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4'>
                            {/* Streak info */}
                            <div>
                                <p className='text-3xl font-bold'>{currentStreak} days</p>
                                <p className='text-[#94a3b8] text-sm'>Personal best: {personalBest}</p>
                            </div>
                            {/* Chart: below on mobile, side on large */}
                            <div className="w-full mt-4 lg:mt-0 lg:w-auto flex flex-col items-start">
                                <div className="flex justify-center gap-3 mb-3">
                                    {dayLabels.map((label, idx) => (
                                        <div
                                            key={idx}
                                            title={label}
                                            className={`w-4 h-8 rounded-sm flex items-end justify-center
                                                ${streakHistory[idx] ? 'bg-[#8a5cf5]' : 'bg-gray-200'}
                                            `}
                                            style={{
                                                opacity: streakHistory[idx] ? 1 : 0.5,
                                                border: streakHistory[idx] ? '2px solid #7738ea' : '2px solid #e5e7eb'
                                            }}
                                        >
                                            <span className="sr-only">{label}: {streakHistory[idx] ? 'Completed' : 'Not completed'}</span>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="flex justify-start gap-3 text-xs text-gray-400 font-medium w-full"
                                >
                                    {dayLabels.map((label, idx) => (
                                        <span key={idx} className="w-4 text-center">{label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 gap-6 xl:grid-cols-3 [@media(min-width:1230px)]:grid-cols-3'>
                    <MainContentLeftCol></MainContentLeftCol>
                    <MainContentRightCol></MainContentRightCol>
                </div>
            </div>
        </main>
    )
}

export default MainDashboardContent