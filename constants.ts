import type { User, Banner, SemBundle, Transaction, DrawTimeDetail, DrawResult, WithdrawalRequest, Winner, UpiDetail, RecentPurchase, QrCodeDetail } from './types';

export const DRAW_TIMES_DETAILS: DrawTimeDetail[] = [
    { id: '1 PM', time: '13:00:00' },
    { id: '6 PM', time: '18:00:00' },
    { id: '8 PM', time: '20:00:00' },
];

export const TICKET_PRICE_PER_UNIT = 7;
export const WITHDRAWAL_FEE_PERCENTAGE = 5;
export const DEPOSIT_FEE_PERCENTAGE = 2;


export const BUNDLE_SIZES = [5, 10, 25, 50, 100, 200];


// --- INITIAL STATE DATA ---
// This data is used to seed the application's state.

export const INITIAL_USERS: User[] = [
    { id: 'usr_123', name: 'Admin User', email: 'laffymonkeyofficial@gmail.com', phone: '+91 99999 88888', avatarUrl: 'https://i.pravatar.cc/150?u=admin', walletBalance: 10000, kycStatus: 'Verified', kycDetails: null, referralCode: 'ADMINPRO', status: 'active' },
    { id: 'usr_456', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', avatarUrl: null, walletBalance: 1250.75, kycStatus: 'Verified', kycDetails: null, referralCode: 'JOHN2024', status: 'active' },
    { 
        id: 'usr_789', 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        phone: '0', 
        avatarUrl: 'https://i.pravatar.cc/150?u=jane', 
        walletBalance: 350.00, 
        kycStatus: 'Pending', 
        kycDetails: {
            documentType: 'Aadhar Card',
            documentNumber: '**** **** 1234',
            frontImageUrl: 'https://placehold.co/600x400/a7a7a7/ffffff?text=Aadhar+Front',
            backImageUrl: 'https://placehold.co/600x400/a7a7a7/ffffff?text=Aadhar+Back',
            submissionDate: '2024-07-30'
        }, 
        referralCode: 'JANESREF', 
        status: 'active' 
    },
];


export const INITIAL_BANNERS: Banner[] = [
    { id: 'b1', imageUrl: 'https://placehold.co/600x300/7c3aed/ffffff?text=Mega+Jackpot', title: 'Win the Mega Jackpot This Sunday!' },
    { id: 'b2', imageUrl: 'https://placehold.co/600x300/16a34a/ffffff?text=Bumper+Offer', title: 'Special Bumper Offer - Limited Time' },
];

let bundleIdCounter = 0;
export const INITIAL_BUNDLES: SemBundle[] = DRAW_TIMES_DETAILS.flatMap(draw => 
    BUNDLE_SIZES.map(size => ({
        id: `bundle_${draw.id.replace(' ','')}_${size}_${++bundleIdCounter}`,
        drawTime: draw.id,
        bundleSize: size,
        ticketValue: 7,
        imageUrl: `https://placehold.co/400x200/ec4899/ffffff?text=${size}+Tickets`
    }))
);


export const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 'tx1', userId: 'usr_456', userName: 'John Doe', description: 'Deposited via UPI', date: '2024-07-28', type: 'credit', amount: 500 },
    { id: 'tx2', userId: 'usr_456', userName: 'John Doe', description: '1 PM SEM Bundle (5 x ₹7)', date: '2024-07-28', type: 'debit', amount: -35 },
    { id: 'tx3', userId: 'usr_789', userName: 'Jane Smith', description: 'Referral Bonus', date: '2024-07-27', type: 'credit', amount: 50 },
    { id: 'tx4', userId: 'usr_789', userName: 'Jane Smith', description: 'Withdrawal', date: '2024-07-26', type: 'debit', amount: -200 },
    { id: 'tx5', userId: 'usr_123', userName: 'Admin User', description: 'Deposited via UPI', date: '2024-07-25', type: 'credit', amount: 300 },
    { id: 'tx6', userId: 'usr_456', userName: 'John Doe', description: '6 PM SEM Bundle (10 x ₹7)', date: '2024-07-24', type: 'debit', amount: -70 },
    { id: 'tx7', userId: 'usr_789', userName: 'Jane Smith', description: 'Won Prize', date: '2024-07-23', type: 'credit', amount: 1000 },
];

export const INITIAL_UPI_DETAILS: UpiDetail[] = [
  { id: 'upi_1', name: 'Official UPI', upiId: 'contact@dearonline.wb' },
  { id: 'upi_2', name: 'Alternate UPI', upiId: 'support@dearonline.wb' },
];

export const INITIAL_QR_CODES: QrCodeDetail[] = [
    { id: 'qr_1', name: 'Official QR Code', imageUrl: 'https://placehold.co/256x256/E8E8E8/4A4A4A?text=Scan+to+Pay' },
];


export const INITIAL_RESULTS: DrawResult[] = [
  { id: 'res1', drawTime: '1 PM', date: '2024-07-28', winningNumbers: ['12345', '67890', '11223', '44556', '77889'], prizeAmount: 5000000 },
  { id: 'res2', drawTime: '6 PM', date: '2024-07-27', winningNumbers: ['98765', '43210', '55667', '88990', '11224'], prizeAmount: 5000000 },
];

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
    {
        id: 'wr_1',
        userId: 'usr_456',
        userName: 'John Doe',
        amount: 200,
        fee: 10,
        totalDeducted: 210,
        upiId: 'johndoe@mybank',
        requestDate: '2024-07-29',
        status: 'pending'
    },
    {
        id: 'wr_2',
        userId: 'usr_789',
        userName: 'Jane Smith',
        amount: 50,
        fee: 2.5,
        totalDeducted: 52.5,
        upiId: 'janesmith@okbank',
        requestDate: '2024-07-28',
        status: 'pending'
    }
];

export const INITIAL_WINNERS: Winner[] = [
  { id: 'win1', name: 'Aarav Sharma', prizeAmount: 50000, drawTime: '8 PM', date: '2024-07-28', avatarUrl: 'https://i.pravatar.cc/150?u=aarav' },
  { id: 'win2', name: 'Priya Patel', prizeAmount: 25000, drawTime: '1 PM', date: '2024-07-28', avatarUrl: 'https://i.pravatar.cc/150?u=priya' },
  { id: 'win3', name: 'Rohan Das', prizeAmount: 10000, drawTime: '6 PM', date: '2024-07-27', avatarUrl: 'https://i.pravatar.cc/150?u=rohan' },
  { id: 'win4', name: 'Sneha Gupta', prizeAmount: 5000, drawTime: '8 PM', date: '2024-07-27', avatarUrl: null },
  { id: 'win5', name: 'Vikram Singh', prizeAmount: 1000, drawTime: '1 PM', date: '2024-07-26', avatarUrl: 'https://i.pravatar.cc/150?u=vikram' },
];

export const INITIAL_ABOUT_US_CONTENT = "";

export const INITIAL_RECENT_PURCHASES: RecentPurchase[] = [
    { id: `pur_1`, userName: 'Rahul K.', bundleSize: 5, drawTime: '8 PM', timestamp: Date.now() - 5000 },
    { id: `pur_2`, userName: 'Anjali P.', bundleSize: 10, drawTime: '6 PM', timestamp: Date.now() - 12000 },
    { id: `pur_3`, userName: 'Suresh M.', bundleSize: 25, drawTime: '8 PM', timestamp: Date.now() - 25000 },
    { id: `pur_4`, userName: 'Pooja S.', bundleSize: 5, drawTime: '1 PM', timestamp: Date.now() - 45000 },
];