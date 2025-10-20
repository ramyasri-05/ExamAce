import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { InfoIcon } from './icons/InfoIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ActivityIcon } from './icons/ActivityIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlayIcon } from './icons/PlayIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { SunIcon } from './icons/SunIcon';
import { TimerIcon } from './icons/TimerIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { TargetIcon } from './icons/TargetIcon';
import { FlameIcon } from './icons/FlameIcon';
import { MOCK_QUIZ_HISTORY, MOCK_SUBJECTS } from '../constants';
import { generateFocusItems } from '../services/geminiService';
import { QuizResult, Subject } from '../types';
import { View } from '../App';

const priorityStyles: { [key: string]: string } = {
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
    medium: 'bg-blue-100 text-blue-700',
};

const FocusItemSkeleton: React.FC = () => (
    <div className="flex items-center justify-between py-4 animate-pulse">
        <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-200 mr-4"></div>
            <div>
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
    </div>
);

const subjectIconMap = MOCK_SUBJECTS.reduce((acc, subject) => {
    acc[subject.name] = subject.icon;
    return acc;
}, {} as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>);


interface DashboardProps {
    setView: (view: View) => void;
    studyTimeToday: number;
    dailyGoal: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, studyTimeToday, dailyGoal }) => {
    const [greeting, setGreeting] = useState('');
    const [accuracy, setAccuracy] = useState(0);
    const [studyStreak, setStudyStreak] = useState(0);
    const [focusItems, setFocusItems] = useState<{ text: string; priority: string }[]>([]);
    const [isFocusLoading, setIsFocusLoading] = useState(true);
    const [weakAreas, setWeakAreas] = useState<string[]>([]);
    const [recentActivity, setRecentActivity] = useState<QuizResult[]>([]);

    useEffect(() => {
        // --- Set Greeting ---
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // --- Calculate Stats ---
        const last10Quizzes = MOCK_QUIZ_HISTORY.slice(-10);
        if (last10Quizzes.length > 0) {
            const totalScore = last10Quizzes.reduce((acc, q) => acc + q.score, 0);
            setAccuracy(Math.round(totalScore / last10Quizzes.length));
        }

        const activityDates = [...new Set(MOCK_QUIZ_HISTORY.map(q => new Date(q.date).toDateString()))]
            .map(d => new Date(d).setHours(0,0,0,0))
            .sort((a, b) => b - a);

        if (activityDates.length > 0) {
            let streak = 0;
            const today = new Date().setHours(0,0,0,0);
            const lastDay = activityDates[0];
            if ((today - lastDay) / (1000 * 3600 * 24) <= 1) {
                streak = 1;
                for (let i = 0; i < activityDates.length - 1; i++) {
                    const dayDiff = (activityDates[i] - activityDates[i+1]) / (1000 * 3600 * 24);
                    if (dayDiff === 1) streak++;
                    else break;
                }
            }
            setStudyStreak(streak);
        }

        // --- Calculate Weak Areas ---
        const subjectStats: { [key: string]: { total: number; count: number } } = {};
        MOCK_QUIZ_HISTORY.forEach(q => {
          if (!subjectStats[q.subject]) subjectStats[q.subject] = { total: 0, count: 0 };
          subjectStats[q.subject].total += q.score;
          subjectStats[q.subject].count++;
        });
        const calculatedWeakAreas = Object.entries(subjectStats)
          .map(([name, data]) => ({ name, avg: data.total / data.count }))
          .filter(s => s.avg < 75)
          .map(s => s.name);
        setWeakAreas(calculatedWeakAreas);
        
        // --- Get Recent Activity ---
        setRecentActivity(MOCK_QUIZ_HISTORY.slice().reverse().slice(0, 3));


        // --- Generate Focus Items ---
        const fetchFocusItems = async () => {
            setIsFocusLoading(true);
            const items = await generateFocusItems(MOCK_QUIZ_HISTORY);
            setFocusItems(items);
            setIsFocusLoading(false);
        };
        fetchFocusItems();

    }, []);

    const studyMinutesToday = Math.floor(studyTimeToday / 60);
    const studyProgressPercent = dailyGoal > 0 ? (studyMinutesToday / dailyGoal) * 100 : 0;
    const bannerProgressPercent = dailyGoal > 0 ? (studyMinutesToday / dailyGoal) * 100 : 0;

    return (
        <div className="space-y-6">
             {/* Welcome Banner */}
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 p-8 text-white overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                 <div className="absolute -bottom-16 -left-10 w-52 h-52 bg-white/10 rounded-full"></div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <SunIcon className="w-8 h-8 text-yellow-300" />
                        <h1 className="text-3xl font-bold">{greeting}, Ramya!</h1>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                        <SparklesIcon className="w-4 h-4" />
                        <p>Ready to ace your exam?</p>
                    </div>

                    <div className="mt-8 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Today's Progress</span>
                            <span className="text-sm font-medium">{studyMinutesToday} / {dailyGoal} min</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full" style={{ width: `${bannerProgressPercent > 100 ? 100 : bannerProgressPercent}%` }}></div>
                        </div>
                         <p className="text-xs text-white/80 mt-1.5">{Math.max(0, dailyGoal - studyMinutesToday)} minutes to reach your daily goal</p>
                    </div>
                </div>
            </div>

            {/* Top Stats Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-5">
                    <div className="flex items-center text-gray-500">
                        <div className="p-2 bg-violet-100 rounded-full mr-3">
                            <TimerIcon className="w-5 h-5 text-violet-600" />
                        </div>
                        <h3 className="font-medium text-sm">Today's Study</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-3">{studyMinutesToday} min</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${studyProgressPercent > 100 ? 100 : studyProgressPercent}%` }}></div>
                    </div>
                </Card>
                <Card className="p-5">
                    <div className="flex items-center text-gray-500">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <TrophyIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-sm">Total Hours</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-3">12.5 hrs</p>
                    <p className="text-xs text-gray-500 mt-2">Keep going!</p>
                </Card>
                <Card className="p-5">
                    <div className="flex items-center text-gray-500">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                            <TargetIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium text-sm">Accuracy</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-3">{accuracy}%</p>
                    <p className="text-xs text-gray-500 mt-2">Last 10 quizzes</p>
                </Card>
                <Card className="p-5 bg-gradient-to-br from-orange-500 to-red-400 text-white">
                     <div className="flex items-center text-white/90">
                        <div className="p-2 bg-white/20 rounded-full mr-3">
                            <FlameIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-medium text-sm">Study Streak</h3>
                    </div>
                    <p className="text-3xl font-bold mt-3">{studyStreak} days</p>
                    <p className="text-xs text-white/90 mt-2">{studyStreak > 0 ? "Keep the flame alive!" : "Start your streak today!"}</p>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 p-6">
                    <div className="flex items-center mb-4">
                        <InfoIcon className="w-6 h-6 text-gray-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Today's Focus</h2>
                    </div>
                     <div className="divide-y divide-gray-200/80">
                        {isFocusLoading ? (
                            <>
                                <FocusItemSkeleton />
                                <FocusItemSkeleton />
                                <FocusItemSkeleton />
                            </>
                        ) : (
                            focusItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50/50 transition-colors first:pt-0 last:pb-0">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.text}</p>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block ${priorityStyles[item.priority]}`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center mb-5">
                        <AlertTriangleIcon className="w-6 h-6 text-orange-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Areas to Focus</h2>
                    </div>
                    {weakAreas.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 font-medium">No weak areas identified yet!</p>
                            <p className="text-sm text-gray-400 mt-1">Keep practicing to find personalized insights</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {weakAreas.map(area => (
                                <div key={area} className="p-3 bg-orange-50 rounded-lg flex items-center justify-between">
                                    <span className="font-medium text-orange-800">{area}</span>
                                    <Button size="sm" variant="secondary" className="!text-xs !py-1 !px-2">Review</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="lg:col-span-3 p-6">
                    <div className="flex items-center mb-5">
                        <ActivityIcon className="w-6 h-6 text-blue-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                    </div>
                    {recentActivity.length === 0 ? (
                         <div className="text-center py-8">
                            <p className="text-gray-600 font-medium">No activity yet!</p>
                            <p className="text-sm text-gray-400 mt-1">Start practicing to see your progress</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                           {recentActivity.map((activity, index) => {
                               const Icon = subjectIconMap[activity.subject] || BarChartIcon;
                               return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-full mr-4">
                                            <Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{activity.subject}: <span className="font-normal text-gray-600">{activity.topic}</span></p>
                                            <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-lg ${activity.score > 75 ? 'text-green-600' : 'text-orange-600'}`}>{activity.score}%</div>
                                </div>
                               )
                           })}
                        </div>
                    )}
                </Card>

                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center mb-5">
                        <SparklesIcon className="w-6 h-6 text-violet-500 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
                    </div>
                    <div className="space-y-3">
                        <Button onClick={() => setView('practice')} variant="gradient" className="w-full justify-between !py-3 !px-4 text-base">
                            <span>Start Adaptive Practice</span>
                            <PlayIcon className="w-5 h-5 fill-white" />
                        </Button>
                        <button onClick={() => setView('analytics')} className="flex items-center justify-between w-full p-3 text-left border border-gray-200/80 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-700">View Detailed Analytics</span>
                            <BarChartIcon className="w-5 h-5 text-gray-400" />
                        </button>
                        <button onClick={() => setView('study-plan')} className="flex items-center justify-between w-full p-3 text-left border border-gray-200/80 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-gray-700">Plan Your Week</span>
                            <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;