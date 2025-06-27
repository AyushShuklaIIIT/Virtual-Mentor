import React, { useRef, useState, useEffect } from 'react'
import '../App.css'
import DownButton from './PomodoroButtons/DownButton';
import UpButton from './PomodoroButtons/UpButton';

const circumference = 2 * Math.PI * 45;
const PomodoroTimer = () => {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [isSession, setIsSession] = useState(true);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const audioRef = useRef();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const totalTime = isSession ? sessionLength * 60 : breakLength * 60;
        const pro = ((totalTime - timeLeft) / totalTime) * 100;
        setProgress(pro);
    }, [sessionLength, breakLength, timeLeft, isSession])

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 0) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.volume = 1;
                        audioRef.current.play();
                        const newtime = isSession ? breakLength * 60 : sessionLength * 60;
                        setIsSession(!isSession);
                        return newtime;
                    }
                    return prev - 1;
                })
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current);
        }
    }, [isRunning, isSession]);

    const formatTime = (secs) => {
        const m = String(Math.floor(secs / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const reset = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        clearInterval(timerRef.current);
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setIsRunning(false);
        setIsSession(true);
    }

    return (
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
            <h3 className='font-semibold text-lg mb-4'>Pomodoro Timer</h3>
            <div className='flex justify-around w-full mb-6'>
                <div className='flex flex-col items-center'>
                    <p className='text-sm text-gray-500 font-medium mb-2'>Break Length</p>
                    <div className='flex items-center space-x-2'>
                        <DownButton onClick={() => {
                            if(breakLength > 1) setBreakLength(prev => prev - 1);
                        }}></DownButton>
                        <span className='w-8 text-center font-semibold'>{breakLength}</span>
                        <UpButton onClick={() => setBreakLength(prev => prev + 1)}></UpButton>
                    </div>
                </div>

                <div className='flex flex-col items-center'>
                    <p className='text-sm text-gray-500 font-medium mb-2'>Session Length</p>
                    <div className='flex items-center space-x-2'>
                        <DownButton onClick={() => {
                            if(sessionLength > 1) {
                                setSessionLength(prev => prev - 1);
                                if(!isRunning && isSession) {
                                    setTimeLeft((sessionLength - 1) * 60);
                                }
                            }
                        }}></DownButton>
                        <span className='w-8 text-center font-semibold'>{sessionLength}</span>
                        <UpButton onClick={() => {
                            setSessionLength(prev => prev + 1);
                            if(!isRunning && isSession) {
                                setTimeLeft((sessionLength + 1) * 60);
                            }
                        }}></UpButton>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div className='relative w-48 h-48 mb-4'>
                    <svg className='w-full h-full' viewBox='0 0 100 100'>
                        <circle cx={50} cy={50} r={45} fill='none' stroke='#e2e8f0' strokeWidth={8} />
                        <circle id='pomodoro-progress' className='pomodoro-progress' cx={50} cy={50} r={45} fill='none' stroke='url(#pomodoro-gradient)' strokeWidth={8} strokeDasharray={circumference} strokeDashoffset={(1 - progress / 100) * circumference} style={{transition: 'stroke-dashoffset 0.5s ease', transform: 'rotate(-90deg),', transformOrigin: 'center'}} />
                        <defs>
                            <linearGradient id='pomodoro-gradient' x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor='#0068c6' />
                                <stop offset="100%" stopColor='#6627cc' />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='text-center'>
                            <p id='timer-display' className='text-3xl font-bold'>{formatTime(timeLeft)}</p>
                            <p className='text-[#64748b] text-sm'>{isSession ? "Focus" : "Break"} Time</p>
                            <audio src="/alarm.mp3" ref={audioRef} id="beep">
                                <track kind="captions" srcLang="en" label="English captions" />
                            </audio>
                        </div>
                    </div>
                </div>

                <div className='flex space-x-3'>
                    <button id='start-stop-timer' className='px-4 py-2 bg-[#7738ea] text-white rounded-lg hover:bg-[#6627cc] transition-colors duration-200 disabled:bg-gray-200 disabled:text-[#475569] disabled:hover:bg-gray-300' onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Stop" : "Start"}</button>
                    <button id='reset-timer' className='px-4 py-2 bg-[#7738ea] text-white rounded-lg hover:bg-[#6627cc] transition-colors duration-200 disabled:bg-gray-200 disabled:text-[#475569] disabled:hover:bg-gray-300' onClick={reset}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default PomodoroTimer
