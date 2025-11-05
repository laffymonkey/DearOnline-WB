import React, { useState } from 'react';
import { DEPOSIT_FEE_PERCENTAGE } from '../constants';
import type { UpiDetail, QrCodeDetail } from '../types';

interface DepositModalProps {
  upiDetails: UpiDetail[];
  qrCodes: QrCodeDetail[];
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const DepositModal: React.FC<DepositModalProps> = ({ upiDetails, qrCodes, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState<string | null>(null);

  const depositAmount = parseFloat(amount);
  const fee = isNaN(depositAmount) || depositAmount <= 0 ? 0 : depositAmount * (DEPOSIT_FEE_PERCENTAGE / 100);
  const netAmount = isNaN(depositAmount) || depositAmount <= 0 ? 0 : depositAmount - fee;

  const handleCopy = (upi: string, id: string) => {
    navigator.clipboard.writeText(upi).then(() => {
      setCopiedUpiId(id);
      setTimeout(() => setCopiedUpiId(null), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    if (!transactionId) {
      alert('Please enter the Transaction ID.');
      return;
    }
    setIsProcessing(true);
    // Simulate a 2-second verification process
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(depositAmount);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Deposit Funds</h2>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm font-semibold">1. Pay using one of the methods below</p>
          
          {qrCodes.length > 0 && (
             <div className="w-full space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-xs font-bold text-center text-gray-600 dark:text-gray-400 uppercase">Scan & Pay</p>
                <div className="flex justify-center items-center gap-4 flex-wrap">
                    {qrCodes.map(qr => (
                        <div key={qr.id} className="text-center">
                            <img src={qr.imageUrl} alt={qr.name} className="w-32 h-32 rounded-lg object-cover" />
                            <p className="text-xs font-semibold mt-1 text-gray-700 dark:text-gray-300">{qr.name}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}

           <div className="w-full max-h-32 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-xs font-bold text-center text-gray-600 dark:text-gray-400 uppercase">Or Pay via UPI ID</p>
                {upiDetails.map(detail => (
                    <div key={detail.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        <div>
                            <p className="font-semibold text-sm text-gray-800 dark:text-white">{detail.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{detail.upiId}</p>
                        </div>
                        <button type="button" onClick={() => handleCopy(detail.upiId, detail.id)} className={`flex items-center gap-1 text-sm font-semibold py-1 px-2 rounded ${copiedUpiId === detail.id ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} transition-colors`}>
                           {copiedUpiId === detail.id ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                           {copiedUpiId === detail.id ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                ))}
            </div>
          
          <p className="text-sm font-semibold mt-4">2. Submit Payment Details</p>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Deposit Amount (₹)"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {amount && (
                 <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400 -mt-2">
                    <p>Deposit Fee ({DEPOSIT_FEE_PERCENTAGE}%): <span className="font-semibold text-red-500">- ₹{fee.toFixed(2)}</span></p>
                    <p>You will receive: <span className="font-semibold text-green-500">₹{netAmount.toFixed(2)}</span></p>
                </div>
            )}
             <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter UPI Transaction ID"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <button type="submit" disabled={isProcessing} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400">
              {isProcessing ? 'Verifying...' : 'Confirm Deposit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;