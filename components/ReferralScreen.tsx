
import React, { useState } from 'react';
import type { User } from '../types';

interface ReferralScreenProps {
  user: User;
}

const ReferralScreen: React.FC<ReferralScreenProps> = ({ user }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.referralCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = () => {
        if(navigator.share) {
            navigator.share({
                title: 'Join me on DearOnline WB Lottery!',
                text: `Use my referral code to get started: ${user.referralCode}`,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Share API not supported on this browser. Please copy the code manually.');
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Refer & Earn</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Share your code with friends and earn rewards!</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Unique Referral Code</p>
                <div className="my-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-3xl font-bold tracking-widest text-indigo-600 dark:text-indigo-400">{user.referralCode}</p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={handleCopy} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button onClick={handleShare} className="flex-1 bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                        Share
                    </button>
                </div>
            </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Friends Joined</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">5</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-500">₹250.00</p>
                </div>
            </div>
        </div>
    );
};

export default ReferralScreen;