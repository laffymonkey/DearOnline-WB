import React, { useState, useEffect } from 'react';
import { DRAW_TIMES_DETAILS } from '../constants';
import type { DrawResult } from '../types';

interface ResultsScreenProps {
    results: DrawResult[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results: allResults }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filteredResults, setFilteredResults] = useState<DrawResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Simulate filtering results based on date
        setTimeout(() => {
            const newFilteredResults = allResults.filter(r => r.date === selectedDate);
            setFilteredResults(newFilteredResults);
            setIsLoading(false);
        }, 300);
    }, [selectedDate, allResults]);

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Draw Results</h2>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date:</label>
                <input
                    type="date"
                    id="date-picker"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-gray-600 dark:text-gray-300">Loading results...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {DRAW_TIMES_DETAILS.map(draw => {
                        const result = filteredResults.find(r => r.drawTime === draw.id);
                        return (
                            <div key={draw.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{draw.id} Draw</h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{selectedDate}</span>
                                </div>
                                {result ? (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Winning Numbers:</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                                            {result.winningNumbers.map((num, index) => (
                                                <div key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                                    <span className="font-bold text-gray-800 dark:text-white tracking-wider">{num}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {result.prizeAmount && (
                                            <p className="text-center mt-4 text-green-500 font-bold">
                                                Prize: ₹{result.prizeAmount.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Result not yet declared.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ResultsScreen;
