import React, { useState, useEffect } from 'react';

interface SettingsProps {
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    const [apiKey, setApiKey] = useState<string>('');
    const [showKey, setShowKey] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key') || '';
        setApiKey(savedKey);
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                onClose();
            }, 1500);
        }
    };

    const handleClear = () => {
        setApiKey('');
        localStorage.removeItem('gemini_api_key');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showKey ? (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Get your free API key from{' '}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Google AI Studio
                            </a>
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim()}
                            className="flex-1 bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaved ? '✓ Saved!' : 'Save'}
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex-1 bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
