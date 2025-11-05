
import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    user: User;
}

const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m15 3a3 3 0 1 1-6 0m6 0a3 3 0 1 1-6 0" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ user }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">DearOnline WB</h1>
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                        <WalletIcon className="h-6 w-6 text-green-500" />
                        <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            ₹{user.walletBalance.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
