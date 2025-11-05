import React, { useState, useEffect } from 'react';
import { DRAW_TIMES_DETAILS } from '../constants';
import type { Banner, Winner, RecentPurchase } from '../types';
import CountdownTimer from './CountdownTimer';

interface HomeScreenProps {
  banners: Banner[];
  winners: Winner[];
  recentPurchases: RecentPurchase[];
  onSelectDraw: (drawTime: string) => void;
}

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.303 9.303 0 0 1-4.532-1.421 1.5 1.5 0 0 1-.508-1.928c.36-1.02.972-1.928 1.754-2.723.782-.795 1.782-1.433 2.898-1.838a3.743 3.743 0 0 1 1.884-.424h.01c.73.045 1.44.25 2.086.608.645.358 1.218.848 1.68 1.428.46.58.788 1.264.96 2.007a5.25 5.25 0 0 1 .05 1.056v.006c0 .866.196 1.7.568 2.452a1.5 1.5 0 0 1-.508 1.928 9.303 9.303 0 0 1-4.532 1.421ZM12 12.75V3.75m0 9a3 3 0 0 1-3-3V3.75a3 3 0 1 1 6 0v6a3 3 0 0 1-3 3Z" />
    </svg>
);

const FeedTicketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3" />
  </svg>
);


const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

const maskName = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return name;
}

const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
};


const HomeScreen: React.FC<HomeScreenProps> = ({ banners, winners, recentPurchases, onSelectDraw }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="space-y-6 p-4">
      {/* Banner Carousel */}
      {banners.length > 0 && (
        <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-lg">
          {banners.map((banner, index) => (
            <img
              key={banner.id}
              src={banner.imageUrl}
              alt={banner.title}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-white text-lg font-bold">{banners[currentBanner].title}</h2>
          </div>
        </div>
      )}

      {/* Daily Draws */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Today's Draws</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DRAW_TIMES_DETAILS.map((draw) => (
            <div key={draw.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{draw.id} Draw</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Results are waiting!</p>
              <CountdownTimer targetTime={draw.time} />
              <button
                onClick={() => onSelectDraw(draw.id)}
                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Buy Tickets
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Ticket Feed */}
      {recentPurchases.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Live Ticket Feed</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
                <div className="h-48 overflow-hidden relative">
                    <div className="space-y-1">
                        {recentPurchases.map((purchase) => (
                            <div key={purchase.id} className="p-2 flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-md animate-fade-in-down">
                                <FeedTicketIcon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        {maskName(purchase.userName)}
                                        <span className="font-normal text-gray-600 dark:text-gray-300"> bought a {purchase.bundleSize}-Ticket Bundle for {purchase.drawTime}</span>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{formatTimeAgo(purchase.timestamp)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {/* Top Winners */}
      {winners.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recent Top Winners</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {winners.slice(0, 5).map((winner, index) => (
                    <li key={winner.id} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {winner.avatarUrl ? (
                        <img src={winner.avatarUrl} alt={winner.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                            {getInitials(winner.name)}
                        </div>
                        )}
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800 dark:text-white">{winner.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        Won on {winner.date} ({winner.drawTime})
                        </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                        <p className="font-bold text-lg text-green-500">₹{winner.prizeAmount.toLocaleString()}</p>
                        <TrophyIcon className={`w-6 h-6 ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-amber-600' : 'text-gray-300'
                        }`}/>
                    </div>
                    </li>
                ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;