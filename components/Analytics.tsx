
import React, { useState, useEffect } from 'react';
import { QuizResult } from '../types.ts';
import Card from './common/Card.tsx';
import ScoreTrendChart from './ScoreTrendChart.tsx';
import SubjectAverageChart from './SubjectAverageChart.tsx';
import { AwardIcon } from './icons/AwardIcon.tsx';
import { TrendingUpIcon } from './icons/TrendingUpIcon.tsx';
import { BarChartIcon } from './icons/BarChartIcon.tsx';
import { TargetIcon } from './icons/TargetIcon.tsx';
import { TimerIcon } from './icons/TimerIcon.tsx';
import { MOCK_QUIZ_HISTORY } from '../constants.ts';

const StatCard: React.FC<{
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: string | number;
    iconColorClass: string;
}> = ({ icon: Icon, title, value, iconColorClass }) => {
    return (
        <Card className="p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center text-gray-500">
                <Icon className={`w-5 h-5 mr-2 ${iconColorClass}`} />
                <h3 className="font-medium text-sm">{title}</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </Card>
    );
};


const Analytics: React.FC = () => {
    const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

    useEffect(() => {
        // Use the globally defined mock history from constants.ts for consistency
        setQuizHistory(MOCK_QUIZ_HISTORY);
    }, []);

    const totalQuizzes = quizHistory.length;
    const averageScore = totalQuizzes > 0 
        ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes)
        : 0;

    const getWeakAreasCount = () => {
        if (totalQuizzes < 3) return 0; // Don't calculate for small sample size
        const subjectAverages: { [key: string]: { totalScore: number; count: number } } = {};
        quizHistory.forEach(result => {
            if (!subjectAverages[result.subject]) {
                subjectAverages[result.subject] = { totalScore: 0, count: 0 };
            }
            subjectAverages[result.subject].totalScore += result.score;
            subjectAverages[result.subject].count += 1;
        });

        const averages = Object.values(subjectAverages).map(subject => 
            Math.round(subject.totalScore / subject.count)
        );

        return averages.filter(avg => avg < 70).length;
    };
    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-gray-500 mt-1">Track your progress and identify areas for improvement.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard icon={BarChartIcon} title="Overall Average" value={`${averageScore}%`} iconColorClass="text-violet-500" />
                 <StatCard icon={TargetIcon} title="Quizzes Taken" value={totalQuizzes} iconColorClass="text-blue-500" />
                 <StatCard icon={TimerIcon} title="Study Time" value="0h" iconColorClass="text-green-500" />
                 <StatCard icon={AwardIcon} title="Weak Areas" value={getWeakAreasCount()} iconColorClass="text-orange-500" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUpIcon className="w-5 h-5 mr-3 text-gray-400" />
                        Score Trend (Last 10 Quizzes)
                    </h2>
                    <div className="h-80">
                        <ScoreTrendChart data={quizHistory.slice(-10)} />
                    </div>
                </Card>
                 <Card>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <BarChartIcon className="w-5 h-5 mr-3 text-gray-400" />
                        Average by Subject
                    </h2>
                    <div className="h-80">
                        <SubjectAverageChart data={quizHistory} />
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default Analytics;