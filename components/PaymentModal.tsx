import React, { useState, useRef } from 'react';
import { TICKET_PRICE_PER_UNIT } from '../constants';
import type { SemBundle, UpiDetail } from '../types';

interface PaymentModalProps {
  bundle: SemBundle;
  walletBalance: number;
  upiDetails: UpiDetail[];
  onClose: () => void;
  onSuccess: () => void;
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


const PaymentModal: React.FC<PaymentModalProps> = ({ bundle, walletBalance, upiDetails, onClose, onSuccess }) => {
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const price = bundle.bundleSize * TICKET_PRICE_PER_UNIT;
  const canAffordWithWallet = walletBalance >= price;
  
  const handleCopy = (upi: string, id: string) => {
    navigator.clipboard.writeText(upi).then(() => {
      setCopiedUpiId(id);
      setTimeout(() => setCopiedUpiId(null), 2000);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setScreenshot(event.target.files[0]);
    }
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !screenshot) {
      alert('Please enter the Transaction ID and upload a screenshot.');
      return;
    }
    setIsProcessing(true);
    // Simulate a 3-second verification process
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payment successful! Your tickets will be added to your account shortly.');
      onSuccess();
    }, 3000);
  };
  
  const handleWalletPayment = () => {
      setIsProcessing(true);
      // Simulate a quick server confirmation
      setTimeout(() => {
          setIsProcessing(false);
          onSuccess();
      }, 1000);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50" disabled={isProcessing}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">Complete Your Purchase</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Buy the {bundle.bundleSize} x ₹{bundle.ticketValue} bundle for <span className="font-bold text-green-500">₹{price}</span>
        </p>

        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">Your available balance:</p>
              <p className={`text-lg font-bold ${canAffordWithWallet ? 'text-green-500' : 'text-red-500'}`}>₹{walletBalance.toFixed(2)}</p>
              {canAffordWithWallet ? (
                <button
                  onClick={handleWalletPayment}
                  disabled={isProcessing}
                  className="mt-2 w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Pay with Wallet'}
                </button>
              ) : (
                 <p className="text-xs text-red-500 mt-1">Insufficient balance to pay with wallet.</p>
              )}
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Pay with UPI</p>
            <div className="w-full space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
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
            
            <form onSubmit={handleUpiSubmit} className="w-full space-y-4">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter UPI Transaction ID"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                required
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-2 border-2 border-dashed rounded-md text-center text-gray-500 dark:border-gray-600"
              >
                {screenshot ? `Selected: ${screenshot.name}` : 'Upload Screenshot'}
              </button>
              <button type="submit" disabled={isProcessing} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400">
                {isProcessing ? 'Verifying...' : 'Confirm UPI Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
