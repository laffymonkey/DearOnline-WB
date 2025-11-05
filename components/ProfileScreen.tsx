import React, { useState, useRef } from 'react';
import { Screen, User } from '../types';

interface ProfileScreenProps {
    user: User;
    setActiveScreen: (screen: Screen) => void;
    onLogout: () => void;
    onUpdateProfile: (updatedData: Partial<User>) => void;
}

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, setActiveScreen, onLogout, onUpdateProfile }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const baseMenuItems = [
        { label: 'My Wallet', screen: Screen.Wallet },
        { label: 'KYC Verification', screen: Screen.Kyc },
        { label: 'Refer & Earn', screen: Screen.Referral },
        { label: 'Help & Support', screen: Screen.Help },
        { label: 'About Us', screen: Screen.AboutUs },
    ];
    
    // Only show Admin Panel to the admin user
    const menuItems = user.email === 'laffymonkeyofficial@gmail.com'
        ? [...baseMenuItems, { label: 'Admin Panel', screen: Screen.AdminPanel }]
        : baseMenuItems;

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateProfile({ avatarUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateName = () => {
        if (newName.trim()) {
            onUpdateProfile({ name: newName.trim() });
            setIsEditingName(false);
        }
    };
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <div className="p-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                 <div className="flex flex-col items-center space-y-4">
                    <button onClick={handleAvatarClick} className="relative group">
                        {user.avatarUrl ? (
                             <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 dark:border-indigo-800" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-200 dark:border-indigo-800">
                                {getInitials(user.name)}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm">Change</span>
                        </div>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

                    <div className="text-center">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="text-xl font-bold text-gray-800 dark:text-white bg-transparent border-b-2 border-indigo-500 focus:outline-none text-center"
                                    autoFocus
                                />
                                <button onClick={handleUpdateName} className="text-sm bg-green-500 text-white px-3 py-1 rounded-md">Save</button>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                                <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    <EditIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {menuItems.map(item => (
                         <li key={item.screen} onClick={() => setActiveScreen(item.screen)} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <span className="font-semibold text-gray-800 dark:text-white">{item.label}</span>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onLogout}
                className="w-full bg-red-500 text-white p-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );
};

export default ProfileScreen;