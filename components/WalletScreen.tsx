import React, { useState } from 'react';
// FIX: 'Screen' is an enum used as a value, so it must be imported using a value-import, not a type-only import.
import { Screen } from '../types';
import type { User, Transaction, UpiDetail, QrCodeDetail } from '../types';
import DepositModal from './DepositModal';

// --- ICONS ---
const ArrowDownCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const ArrowUpCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const TicketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3" />
  </svg>
);
const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a8.25 8.25 0 0 1-16.5 0v-8.25m16.5 0a8.25 8.25 0 0 0-16.5 0M12 4.875c-1.148 0-2.22.443-3.034 1.233A4.5 4.5 0 0 0 12 11.25c1.148 0 2.22-.443 3.034-1.233A4.5 4.5 0 0 0 12 4.875Z" />
    </svg>
);


interface WalletScreenProps {
  user: User;
  transactions: Transaction[];
  upiDetails: UpiDetail[];
  qrCodes: QrCodeDetail[];
  onDepositSuccess: (amount: number) => void;
  setActiveScreen: (screen: Screen) => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ user, transactions, upiDetails, qrCodes, onDepositSuccess, setActiveScreen }) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const getTransactionIcon = (tx: Transaction) => {
    const description = tx.description.toLowerCase();
    if (description.includes('deposit')) {
        return <ArrowDownCircleIcon className="h-8 w-8 text-green-500" />;
    }
    if (description.includes('withdraw')) {
        return <ArrowUpCircleIcon className="h-8 w-8 text-red-500" />;
    }
    if (description.includes('bundle')) {
        return <TicketIcon className="h-8 w-8 text-blue-500" />;
    }
     if (description.includes('referral') || description.includes('prize') || description.includes('bonus')) {
        return <GiftIcon className="h-8 w-8 text-yellow-500" />;
    }
    // Default icons
    if (tx.type === 'credit') {
        return <ArrowDownCircleIcon className="h-8 w-8 text-green-500" />;
    }
    return <ArrowUpCircleIcon className="h-8 w-8 text-red-500" />;
  };


  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Wallet</h2>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm opacity-80">Current Balance</p>
                <p className="text-4xl font-bold">₹{user.walletBalance.toFixed(2)}</p>
            </div>
            <div className="text-sm font-mono opacity-90">
                **** **** **** {user.id.slice(-4)}
            </div>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
                <ArrowDownCircleIcon className="h-5 w-5" />
                Deposit Funds
            </button>
             <button 
                onClick={() => setActiveScreen(Screen.Withdraw)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
                <ArrowUpCircleIcon className="h-5 w-5" />
                Withdraw Funds
            </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Transaction History</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((tx) => (
                    <li key={tx.id} className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0">
                           {getTransactionIcon(tx)}
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800 dark:text-white">{tx.description}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                        </div>
                        <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
      </div>
      {isDepositModalOpen && (
        <DepositModal 
            upiDetails={upiDetails}
            qrCodes={qrCodes}
            onClose={() => setIsDepositModalOpen(false)}
            onSuccess={(amount) => {
                onDepositSuccess(amount);
                setIsDepositModalOpen(false);
            }}
        />
      )}
    </div>
  );
};

export default WalletScreen;