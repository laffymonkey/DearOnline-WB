import React, { useState } from 'react';
import { TICKET_PRICE_PER_UNIT } from '../constants';
import type { SemBundle, User, UpiDetail } from '../types';
import PaymentModal from './PaymentModal';

interface PurchaseScreenProps {
  user: User;
  drawTime: string | null;
  bundles: SemBundle[];
  upiDetails: UpiDetail[];
  onPurchaseSuccess: (amount: number, description: string, bundleSize: number) => void;
  onBack: () => void;
}

const PurchaseScreen: React.FC<PurchaseScreenProps> = ({ user, drawTime, bundles, upiDetails, onPurchaseSuccess, onBack }) => {
  const [selectedBundle, setSelectedBundle] = useState<SemBundle | null>(null);

  if (!drawTime) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">Please select a draw time from the home screen.</p>
        <button onClick={onBack} className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Go Back</button>
      </div>
    );
  }

  const availableBundles = bundles.filter(b => b.drawTime === drawTime);

  const handlePurchase = (bundle: SemBundle) => {
    setSelectedBundle(bundle);
  };

  const handleCloseModal = () => {
    setSelectedBundle(null);
  };

  const handlePaymentSuccess = () => {
    if (selectedBundle) {
      const price = selectedBundle.bundleSize * TICKET_PRICE_PER_UNIT;
      const description = `${selectedBundle.drawTime} SEM Bundle (${selectedBundle.bundleSize} x ₹${selectedBundle.ticketValue})`;
      onPurchaseSuccess(price, description, selectedBundle.bundleSize);
      setSelectedBundle(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Buy Tickets for {drawTime} Draw</h2>
      <p className="text-gray-600 dark:text-gray-300">
        All tickets are sold in SEM bundles. Price per ticket is fixed at <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{TICKET_PRICE_PER_UNIT}</span>.
      </p>
      {availableBundles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableBundles.map((bundle) => {
            const price = bundle.bundleSize * TICKET_PRICE_PER_UNIT;
            return (
              <div key={bundle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src={bundle.imageUrl} alt={`Ticket value ${bundle.ticketValue}`} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">₹{bundle.ticketValue} Ticket Value</h3>
                  <p className="text-gray-600 dark:text-gray-400">{bundle.bundleSize}-Ticket SEM Bundle</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-green-500">₹{price}</span>
                    <button
                      onClick={() => handlePurchase(bundle)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
         <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">No tickets available for this draw time yet.</p>
        </div>
      )}

      {selectedBundle && (
        <PaymentModal
          bundle={selectedBundle}
          walletBalance={user.walletBalance}
          upiDetails={upiDetails}
          onClose={handleCloseModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PurchaseScreen;