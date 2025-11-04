import React, { useState } from 'react';

interface InputAreaProps {
    onSubmit: (text: string) => void;
    disabled: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);


const InputArea: React.FC<InputAreaProps> = ({ onSubmit, disabled }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSubmit(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-3 py-2">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={disabled}
                placeholder="Type your question or guess..."
                className="flex-1 w-full bg-white border border-gray-300 text-gray-900 rounded-full py-3 px-5 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 transition-colors"
                autoComplete="off"
            />
            <button
                type="submit"
                disabled={disabled || !text.trim()}
                className="bg-gray-700 text-white rounded-full p-3 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:bg-gray-800"
            >
               <SendIcon className="w-6 h-6" />
            </button>
        </form>
    );
};

export default InputArea;