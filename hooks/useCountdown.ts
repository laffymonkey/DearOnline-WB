
import { useState, useEffect } from 'react';

const useCountdown = (targetTime: string) => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const target = new Date();
        const [hours, minutes, seconds] = targetTime.split(':').map(Number);
        
        target.setHours(hours, minutes, seconds, 0);

        if (now > target) {
            target.setDate(target.getDate() + 1);
        }

        const difference = target.getTime() - now.getTime();

        let timeLeft = {
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return timeLeft;
};

export default useCountdown;
