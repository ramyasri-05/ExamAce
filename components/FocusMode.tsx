import React, { useState, useEffect, useRef } from 'react';
import Button from './common/Button';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SaveIcon } from './icons/SaveIcon';
import { XIcon } from './icons/XIcon';
import { View } from '../App';

interface FocusModeProps {
    setStudyTimeToday: React.Dispatch<React.SetStateAction<number>>;
    setView: (view: View) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ setStudyTimeToday, setView }) => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

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
        setIsActive(!isActive);
    };

    const handleSaveAndExit = () => {
        setStudyTimeToday(current => current + time);
        setView('study-plan');
    };

    const handleExit = () => {
        if (time > 0 && isActive) {
            if (window.confirm("You have an active session. Are you sure you want to exit without saving?")) {
                setView('study-plan');
            }
        } else {
            setView('study-plan');
        }
    };
    
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-center">
             <button onClick={handleExit} className="absolute top-6 right-6 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <XIcon className="w-6 h-6" />
             </button>
            <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200/80 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800">Focus Session</h1>
                <p className="text-gray-500 mt-2 mb-8">Eliminate distractions and concentrate on your studies.</p>
                
                <div className="my-10">
                    <p className="text-8xl font-bold font-mono tracking-wider text-gray-900">{formatTime(time)}</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <Button 
                        onClick={handleStartStop} 
                        size="lg" 
                        variant="gradient"
                        className="w-48 !py-4 text-lg"
                    >
                        {isActive ? <PauseIcon className="w-6 h-6 mr-2" /> : <PlayIcon className="w-6 h-6 mr-2 fill-white" />}
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button 
                        onClick={handleSaveAndExit}
                        disabled={time === 0} 
                        size="lg" 
                        variant="secondary"
                        className="w-48 !py-4 text-lg"
                    >
                        <SaveIcon className="w-6 h-6 mr-2" />
                        Save & Exit
                    </Button>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-6">"The secret of success is to do the common thing uncommonly well." - John D. Rockefeller Jr.</p>
        </div>
    );
};

export default FocusMode;
