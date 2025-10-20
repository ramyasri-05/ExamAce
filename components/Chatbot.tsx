import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { QuizResult } from '../types';
import { startChatSession, generateImageFromPrompt } from '../services/geminiService';
import type { Chat } from '../services/geminiService';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface ChatbotProps {
    subjectName: string;
    onClose: () => void;
    quizHistory: QuizResult[];
}

interface Message {
    role: 'user' | 'model';
    text: string;
    imageUrl?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ subjectName, onClose, quizHistory }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'chat' | 'history'>('chat');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatHistoryKey = `chatHistory_${subjectName}`;

    useEffect(() => {
        const chatSession = startChatSession(subjectName, quizHistory);
        setChat(chatSession);

        try {
            const savedHistory = localStorage.getItem(chatHistoryKey);
            if (savedHistory) {
                setMessages(JSON.parse(savedHistory));
            } else {
                setMessages([{ role: 'model', text: `Hello! I'm your AI tutor for ${subjectName}. How can I help you prepare today?` }]);
            }
        } catch (error) {
            console.error("Failed to load chat history:", error);
            setMessages([{ role: 'model', text: `Hello! I'm your AI tutor for ${subjectName}. How can I help you prepare today?` }]);
        }
    }, [subjectName, quizHistory]);

    const handleClose = () => {
        try {
            // Don't save if there's only the initial greeting
            if (messages.length > 1) {
                localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
            }
        } catch (error) {
            console.error("Failed to save chat history:", error);
        }
        onClose();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (view === 'chat') {
            scrollToBottom();
        }
    }, [messages, view]);

    const imageGenRegex = /\[generate_image:\s*(.*?)\]/g;

    const handleSend = async () => {
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        const currentInput = input;
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            let modelResponse = '';
            let currentModelMessageIndex = messages.length + 1; // Correct index for the new message
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[currentModelMessageIndex] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }

            // After streaming, process for image generation
            const imagePrompts = [...modelResponse.matchAll(imageGenRegex)].map(match => match[1]);
            if (imagePrompts.length > 0) {
                 const cleanedText = modelResponse.replace(imageGenRegex, '').trim();
                 setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[currentModelMessageIndex] = { role: 'model', text: cleanedText || 'Here is the image you requested:'};
                    return newMessages;
                });

                // Generate images sequentially
                for (const prompt of imagePrompts) {
                    setIsLoading(true); // Show loading for image generation
                    const imageUrl = await generateImageFromPrompt(prompt);
                    if (imageUrl) {
                        const imageMessage: Message = { role: 'model', text: '', imageUrl };
                        setMessages(prev => [...prev, imageMessage]);
                    }
                }
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderMessageContent = (msg: Message, index: number) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-xs md:max-w-sm ${
                msg.role === 'user' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
                {msg.text && (
                    <div className="prose prose-sm prose-p:my-0">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                )}
                {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="Generated by AI" className="mt-2 rounded-lg" />
                )}
            </div>
        </div>
    );
    
    const renderChatView = () => (
        <>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(renderMessageContent)}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="p-3 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-white"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors flex-shrink-0">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
    
    const renderHistoryView = () => (
         <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length > 1 
                ? messages.map(renderMessageContent) 
                : <p className="text-center text-gray-500 p-8">No conversation history for this subject yet.</p>
            }
        </div>
    );

    return (
        <div className="fixed bottom-4 right-4 w-full max-w-md h-full max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-slide-in-bottom">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center">
                    <BrainCircuitIcon className="w-6 h-6 text-purple-600 mr-2" />
                    <h2 className="font-semibold text-gray-800">AI Tutor: {subjectName}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setView(view === 'chat' ? 'history' : 'chat')} title={view === 'chat' ? 'View History' : 'Back to Chat'} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <HistoryIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button onClick={handleClose} title="Close Chat" className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>
            
            {view === 'chat' ? renderChatView() : renderHistoryView()}
            
            <style>{`
                @keyframes slide-in-bottom {
                    0% { transform: translateY(100%); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-in-bottom { animation: slide-in-bottom 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Chatbot;