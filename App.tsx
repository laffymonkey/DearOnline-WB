import React, { useState, useMemo, useEffect } from 'react';
import type { User, Banner, SemBundle, Transaction, DrawResult, WithdrawalRequest, Winner, UpiDetail, KycDetails, RecentPurchase, QrCodeDetail } from './types';
import { Screen } from './types';
import { INITIAL_USERS, INITIAL_BANNERS, INITIAL_BUNDLES, INITIAL_TRANSACTIONS, INITIAL_RESULTS, INITIAL_WITHDRAWAL_REQUESTS, WITHDRAWAL_FEE_PERCENTAGE, INITIAL_WINNERS, INITIAL_UPI_DETAILS, INITIAL_ABOUT_US_CONTENT, INITIAL_RECENT_PURCHASES, DRAW_TIMES_DETAILS, BUNDLE_SIZES, INITIAL_QR_CODES } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import PurchaseScreen from './components/PurchaseScreen';
import ResultsScreen from './components/ResultsScreen';
import ProfileScreen from './components/ProfileScreen';
import LuckyNumberScreen from './components/LuckyNumberScreen';
import WalletScreen from './components/WalletScreen';
import KycScreen from './components/KycScreen';
import ReferralScreen from './components/ReferralScreen';
import HelpScreen from './components/HelpScreen';
import WithdrawScreen from './components/WithdrawScreen';
import AdminPanelScreen from './components/AdminPanelScreen';
import Notification from './components/Notification';
import AboutUsScreen from './components/AboutUsScreen';

const getInitialScreen = (): Screen => {
    if (window.location.pathname === '/main') {
        return Screen.AdminPanel;
    }
    return Screen.Home;
};


