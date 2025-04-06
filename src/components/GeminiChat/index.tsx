import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComment,
    faPaperPlane,
    faTimes,
    faRobot,
    faUser,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { geminiApi } from '../../api/gemini.api';

interface Message {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function GeminiChat() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hi! I'm Gemini AI. How can I help you with your donation activities today?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!inputValue.trim()) return;
        
        const userMessage: Message = {
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        
        try {
            const response = await geminiApi.getMessage(inputValue);
            
            const aiMessage: Message = {
                text: response,
                isUser: false,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error getting response from Gemini:', error);
            
            const errorMessage: Message = {
                text: "Sorry, I couldn't process your request. Please try again.",
                isUser: false,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={toggleChat}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-primary-pink text-white'
                }`}
            >
                <FontAwesomeIcon icon={faComment} size="lg" />
            </button>

            {/* Expanded Chat Window */}
            <div
                className={`absolute bottom-0 right-0 mb-2 pt-2 bg-white rounded-lg shadow-xl w-96 md:w-96 overflow-hidden transition-all duration-300 transform ${
                    isOpen
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
                }`}
                style={{ height: isOpen ? '450px' : '0' }}
            >
                <div className="bg-primary-pink text-white p-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faRobot} className="mr-2" />
                        <span className="font-semibold">Gemini Assistant</span>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-grow" style={{ height: '320px' }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3/4 px-4 py-2 rounded-lg ${
                                    message.isUser
                                        ? 'bg-primary-pink text-white rounded-tr-none'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                }`}
                            >
                                <div className="flex items-start mb-1">
                                    <FontAwesomeIcon
                                        icon={message.isUser ? faUser : faRobot}
                                        className={`mr-2 mt-1 ${message.isUser ? 'text-white' : 'text-primary-pink'}`}
                                    />
                                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                                </div>
                                <div
                                    className={`text-xs ${
                                        message.isUser ? 'text-gray-200' : 'text-gray-500'
                                    } text-right`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg rounded-tl-none">
                                <FontAwesomeIcon icon={faSpinner} spin className="text-primary-pink" />
                                <span className="ml-2">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border-t border-gray-200 p-3 flex items-center"
                >
                    <input
                        type="text"
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-primary-pink text-white p-2 rounded-r-md hover:bg-pink-600 transition-colors disabled:bg-gray-300"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>
            </div>
        </div>
    );
}