
import React, { useState, useEffect } from 'react';
import { LayoutGridIcon } from './icons/LayoutGridIcon.tsx';
import { BookCopyIcon } from './icons/BookCopyIcon.tsx';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon.tsx';
import { TrendingUpIcon } from './icons/TrendingUpIcon.tsx';
import { UserIcon } from './icons/UserIcon.tsx';
import { DumbbellIcon } from './icons/DumbbellIcon.tsx';
import MiniFocusTimer from './MiniFocusTimer.tsx';
import { ExamAceLogoIcon } from './icons/ExamAceLogoIcon.tsx';

type View = 'dashboard' | 'subjects' | 'study-plan' | 'practice' | 'analytics' | 'profile';

interface SidebarProps {
    view: View;
    setView: (view: View) => void;
    openGoalModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, openGoalModal }) => {
    const [logoBgClass, setLogoBgClass] = useState('bg-violet-600 shadow-violet-200');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) { // Morning
            setLogoBgClass('bg-sky-500 shadow-sky-200');
        } else if (hour >= 12 && hour < 18) { // Afternoon
            setLogoBgClass('bg-violet-600 shadow-violet-200');
        } else { // Evening/Night
            setLogoBgClass('bg-indigo-800 shadow-indigo-300');
        }
    }, []);


    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGridIcon },
        { id: 'practice', label: 'Practice', icon: DumbbellIcon },
        { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
        { id: 'study-plan', label: 'Study Plan', icon: CalendarDaysIcon },
        { id: 'subjects', label: 'Subjects', icon: BookCopyIcon },
        { id: 'profile', label: 'Profile', icon: UserIcon },
    ];

    const NavLink: React.FC<{
        item: typeof navItems[0],
        isActive: boolean,
        onClick: () => void
    }> = ({ item, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200/80">
            <div className="flex items-center h-20 px-4 border-b border-gray-200/80 flex-shrink-0">
                 <div className={`w-10 h-10 ${logoBgClass} rounded-lg flex items-center justify-center shadow-md transition-colors duration-500`}>
                    <ExamAceLogoIcon className="w-7 h-7 text-white" />
                 </div>
                 <div className="ml-3">
                    <span className="text-lg font-bold text-gray-800">ExamAce</span>
                    <p className="text-xs text-gray-500">Your AI Coach</p>
                 </div>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        item={item}
                        isActive={view === item.id}
                        onClick={() => setView(item.id as View)}
                    />
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200/80">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-violet-200 rounded-full flex items-center justify-center font-bold text-violet-700 text-base">
                        R
                    </div>
                    <div className="ml-3">
                        <p className="font-semibold text-sm text-gray-800">Ramya</p>
                        <button onClick={openGoalModal} className="text-xs text-gray-500 hover:text-purple-600 transition-colors focus:outline-none">
                            Set your goal
                        </button>
                    </div>
                </div>
                <MiniFocusTimer />
            </div>
        </div>
    );
};

export default Sidebar;