
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Question } from '../types.ts';
import { generateConceptQuiz, generateConceptExplanation } from '../services/geminiService.ts';
import Button from './common/Button.tsx';
import Spinner from './common/Spinner.tsx';
import Card from './common/Card.tsx';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon.tsx';
import { AlertCircleIcon } from './icons/AlertCircleIcon.tsx';

type PracticeState = 'input' | 'loadingExplanation' | 'explanation' | 'loadingQuiz' | 'quiz' | 'results' | 'error';

interface PracticeProps {
    initialConcept?: string;
    clearInitialConcept?: () => void;
}

const Practice: React.FC<PracticeProps> = ({ initialConcept, clearInitialConcept }) => {
    const [practiceState, setPracticeState] = useState<PracticeState>('input');
    const [concept, setConcept] = useState('');
    const [explanation, setExplanation] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Quiz state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);

    // Results state
    const [score, setScore] = useState(0);
    const [finalAnswers, setFinalAnswers] = useState<{ question: string; selected: string; correct: string; }[]>([]);

    const handleGenerateExplanation = async (conceptToUse?: string) => {
        const currentConcept = conceptToUse || concept;
        if (!currentConcept.trim()) return;
        setConcept(currentConcept);

        setPracticeState('loadingExplanation');
        setError(null);
        try {
            const generatedExplanation = await generateConceptExplanation(currentConcept);
            if (generatedExplanation) {
                setExplanation(generatedExplanation);
                setPracticeState('explanation');
            } else {
                setError("Could not generate an explanation for this concept. Please try another one.");
                setPracticeState('error');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the explanation. Please try again.');
            setPracticeState('error');
        }
    };

    const handleGenerateQuiz = async () => {
        if (!concept.trim()) return;

        // Reset quiz-specific state before starting a new one
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setUserAnswers([]);

        setPracticeState('loadingQuiz');
        setError(null);
        try {
            const quizQuestions = await generateConceptQuiz(concept, 10);
            if (quizQuestions.length > 0) {
                setQuestions(quizQuestions);
                setPracticeState('quiz');
            } else {
                setError("Could not generate a quiz for this concept. It might be too broad or specific. Please try another one.");
                setPracticeState('error');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the quiz. Please try again.');
            setPracticeState('error');
        }
    };
    
    useEffect(() => {
        if (initialConcept && clearInitialConcept) {
            handleGenerateExplanation(initialConcept);
            clearInitialConcept();
        }
    }, [initialConcept]);
    
    const handleNextQuestion = () => {
        if (selectedAnswer) {
            const newAnswers = [...userAnswers, selectedAnswer];
            setUserAnswers(newAnswers);
            setSelectedAnswer(null);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // Finish quiz and show results
                const finalScore = newAnswers.reduce((acc, answer, index) => {
                    return answer === questions[index].correctAnswer ? acc + 1 : acc;
                }, 0) / questions.length * 100;
                
                setScore(Math.round(finalScore));
                setFinalAnswers(questions.map((q, i) => ({
                    question: q.question,
                    selected: newAnswers[i],
                    correct: q.correctAnswer,
                })));

                setPracticeState('results');
            }
        }
    };

    const handleRestart = () => {
        setPracticeState('input');
        setConcept('');
        setExplanation('');
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setUserAnswers([]);
        setScore(0);
        setFinalAnswers([]);
        setError(null);
    };

    const renderInputView = () => (
        <Card>
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Explore Any Topic</h2>
                <p className="text-gray-600 mb-6">Enter a topic you want to learn about. We'll provide an explanation, and then you can test your knowledge.</p>
                <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., 'Photosynthesis' or 'The Cold War'"
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-white"
                />
                <Button onClick={() => handleGenerateExplanation()} disabled={!concept.trim()} size="lg" className="mt-4">
                    Learn About Topic
                </Button>
            </div>
        </Card>
    );

    const renderLoadingView = () => (
        <div className="flex flex-col items-center justify-center h-64">
            <Spinner />
            <p className="mt-4 text-gray-600 text-center whitespace-pre-line">
                {practiceState === 'loadingExplanation' 
                    ? `Generating an explanation for` 
                    : `Generating your quiz on`}
                <br/>
                <span className="font-bold">{concept}</span>...
            </p>
        </div>
    );
    
    const renderErrorView = () => (
        <div className="text-center">
            <AlertCircleIcon className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold">{error}</p>
            <Button onClick={handleRestart} className="mt-6">
                Try Another Concept
            </Button>
        </div>
    );

    const renderExplanationView = () => (
        <div>
            <Card className="mb-6">
                 <div className="p-6">
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
                        {explanation}
                    </ReactMarkdown>
                </div>
            </Card>
            <div className="text-center">
                <p className="text-gray-600 mb-4">Feel like you understand the topic? Test your knowledge!</p>
                <Button onClick={handleGenerateQuiz} size="lg" variant="gradient">
                    Generate Quiz
                </Button>
            </div>
        </div>
    );

    const renderQuizView = () => {
        if (!questions.length) return renderErrorView();
        const currentQuestion = questions[currentQuestionIndex];
        return (
             <Card>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                    selectedAnswer === option
                                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-300'
                                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </Button>
                    </div>
                </div>
            </Card>
        );
    };

    const renderResultsView = () => (
        <div className="max-w-4xl mx-auto">
            <Card className="mb-8 text-center">
                <p className="text-gray-600">You scored</p>
                <p className="text-6xl font-bold text-purple-600 my-2">{score}%</p>
                <p className="text-gray-600">on the "{concept}" quiz. Review your answers below.</p>
            </Card>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Answers</h2>
            <div className="space-y-4">
                {finalAnswers.map((answer, index) => (
                    <Card key={index} className={answer.selected === answer.correct ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}>
                        <p className="font-semibold text-gray-800 mb-2">{index + 1}. {answer.question}</p>
                        <p className={`text-sm ${answer.selected === answer.correct ? 'text-green-800' : 'text-red-800'}`}>
                            Your answer: <span className="font-bold">{answer.selected}</span>
                             {answer.selected !== answer.correct && ` (Correct: ${answer.correct})`}
                        </p>
                    </Card>
                ))}
            </div>
            <div className="mt-8 text-center">
                <Button onClick={handleRestart} size="lg">
                    Practice Another Concept
                </Button>
            </div>
        </div>
    );
    
    const renderContent = () => {
        switch(practiceState) {
            case 'input': return renderInputView();
            case 'loadingExplanation': return renderLoadingView();
            case 'explanation': return renderExplanationView();
            case 'loadingQuiz': return renderLoadingView();
            case 'quiz': return renderQuizView();
            case 'results': return renderResultsView();
            case 'error': return renderErrorView();
            default: return renderInputView();
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
              <BrainCircuitIcon className="w-12 h-12 text-purple-600 mx-auto mb-2"/>
              <h1 className="text-3xl font-bold text-gray-900">Practice Zone</h1>
              <p className="text-gray-500 mt-1">Learn any concept, then test your knowledge.</p>
          </header>
          {renderContent()}
        </div>
    );
};

export default Practice;