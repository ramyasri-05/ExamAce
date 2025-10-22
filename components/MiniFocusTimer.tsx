
import React, { useState, useEffect, useRef } from 'react';
import { TimerIcon } from './icons/TimerIcon.tsx';
import { PlayIcon } from './icons/PlayIcon.tsx';
import { PauseIcon } from './icons/PauseIcon.tsx';
import Button from './common/Button.tsx';

const MiniFocusTimer: React.FC = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                if (seconds > 0) {
                    setSeconds(s => s - 1);
                } else if (minutes > 0) {
                    setMinutes(m => m - 1);
                    setSeconds(59);
                } else {
                    // Timer finished
                    setIsActive(false);
                    // Optionally play a sound or show a notification
                    alert("Time's up! Take a break.");
                    resetTimer();
                }
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, seconds, minutes]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(25);
        setSeconds(0);
    };

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <TimerIcon className="w-5 h-5 text-gray-500" />
                    <h4 className="font-semibold text-gray-700">Focus Timer</h4>
                </div>
                <div className="text-xl font-mono font-bold text-gray-800">
                    {formatTime(minutes)}:{formatTime(seconds)}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button onClick={toggleTimer} size="sm" className="w-full">
                    {isActive ? <><PauseIcon className="w-4 h-4 mr-1" />Pause</> : <><PlayIcon className="w-4 h-4 mr-1" />Start</>}
                </Button>
                <Button onClick={resetTimer} variant="secondary" size="sm">
                    Reset
                </Button>
            </div>
        </div>
    );
};

export default MiniFocusTimer;