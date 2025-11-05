import React from 'react';

interface AboutUsScreenProps {
  content: string;
  onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ content, onBack }) => {
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full -ml-2">
          <ArrowLeftIcon className="h-6 w-6"/>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">About Us</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div 
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content || "<p>Information about us will be updated here soon.</p>" }} 
        />
      </div>
    </div>
  );
};

export default AboutUsScreen;