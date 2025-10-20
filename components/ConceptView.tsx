import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Subject } from '../types';
import { generateConceptExplanation } from '../services/geminiService';
import Spinner from './common/Spinner';
import Button from './common/Button';
import { AlertCircleIcon } from './icons/AlertCircleIcon';
import { DumbbellIcon } from './icons/DumbbellIcon';

interface ConceptViewProps {
    subject: Subject;
    topic: Subject['topics'][0];
    onBack: () => void;
    onStartPractice: (concept: string) => void;
}

const ConceptView: React.FC<ConceptViewProps> = ({ subject, topic, onBack, onStartPractice }) => {
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExplanation = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const explanation = await generateConceptExplanation(topic.name);
                setContent(explanation);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplanation();
    }, [topic.name]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-lg border border-gray-200/80">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Generating explanation for <span className="font-bold">{topic.name}</span>...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center min-h-[300px] flex flex-col justify-center items-center p-6 bg-white rounded-lg border border-gray-200/80">
                    <AlertCircleIcon className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold mb-2">Error loading content</p>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            );
        }

        return (
            <div className="p-6 bg-white rounded-lg border border-gray-200/80">
                <ReactMarkdown
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 border-b pb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-800" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 pl-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 pl-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                        code: ({node, ...props}) => <code className="bg-gray-100 text-purple-700 font-mono text-sm px-1.5 py-0.5 rounded" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-200 bg-purple-50/50 p-4 italic text-purple-800 my-4 rounded-r-lg" {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                <div>
                     <Button variant="secondary" onClick={onBack} className="mb-4">
                        &larr; Back to {subject.name}
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">{topic.name}</h1>
                    <p className="text-gray-500">A detailed explanation to help you master this concept.</p>
                </div>
                 <Button onClick={() => onStartPractice(topic.name)} size="lg" className="flex-shrink-0 mt-4 sm:mt-10">
                    <DumbbellIcon className="w-5 h-5 mr-2" />
                    Practice this Topic
                </Button>
            </div>
            
            {renderContent()}
        </div>
    );
};

export default ConceptView;
