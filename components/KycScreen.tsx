import React, { useState } from 'react';
import type { User, KycDetails } from '../types';

interface KycScreenProps {
  user: User;
  onSubmit: (details: Omit<KycDetails, 'submissionDate'>) => void;
}

const KycScreen: React.FC<KycScreenProps> = ({ user, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docType, setDocType] = useState('Aadhar Card');
  const [docNumber, setDocNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call and state update
    setTimeout(() => {
      onSubmit({
        documentType: docType,
        documentNumber: docNumber,
        frontImageUrl: 'https://placehold.co/600x400/a7a7a7/ffffff?text=Front+Side',
        backImageUrl: 'https://placehold.co/600x400/a7a7a7/ffffff?text=Back+Side',
      });
      setIsSubmitting(false);
    }, 2000);
  };
  
  const getStatusPill = (status: string) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    switch(status) {
        case 'Verified':
            return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
        case 'Pending':
            return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
        case 'Not Verified':
            return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        case 'Rejected':
            return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
        default:
            return baseClasses;
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">KYC Verification</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Your KYC Status:</h3>
          <span className={getStatusPill(user.kycStatus)}>{user.kycStatus}</span>
      </div>

      {user.kycStatus === 'Not Verified' || user.kycStatus === 'Rejected' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {user.kycStatus === 'Rejected' && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-md text-sm">
                    Your previous KYC submission was rejected. Please review the requirements and submit again.
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Submit Documents</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
                    <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>Aadhar Card</option>
                        <option>PAN Card</option>
                        <option>Voter ID</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Number</label>
                    <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} placeholder="Enter document number" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Front Side</label>
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900" required />
                 </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Back Side</label>
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900" />
                 </div>
                 <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400">
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </button>
            </form>
        </div>
      ) : null}
       {user.kycStatus === 'Pending' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg p-4 text-center">
            <p className="font-semibold">Your documents are under review. This may take up to 24-48 hours.</p>
        </div>
      )}
       {user.kycStatus === 'Verified' && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg p-4 text-center">
            <p className="font-semibold">Your KYC has been successfully verified!</p>
        </div>
      )}
    </div>
  );
};

export default KycScreen;
