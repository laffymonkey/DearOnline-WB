
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

interface AuthScreenProps {
    onLoginSuccess: (email: string, password: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                 <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-4">
                    DearOnline WB
                 </h1>
                 <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Your trusted lottery partner.</p>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                    {isLoginView ? (
                        <LoginScreen onLoginSuccess={onLoginSuccess} onSwitchToSignUp={() => setIsLoginView(false)} />
                    ) : (
                        <SignUpScreen onSignUpSuccess={onLoginSuccess} onSwitchToLogin={() => setIsLoginView(true)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;