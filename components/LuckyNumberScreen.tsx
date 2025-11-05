
import React, { useState } from 'react';
import { generateLuckyNumbers } from '../services/geminiService';

const LuckyNumberScreen: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<{ numbers: string[], reasoning: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt, like your birthday or a lucky charm.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await generateLuckyNumbers(prompt);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-4 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Lucky Number Generator</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Let Gemini find your lucky numbers! Tell us something lucky.</p>
            </div>

            <div className="max-w-xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'My birthday is May 15th'"
                        className="w-full p-4 pr-32 rounded-full border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition"
                    >
                        {isLoading ? 'Thinking...' : 'Generate'}
                    </button>
                </div>
                 {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>

            {result && (
                <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 animate-fade-in-up">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Your AI-Generated Numbers:</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                        {result.numbers.map((num, index) => (
                             <div key={index} className="flex items-center justify-center aspect-square rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md">
                                <span className="font-bold text-xl">{num.slice(-2)}</span>
                            </div>
                        ))}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Reasoning:</h3>
                    <p className="text-gray-600 dark:text-gray-300 italic">"{result.reasoning}"</p>
                </div>
            )}
        </div>
    );
};

export default LuckyNumberScreen;
