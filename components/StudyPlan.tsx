import React, { useState, useEffect, useRef } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { TargetIcon } from './icons/TargetIcon';
import { DailyGoalIcon } from './icons/DailyGoalIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

interface StudyPlanProps {
    studyTimeToday: number;
    setStudyTimeToday: React.Dispatch<React.SetStateAction<number>>;
    dailyGoal: number;
    setDailyGoal: (goal: number) => void;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ studyTimeToday, setStudyTimeToday, dailyGoal, setDailyGoal }) => {
    // Timer State
    const [time, setTime] = useState(0); // in seconds
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    // Daily Goal State
    const [goalInput, setGoalInput] = useState(dailyGoal.toString());

    useEffect(() => {
        setGoalInput(dailyGoal.toString());
    }, [dailyGoal]);
    
    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isActive && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds]
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    const handleStartStop = () => {
        // When pausing the timer, save the current session's time and reset it.
        if (isActive) {
            setStudyTimeToday(current => current + time);
            setTime(0);
        }
        setIsActive(!isActive);
    };
    
    const handleUpdateGoal = () => {
        const newGoal = parseInt(goalInput, 10);
        if (!isNaN(newGoal) && newGoal > 0) {
            setDailyGoal(newGoal);
        } else {
            setGoalInput(dailyGoal.toString());
        }
    }

    const progressInMinutes = Math.floor(studyTimeToday / 60);
    const progressPercentage = dailyGoal > 0 ? (progressInMinutes / dailyGoal) * 100 : 0;
    const minutesRemaining = Math.max(0, dailyGoal - progressInMinutes);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Study Planner</h1>
                <p className="text-gray-500 mt-1">Manage your time and stay focused on your goals</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Focus Timer */}
                <div className="lg:col-span-3">
                    <div className="relative rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white h-full flex flex-col justify-between shadow-lg shadow-purple-200">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <TargetIcon className="w-6 h-6" />
                                <h2 className="text-xl font-semibold">Focus Timer</h2>
                            </div>
                            <div className="text-center">
                                <p className="text-7xl font-bold font-mono tracking-wider">{formatTime(time)}</p>
                                <p className="text-white/80 mt-2">Time spent on current session</p>
                            </div>
                        </div>
                        <div className="mt-8">
                             <Button variant="primary-light" size="lg" onClick={handleStartStop} className="w-full">
                                {isActive ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2 fill-purple-700" />}
                                {isActive ? 'Pause Session' : 'Start Focus Session'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Daily Goal & Quick Stats */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <DailyGoalIcon className="w-6 h-6 text-gray-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Daily Goal</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Minutes per day</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="number"
                                        value={goalInput}
                                        onChange={(e) => setGoalInput(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-white"
                                    />
                                    <Button variant="orange" size="sm" onClick={handleUpdateGoal} className="!px-4 !py-2">Update</Button>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-600">Today's Progress</span>
                                    <span className="text-sm font-medium text-gray-800">{progressInMinutes} / {dailyGoal} min</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">{minutesRemaining > 0 ? `${minutesRemaining} minutes remaining` : 'Goal reached!'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                         <div className="flex items-center space-x-3 mb-4">
                            <TrendingUpIcon className="w-6 h-6 text-gray-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Quick Stats</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-violet-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700">Today's Study Hours</span>
                                <span className="font-bold text-lg text-violet-700">{(studyTimeToday / 3600).toFixed(1)}h</span>
                            </div>
                            <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700">Study Streak</span>
                                <span className="font-bold text-lg text-orange-700">0 days</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <CalendarDaysIcon className="w-6 h-6 text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Today's Sessions</h2>
                </div>
                <div className="text-center py-12">
                    <p className="text-gray-500">No study sessions recorded today</p>
                </div>
            </Card>
        </div>
    );
};

export default StudyPlan;