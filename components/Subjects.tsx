
import React, { useState } from 'react';
import { MOCK_SUBJECTS, MOCK_QUIZ_HISTORY } from '../constants.ts';
import { Subject } from '../types.ts';
import Card from './common/Card.tsx';
import { ChevronRightIcon } from './icons/ChevronRightIcon.tsx';
import Button from './common/Button.tsx';
import { BookCopyIcon } from './icons/BookCopyIcon.tsx';
import ConceptView from './ConceptView.tsx';
import Chatbot from './Chatbot.tsx';
import { MessageCircleIcon } from './icons/MessageCircleIcon.tsx';

interface SubjectsProps {
    onStartPractice: (concept: string) => void;
}

const Subjects: React.FC<SubjectsProps> = ({ onStartPractice }) => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Subject['topics'][0] | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleSelectTopic = (topic: Subject['topics'][0]) => {
        setSelectedTopic(topic);
    };

    if (selectedSubject && selectedTopic) {
        return (
            <ConceptView 
                subject={selectedSubject}
                topic={selectedTopic}
                onBack={() => setSelectedTopic(null)}
                onStartPractice={onStartPractice}
            />
        );
    }

    if (selectedSubject) {
        return (
            <div>
                <Button variant="secondary" onClick={() => setSelectedSubject(null)} className="mb-6">
                    &larr; Back to Subjects
                </Button>
                <header className="mb-8">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex items-center mb-2">
                            <selectedSubject.icon className="w-10 h-10 text-purple-600 mr-4"/>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{selectedSubject.name}</h1>
                                <p className="text-gray-500 mt-1">{selectedSubject.description}</p>
                            </div>
                        </div>
                         <Button onClick={() => setIsChatOpen(true)}>
                            <MessageCircleIcon className="w-5 h-5 mr-2" />
                            Chat with AI Tutor
                        </Button>
                    </div>
                </header>
                <Card className="p-0">
                    <h2 className="text-xl font-semibold text-gray-800 p-6 pb-2">Topics</h2>
                    <div className="divide-y divide-gray-200/80">
                        {selectedSubject.topics.map(topic => (
                             <button 
                                key={topic.id} 
                                onClick={() => handleSelectTopic(topic)}
                                className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-lg">{topic.name}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 max-w-xs">
                                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: `${topic.mastery}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-right ml-4 flex items-center">
                                    <div>
                                        <p className="text-xl font-bold text-purple-600">{topic.mastery}%</p>
                                        <p className="text-xs text-gray-500">Mastery</p>
                                    </div>
                                    <ChevronRightIcon className="w-6 h-6 text-gray-400 ml-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
                {isChatOpen && (
                    <Chatbot 
                        subjectName={selectedSubject.name}
                        onClose={() => setIsChatOpen(false)}
                        quizHistory={MOCK_QUIZ_HISTORY}
                    />
                )}
            </div>
        );
    }
    
    return (
        <div>
            <header className="mb-8 text-center">
              <BookCopyIcon className="w-12 h-12 text-purple-600 mx-auto mb-2"/>
              <h1 className="text-3xl font-bold text-gray-900">Your Subjects</h1>
              <p className="text-gray-500 mt-1">Explore topics and track your mastery.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_SUBJECTS.map(subject => (
                    <Card key={subject.id} className="p-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                        <button onClick={() => setSelectedSubject(subject)} className="w-full text-left p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                        <subject.icon className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{subject.name}</h3>
                                        <p className="text-sm text-gray-500">{subject.topics.length} topics</p>
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Subjects;