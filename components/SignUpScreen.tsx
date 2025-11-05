
import React, { useState } from 'react';

interface SignUpScreenProps {
    onSignUpSuccess: (email: string, password: string) => void;
    onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim() && password.trim()) {
            // Simulate successful sign-up and login
            onSignUpSuccess(email, password);
        } else {
            alert('Please fill out all fields.');
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or Phone"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                />
                <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                    Sign Up
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    Log In
                </button>
            </p>
        </div>
    );
};

export default SignUpScreen;