const App: React.FC = () => {
    const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [activeScreen, setActiveScreen] = useState<Screen>(getInitialScreen());
    const [selectedDrawTime, setSelectedDrawTime] = useState<string | null>(null);
    
    // Admin-managed state
    const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
    const [bundles, setBundles] = useState<SemBundle[]>(INITIAL_BUNDLES);
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [upiDetails, setUpiDetails] = useState<UpiDetail[]>(INITIAL_UPI_DETAILS);
    const [qrCodes, setQrCodes] = useState<QrCodeDetail[]>(INITIAL_QR_CODES);
    const [results, setResults] = useState<DrawResult[]>(INITIAL_RESULTS);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWAL_REQUESTS);
    const [winners, setWinners] = useState<Winner[]>(INITIAL_WINNERS);
    const [aboutUsContent, setAboutUsContent] = useState<string>(INITIAL_ABOUT_US_CONTENT);
    const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>(INITIAL_RECENT_PURCHASES);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
    };

    useEffect(() => {
        if (currentUser && allUsers.find(u => u.id === currentUser.id)?.status === 'blocked') {
            handleLogout();
            showNotification("Your account has been blocked by an administrator.", 'error');
        }
    }, [allUsers, currentUser]);
    
    // Live purchase feed simulator
    useEffect(() => {
        if (!currentUser) return; // Don't run if logged out
        const interval = setInterval(() => {
            const randomUser = INITIAL_USERS[Math.floor(Math.random() * INITIAL_USERS.length)];
            const randomDraw = DRAW_TIMES_DETAILS[Math.floor(Math.random() * DRAW_TIMES_DETAILS.length)];
            const randomBundleSize = BUNDLE_SIZES[Math.floor(Math.random() * BUNDLE_SIZES.length)];

            const newPurchase: RecentPurchase = {
                id: `pur_${Date.now()}`,
                userName: randomUser.name,
                bundleSize: randomBundleSize,
                drawTime: randomDraw.id,
                timestamp: Date.now(),
            };
            setRecentPurchases(prev => [newPurchase, ...prev].slice(0, 15));
        }, 8000); // Add a new purchase every 8 seconds

        return () => clearInterval(interval);
    }, [currentUser]);


    const handleLogin = (email: string, password: string) => {
        const lowercasedEmail = email.toLowerCase();
        
        // Special case for the admin user
        if (lowercasedEmail === 'laffymonkeyofficial@gmail.com') {
            if (password === 'laffymonkeyofficial') {
                const adminUser = allUsers.find(u => u.email.toLowerCase() === lowercasedEmail);
                if (adminUser) {
                    if (adminUser.status === 'blocked') {
                        showNotification("Your account has been blocked. Please contact support.", 'error');
                        return;
                    }
                    setCurrentUser(adminUser);
                    return;
                }
                showNotification('Admin user not found. Please contact support.', 'error');
                return;
            } else {
                showNotification('Incorrect password for admin user.', 'error');
                return;
            }
        }

        // Logic for regular users
        const userToLogin = allUsers.find(u => u.email.toLowerCase() === lowercasedEmail);
        if (userToLogin) { // Existing user logging in (no password check for them)
            if(userToLogin.status === 'blocked') {
                showNotification("Your account has been blocked. Please contact support.", 'error');
                return;
            }
            setCurrentUser(userToLogin);
        } else { // New user signing up
            const newUser: User = {
                id: `usr_${Date.now()}`,
                name: 'New User',
                email: email,
                phone: '',
                avatarUrl: null,
                walletBalance: 0,
                kycStatus: 'Not Verified',
                kycDetails: null,
                referralCode: `NEW${Date.now().toString().slice(-4)}`,
                status: 'active'
            };
            setAllUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveScreen(Screen.Home);
    };

    const handleSelectDraw = (drawTime: string) => {
        setSelectedDrawTime(drawTime);
        setActiveScreen(Screen.Purchase);
    };

    const handlePurchaseSuccess = (amount: number, description: string, bundleSize: number) => {
        if(currentUser && selectedDrawTime) {
            const updateUserState = (user: User) => ({...user, walletBalance: user.walletBalance - amount});
            setCurrentUser(prev => prev ? updateUserState(prev) : null);
            setAllUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updateUserState(u) : u));

            const newTransaction: Transaction = {
                id: `tx_${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                description,
                date: new Date().toISOString().split('T')[0],
                type: 'debit',
                amount: -amount,
            };
            setTransactions(prev => [newTransaction, ...prev]);
            
            const newPurchase: RecentPurchase = {
                id: `pur_${Date.now()}`,
                userName: currentUser.name,
                bundleSize: bundleSize,
                drawTime: selectedDrawTime,
                timestamp: Date.now(),
            };
            setRecentPurchases(prev => [newPurchase, ...prev].slice(0, 15));

            showNotification(`${description} purchased successfully!`);
            setActiveScreen(Screen.Home);
        }
    };
    
    const handleDepositSuccess = (amount: number) => {
         if(currentUser) {
            const updateUserState = (user: User) => ({...user, walletBalance: user.walletBalance + amount});
            setCurrentUser(prev => prev ? updateUserState(prev) : null);
            setAllUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updateUserState(u) : u));
            
            const newTransaction: Transaction = {
                id: `tx_${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                description: 'Deposited via UPI',
                date: new Date().toISOString().split('T')[0],
                type: 'credit',
                amount: amount,
            };
            setTransactions(prev => [newTransaction, ...prev]);

            showNotification(`₹${amount} deposited successfully!`);
        }
    };

    const handleWithdrawalRequest = (amount: number, upiId: string) => {
        if (!currentUser) return;
        
        const fee = amount * (WITHDRAWAL_FEE_PERCENTAGE / 100);
        const totalDeducted = amount + fee;

        const newRequest: WithdrawalRequest = {
            id: `wr_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            amount: amount,
            fee: fee,
            totalDeducted: totalDeducted,
            upiId: upiId,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        setWithdrawalRequests(prev => [newRequest, ...prev]);
        showNotification(`Withdrawal request for ₹${amount} submitted for review.`);
        setActiveScreen(Screen.Wallet);
    };
    
    const handleUpdateProfile = (updatedData: Partial<User>) => {
        if (currentUser) {
            const updateUserState = (user: User) => ({...user, ...updatedData});
            setCurrentUser(prev => prev ? updateUserState(prev) : null);
            setAllUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updateUserState(u) : u));
        }
    };
    
    const handleKycSubmit = (details: Omit<KycDetails, 'submissionDate'>) => {
        if (currentUser) {
            const fullDetails: KycDetails = {
                ...details,
                submissionDate: new Date().toISOString().split('T')[0]
            };
            handleUpdateProfile({ kycStatus: 'Pending', kycDetails: fullDetails });
            showNotification('KYC documents submitted for review.');
        }
    };

    // --- Admin Panel Handlers ---
    
    const handleAdminUpdateUser = (userId: string, updates: Partial<User>) => {
        setAllUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...updates } : u));
        if (currentUser?.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleAdminAddBanner = (newBannerData: Omit<Banner, 'id'>) => {
        const newBanner: Banner = { id: `b_${Date.now()}`, ...newBannerData };
        setBanners(prev => [newBanner, ...prev]);
    };

    const handleAdminDeleteBanner = (bannerId: string) => {
        setBanners(prev => prev.filter(b => b.id !== bannerId));
    };

    const handleAdminAddUpi = (newUpiData: Omit<UpiDetail, 'id'>) => {
        const newUpi: UpiDetail = { id: `upi_${Date.now()}`, ...newUpiData };
        setUpiDetails(prev => [...prev, newUpi]);
    };
    
    const handleAdminUpdateUpi = (upiId: string, updates: Partial<Omit<UpiDetail, 'id'>>) => {
        setUpiDetails(prev => prev.map(u => u.id === upiId ? { ...u, ...updates } : u));
    };

    const handleAdminDeleteUpi = (upiId: string) => {
        setUpiDetails(prev => prev.filter(u => u.id !== upiId));
    };
    
    const handleAdminAddQrCode = (newQrCodeData: Omit<QrCodeDetail, 'id'>) => {
        const newQrCode: QrCodeDetail = { id: `qr_${Date.now()}`, ...newQrCodeData };
        setQrCodes(prev => [...prev, newQrCode]);
    };

    const handleAdminUpdateQrCode = (qrCodeId: string, updates: Partial<Omit<QrCodeDetail, 'id'>>) => {
        setQrCodes(prev => prev.map(q => q.id === qrCodeId ? { ...q, ...updates } : q));
    };

    const handleAdminDeleteQrCode = (qrCodeId: string) => {
        setQrCodes(prev => prev.filter(q => q.id !== qrCodeId));
    };
    
    const handleAdminUpdateAboutUs = (content: string) => {
        setAboutUsContent(content);
    };

    const handleAdminAddBundle = (newBundleData: Omit<SemBundle, 'id' | 'ticketValue'>) => {
        const newBundle: SemBundle = { id: `bundle_${Date.now()}`, ticketValue: 7, ...newBundleData };
        setBundles(prev => [newBundle, ...prev]);
    };

    const handleAdminUploadResult = (result: Omit<DrawResult, 'id'>) => {
        const newResult: DrawResult = { id: `res_${Date.now()}`, ...result };
        setResults(prev => [newResult, ...prev]);
        showNotification(`Results for ${result.drawTime} on ${result.date} have been published.`);
    };
    
    const handleProcessWithdrawal = (requestId: string, status: 'approved' | 'rejected') => {
        const request = withdrawalRequests.find(r => r.id === requestId);
        if (!request) return;

        setWithdrawalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));

        if (status === 'approved') {
            const user = allUsers.find(u => u.id === request.userId);
            if(user) {
                 const updateUserState = (u: User) => ({...u, walletBalance: u.walletBalance - request.totalDeducted});
                 setAllUsers(prev => prev.map(u => u.id === request.userId ? updateUserState(u) : u));
                 if(currentUser?.id === request.userId) {
                    setCurrentUser(prev => prev ? updateUserState(prev) : null);
                 }
                 
                 const newTransaction: Transaction = {
                    id: `tx_w_${Date.now()}`,
                    userId: request.userId,
                    userName: request.userName,
                    description: `Withdrawal of ₹${request.amount.toFixed(2)} approved`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'debit',
                    amount: -request.totalDeducted
                 };
                 setTransactions(prev => [newTransaction, ...prev]);
            }
        }
    };


    const dashboardStats = useMemo(() => {
        const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
        const ticketsSold = transactions.filter(t => t.description.includes('Bundle')).length;
        return { 
            totalUsers: allUsers.length,
            totalRevenue,
            ticketsSold
        };
    }, [allUsers, transactions]);

    const profitLossData = useMemo(() => {
        return [
            { day: 'Mon', profit: 1200 },
            { day: 'Tue', profit: 800 },
            { day: 'Wed', profit: 1500 },
            { day: 'Thu', profit: 1100 },
            { day: 'Fri', profit: 2200 },
            { day: 'Sat', profit: 2500 },
            { day: 'Sun', profit: 1800 },
        ];
    }, []);


    const renderScreen = () => {
        switch (activeScreen) {
            case Screen.Home:
                return <HomeScreen banners={banners} winners={winners} recentPurchases={recentPurchases} onSelectDraw={handleSelectDraw} />;
            case Screen.Purchase:
                return <PurchaseScreen user={currentUser!} drawTime={selectedDrawTime} bundles={bundles} upiDetails={upiDetails} onPurchaseSuccess={handlePurchaseSuccess} onBack={() => setActiveScreen(Screen.Home)} />;
            case Screen.Results:
                return <ResultsScreen results={results} />;
            case Screen.Lucky:
                return <LuckyNumberScreen />;
            case Screen.Profile:
                return <ProfileScreen user={currentUser!} setActiveScreen={setActiveScreen} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile}/>;
            case Screen.Wallet:
                return <WalletScreen user={currentUser!} transactions={transactions} upiDetails={upiDetails} qrCodes={qrCodes} onDepositSuccess={handleDepositSuccess} setActiveScreen={setActiveScreen} />;
            case Screen.Kyc:
                return <KycScreen user={currentUser!} onSubmit={handleKycSubmit} />;
            case Screen.Referral:
                return <ReferralScreen user={currentUser!} />;
            case Screen.Help:
                return <HelpScreen onSubmit={() => { showNotification('Support ticket submitted!'); setActiveScreen(Screen.Profile); }} onBack={() => setActiveScreen(Screen.Profile)} />;
            case Screen.AboutUs:
                return <AboutUsScreen content={aboutUsContent} onBack={() => setActiveScreen(Screen.Profile)} />;
            case Screen.Withdraw:
                return <WithdrawScreen user={currentUser!} onSubmitRequest={handleWithdrawalRequest} onBack={() => setActiveScreen(Screen.Wallet)} />;
            case Screen.AdminPanel:
                if (currentUser?.email !== 'laffymonkeyofficial@gmail.com') {
                    // Non-admin trying to access, redirect
                    setActiveScreen(Screen.Home);
                    return <HomeScreen banners={banners} winners={winners} recentPurchases={recentPurchases} onSelectDraw={handleSelectDraw} />;
                }
                return (
                    <AdminPanelScreen 
                        stats={dashboardStats}
                        profitLossData={profitLossData}
                        allUsers={allUsers}
                        banners={banners}
                        upiDetails={upiDetails}
                        qrCodes={qrCodes}
                        aboutUsContent={aboutUsContent}
                        transactions={transactions}
                        withdrawalRequests={withdrawalRequests}
                        onUpdateUser={handleAdminUpdateUser}
                        onAddBanner={handleAdminAddBanner}
                        onDeleteBanner={handleAdminDeleteBanner}
                        onAddUpi={handleAdminAddUpi}
                        onUpdateUpi={handleAdminUpdateUpi}
                        onDeleteUpi={handleAdminDeleteUpi}
                        onAddQrCode={handleAdminAddQrCode}
                        onUpdateQrCode={handleAdminUpdateQrCode}
                        onDeleteQrCode={handleAdminDeleteQrCode}
                        onUpdateAboutUs={handleAdminUpdateAboutUs}
                        onAddBundle={handleAdminAddBundle}
                        onUploadResult={handleAdminUploadResult}
                        onProcessWithdrawal={handleProcessWithdrawal}
                        onBack={() => setActiveScreen(Screen.Profile)} 
                    />
                );
            default:
                return <HomeScreen banners={banners} winners={winners} recentPurchases={recentPurchases} onSelectDraw={handleSelectDraw} />;
        }
    };

    if (!currentUser) {
        return <AuthScreen onLoginSuccess={handleLogin} />;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <Header user={currentUser} />
            <main className="max-w-4xl mx-auto pb-20">
                {renderScreen()}
            </main>
            <Footer activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
    );
};

export default App;