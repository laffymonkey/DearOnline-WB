
import React from 'react';
import useCountdown from '../hooks/useCountdown';

interface CountdownTimerProps {
  targetTime: string;
}

const CountdownSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{String(value).padStart(2, '0')}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{label}</span>
  </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const { hours, minutes, seconds } = useCountdown(targetTime);

  return (
    <div className="flex justify-center items-center space-x-4 my-2">
      <CountdownSegment value={hours} label="Hrs" />
      <span className="text-2xl font-bold text-gray-800 dark:text-white">:</span>
      <CountdownSegment value={minutes} label="Min" />
      <span className="text-2xl font-bold text-gray-800 dark:text-white">:</span>
      <CountdownSegment value={seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;
