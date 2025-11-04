import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './types';
import { startNewGame, processPlayerInput, getHint } from './services/geminiService';
import InputArea from './components/InputArea';
import GameOver from './components/GameOver';
import Settings from './components/Settings';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
    </div>
);

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.STARTING);
    const [secretItem, setSecretItem] = useState<string>('');
    const [displayText, setDisplayText] = useState<string>('');
    const [questionCount, setQuestionCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(false);
    const [hint, setHint] = useState<string>('');
    const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
    const [isHintRevealed, setIsHintRevealed] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);

    const initialMessage = "I'm thinking of something... Ask me up to 20 yes/no questions to guess what it is!";

    const handleNewGame = useCallback(async () => {
        setIsLoading(true);
        setGameState(GameState.STARTING);
        setQuestionCount(0);
        setDisplayText(initialMessage);
        setHint('');
        setIsHintRevealed(false);
        setIsHintLoading(false);

        try {
            const newSecretItem = await startNewGame();
            setSecretItem(newSecretItem);
            setGameState(GameState.PLAYING);
        } catch (error) {
            console.error("Failed to start a new game:", error);
            setDisplayText("Sorry, I'm having trouble thinking of something right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkApiKey = () => {
            const apiKey = localStorage.getItem('gemini_api_key');
            setHasApiKey(!!apiKey);
            return !!apiKey;
        };

        const checkPlayStatus = () => {
            if (!checkApiKey()) {
                setDisplayText("Welcome to 20 Questions!\nPlease configure your API key to start playing.");
                setIsLoading(false);
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            const lastPlayed = localStorage.getItem('lastPlayedDate');

            if (lastPlayed === today) {
                setHasPlayedToday(true);
                setDisplayText("You've already played today.\nCome back tomorrow for a new word!");
                setGameState(GameState.LOST);
                setIsLoading(false);
            } else {
                setHasPlayedToday(false);
                handleNewGame();
            }
        };

        checkPlayStatus();
    }, [handleNewGame]);

    const handlePlayerSubmit = async (inputText: string) => {
        if (isLoading || !inputText.trim() || gameState !== GameState.PLAYING) return;

        setIsLoading(true);
        setDisplayText('');
        const newQuestionCount = questionCount + 1;
        setQuestionCount(newQuestionCount);

        try {
            const result = await processPlayerInput(secretItem, inputText);
            const isGameOver = result.type === 'guess_correct' || newQuestionCount >= 20;

            if (isGameOver) {
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem('lastPlayedDate', today);
                setHasPlayedToday(true);
            }
            
            if (result.type === 'guess_correct') {
                setDisplayText(`Yes! You got it!\nThe secret word was "${secretItem}".`);
                setGameState(GameState.WON);
            } else if (newQuestionCount >= 20) {
                setDisplayText(`You've run out of questions!\nThe answer was: ${secretItem}`);
                setGameState(GameState.LOST);
            } else {
                setDisplayText(result.response);
            }
        } catch (error) {
            console.error("Error processing player input:", error);
            setDisplayText("I'm having a bit of trouble responding. Please try asking again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleHintRequest = async () => {
        if (isHintRevealed || isHintLoading) return;
        setIsHintLoading(true);
        try {
            const fetchedHint = await getHint(secretItem);
            setHint(`Hint: ${fetchedHint}`);
            setIsHintRevealed(true);
        } catch (error) {
            console.error("Failed to get hint:", error);
            setHint("Sorry, couldn't fetch a hint right now.");
            setIsHintRevealed(true); // show the error message
        } finally {
            setIsHintLoading(false);
        }
    };

    const isDailyLockoutMessage = displayText.startsWith("You've already played today.");
    const showHintButton = questionCount >= 10 && !isHintRevealed && gameState === GameState.PLAYING && !isLoading;

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4 relative">
            <button
                onClick={() => setShowSettings(true)}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-gray-200 text-gray-700 font-semibold rounded-full px-4 py-1.5 text-sm z-10 hover:bg-gray-300 transition-colors flex items-center gap-2"
                title="Settings"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                Settings
            </button>

            {!isDailyLockoutMessage && !(isLoading && !displayText) && hasApiKey && (
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-gray-200 text-gray-700 font-semibold rounded-full px-4 py-1.5 text-sm z-10 animate-fade-in">
                    Guesses: {questionCount} / 20
                </div>
            )}

            <main className="flex-grow flex items-center justify-center text-center px-4">
                <div className="max-w-4xl w-full flex flex-col items-center justify-center">
                    {isLoading && !displayText ? (
                        <TypingIndicator />
                    ) : displayText === initialMessage ? (
                        <div className="animate-fade-in">
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700">
                                I'm thinking of something...
                            </p>
                            <p className="mt-4 text-xl sm:text-2xl lg:text-3xl text-gray-600">
                                Ask me up to 20 yes/no questions to guess what it is!
                            </p>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-2">
                            {displayText.includes('\n') ? (
                                displayText.split('\n').map((line, i) => (
                                    <p key={i} className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700">
                                        {line}
                                    </p>
                                ))
                            ) : (
                                <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700">
                                    {displayText}
                                </p>
                            )}
                        </div>
                    )}

                    {isHintRevealed && gameState === GameState.PLAYING && (
                        <p className="mt-6 text-lg sm:text-xl text-gray-500 animate-fade-in">
                            {hint}
                        </p>
                    )}
                </div>
            </main>
            
            <footer className="w-full max-w-2xl mx-auto">
                {!hasApiKey ? (
                    <div className="text-center">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="bg-blue-500 text-white font-semibold rounded-full px-8 py-3 text-lg hover:bg-blue-600 transition-colors"
                        >
                            Configure API Key
                        </button>
                    </div>
                ) : hasPlayedToday || gameState === GameState.WON || gameState === GameState.LOST ? (
                    <GameOver />
                ) : (
                    <div className="flex flex-col items-center">
                        {!isHintRevealed && showHintButton && (
                            <div className="mb-4 animate-fade-in">
                                <button
                                    onClick={handleHintRequest}
                                    disabled={isHintLoading}
                                    className="bg-yellow-400 text-yellow-900 font-semibold rounded-full px-6 py-2.5 text-sm hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-wait transition-colors"
                                >
                                    {isHintLoading ? 'Getting Hint...' : 'Get a Hint'}
                                </button>
                            </div>
                        )}
                        <div className="w-full">
                            <InputArea onSubmit={handlePlayerSubmit} disabled={isLoading || gameState !== GameState.PLAYING} />
                        </div>
                    </div>
                )}
            </footer>

            {showSettings && (
                <Settings onClose={() => {
                    setShowSettings(false);
                    const apiKey = localStorage.getItem('gemini_api_key');
                    const hadKey = hasApiKey;
                    setHasApiKey(!!apiKey);
                    
                    // If user just added a key, start the game
                    if (!hadKey && apiKey) {
                        handleNewGame();
                    }
                }} />
            )}
        </div>
    );
};

export default App;
