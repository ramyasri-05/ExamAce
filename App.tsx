import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Subjects from './components/Subjects';
import StudyPlan from './components/StudyPlan';
import Practice from './components/Practice';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Login from './components/Login';
import SetGoalModal from './components/SetGoalModal';

export type View = 'dashboard' | 'subjects' | 'study-plan' | 'practice' | 'analytics' | 'profile';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [practiceConcept, setPracticeConcept] = useState<string | undefined>();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [studyTimeToday, setStudyTimeToday] = useState(0); // in seconds
    const [dailyGoal, setDailyGoal] = useState(121); // in minutes
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const handleStartPractice = (concept: string) => {
        setPracticeConcept(concept);
        setView('practice');
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setView('dashboard');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    const renderView = () => {
        switch(view) {
            case 'dashboard':
                return <Dashboard setView={setView} studyTimeToday={studyTimeToday} dailyGoal={dailyGoal} />;
            case 'subjects':
                return <Subjects onStartPractice={handleStartPractice} />;
            case 'study-plan':
                return <StudyPlan 
                            studyTimeToday={studyTimeToday} 
                            setStudyTimeToday={setStudyTimeToday} 
                            dailyGoal={dailyGoal}
                            setDailyGoal={setDailyGoal}
                       />;
            case 'practice':
                return <Practice 
                            initialConcept={practiceConcept} 
                            clearInitialConcept={() => setPracticeConcept(undefined)} 
                       />;
            case 'analytics':
                return <Analytics />;
            case 'profile':
                return <Profile onLogout={handleLogout} />;
            default:
                return <Dashboard setView={setView} studyTimeToday={studyTimeToday} dailyGoal={dailyGoal} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <div className="w-64 flex-shrink-0">
                <Sidebar 
                    view={view} 
                    setView={setView} 
                    openGoalModal={() => setIsGoalModalOpen(true)}
                />
            </div>
            <main className="flex-1 overflow-y-auto p-8">
                {renderView()}
            </main>
            {isGoalModalOpen && (
                <SetGoalModal 
                    currentGoal={dailyGoal}
                    onClose={() => setIsGoalModalOpen(false)}
                    onSave={(newGoal) => {
                        setDailyGoal(newGoal);
                        setIsGoalModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default App;