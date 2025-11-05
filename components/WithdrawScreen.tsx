import React, { useState } from 'react';
import type { User } from '../types';
import { WITHDRAWAL_FEE_PERCENTAGE } from '../constants';

interface WithdrawScreenProps {
  user: User;
  onBack: () => void;
  onSubmitRequest: (amount: number, upiId: string) => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);


const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ user, onBack, onSubmitRequest }) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawAmount = parseFloat(amount);
  const fee = isNaN(withdrawAmount) || withdrawAmount <= 0 ? 0 : withdrawAmount * (WITHDRAWAL_FEE_PERCENTAGE / 100);
  const totalDeducted = isNaN(withdrawAmount) || withdrawAmount <= 0 ? 0 : withdrawAmount + fee;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (totalDeducted > user.walletBalance) {
        alert('Insufficient balance to cover amount and fees.');
        return;
    }
    if (!upiId.trim()) {
        alert('Please fill in your UPI ID.');
        return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSubmitRequest(withdrawAmount, upiId);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6">
       <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full -ml-2">
                <ArrowLeftIcon className="h-6 w-6"/>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Withdraw Funds</h2>
        </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
        <p className="text-3xl font-bold text-green-500">₹{user.walletBalance.toFixed(2)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Enter Withdrawal Details</h3>
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount to Withdraw (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {amount && (
                 <div className="w-full text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <p>Withdrawal Fee ({WITHDRAWAL_FEE_PERCENTAGE}%): <span className="font-semibold text-red-500">- ₹{fee.toFixed(2)}</span></p>
                    <p>Total to be deducted: <span className="font-semibold">₹{totalDeducted.toFixed(2)}</span></p>
                </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter your UPI ID to receive funds"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button type="submit" disabled={isProcessing} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400">
            {isProcessing ? 'Submitting...' : 'Submit Request for Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawScreen;
