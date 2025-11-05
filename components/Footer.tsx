
import React from 'react';
import { Screen } from '../types';

interface FooterProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);
const TicketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3" />
    </svg>
);
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => {
    const activeClass = 'text-indigo-600 dark:text-indigo-400';
    const inactiveClass = 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400';
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`}>
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const Footer: React.FC<FooterProps> = ({ activeScreen, setActiveScreen }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 right-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-around h-16">
                    <NavItem icon={<HomeIcon className="h-6 w-6 mb-1" />} label="Home" isActive={activeScreen === Screen.Home} onClick={() => setActiveScreen(Screen.Home)} />
                    <NavItem icon={<TicketIcon className="h-6 w-6 mb-1" />} label="Results" isActive={activeScreen === Screen.Results} onClick={() => setActiveScreen(Screen.Results)} />
                    <NavItem icon={<UserIcon className="h-6 w-6 mb-1" />} label="Profile" isActive={activeScreen === Screen.Profile} onClick={() => setActiveScreen(Screen.Profile)} />
                    <NavItem icon={<SparklesIcon className="h-6 w-6 mb-1" />} label="Lucky AI" isActive={activeScreen === Screen.Lucky} onClick={() => setActiveScreen(Screen.Lucky)} />
                </div>
            </div>
        </footer>
    );
};

export default Footer;