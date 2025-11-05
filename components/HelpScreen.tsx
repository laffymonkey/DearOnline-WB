import React, { useState, useRef } from 'react';

interface HelpScreenProps {
    onSubmit: () => void;
    onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const HelpScreen: React.FC<HelpScreenProps> = ({ onSubmit, onBack }) => {
    const [category, setCategory] = useState('payment');
    const [description, setDescription] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setScreenshot(event.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            alert('Please describe your issue.');
            return;
        }
        setIsSubmitting(true);
        // Simulate API call to submit the ticket
        setTimeout(() => {
            setIsSubmitting(false);
            onSubmit();
        }, 2000);
    };

    return (
        <div className="p-4 space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                 <button onClick={onBack} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full -ml-2">
                    <ArrowLeftIcon className="h-6 w-6"/>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help & Support</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Facing an issue? Fill out the form below and our support team will get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="payment">Payment Issue</option>
                            <option value="ticket">Ticket Purchase Problem</option>
                            <option value="withdrawal">Withdrawal Problem</option>
                            <option value="bug">App Bug / Glitch</option>
                            <option value="general">General Inquiry</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Describe your issue</label>
                        <textarea
                            id="description"
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide as much detail as possible..."
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Screenshot (Optional)</label>
                         <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-3 border-2 border-dashed rounded-lg text-center text-gray-500 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                        >
                            {screenshot ? `Selected: ${screenshot.name}` : 'Upload Screenshot'}
                        </button>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors">
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HelpScreen;
