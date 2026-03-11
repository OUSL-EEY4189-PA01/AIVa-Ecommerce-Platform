import { useState } from 'react';

const ChatPanel = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    sessionId: sessionId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.sessionId) {
                    setSessionId(data.sessionId);
                }

                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: data.response,
                    sender: 'bot'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: "Sorry, I encountered an error. Please try again.",
                    sender: 'bot'
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Sorry, I'm unable to connect. Please try again later.",
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Chat Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-black/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">AI Chat Support</h2>
                            <p className="text-xs text-black/50">We reply instantly</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-3 rounded-2xl ${message.sender === 'user'
                                    ? 'bg-black text-white rounded-br-md'
                                    : 'bg-black/5 text-black rounded-bl-md'
                                    }`}
                            >
                                {message.sender === 'user' ? (
                                    <p className="text-sm">{message.text}</p>
                                ) : (
                                    <div className="text-sm prose prose-sm max-w-none">
                                        {message.text.split('\n').map((line, i) => {

                                            if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                                                return (
                                                    <div key={i} className="flex gap-2 ml-2 my-1">
                                                        <span className="text-black/60">•</span>
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: line.replace(/^[-•]\s*/, '')
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                        }} />
                                                    </div>
                                                );
                                            }

                                            if (/^\d+\.\s/.test(line.trim())) {
                                                const match = line.match(/^(\d+)\.\s*(.*)/);
                                                return (
                                                    <div key={i} className="flex gap-2 ml-2 my-1">
                                                        <span className="text-black/60 font-medium">{match[1]}.</span>
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: match[2]
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                        }} />
                                                    </div>
                                                );
                                            }

                                            if (line.trim().endsWith(':') && line.trim().length < 50) {
                                                return <p key={i} className="font-semibold mt-2 mb-1">{line}</p>;
                                            }

                                            if (!line.trim()) {
                                                return <div key={i} className="h-2" />;
                                            }

                                            return (
                                                <p key={i} className="my-1" dangerouslySetInnerHTML={{
                                                    __html: line
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                }} />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-black/5 text-black rounded-2xl rounded-bl-md p-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/10 bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 border border-black/10 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className="p-3 bg-black text-white rounded-full hover:bg-black/80 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPanel;
