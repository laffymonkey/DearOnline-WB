export interface KycDetails {
  documentType: string;
  documentNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  submissionDate: string; // YYYY-MM-DD
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  walletBalance: number;
  kycStatus: 'Verified' | 'Pending' | 'Not Verified' | 'Rejected';
  kycDetails: KycDetails | null;
  referralCode: string;
  status: 'active' | 'blocked';
}

export enum Screen {
  Auth = 'Auth',
  Home = 'Home',
  Purchase = 'Purchase',
  Results = 'Results',
  Profile = 'Profile',
  Lucky = 'Lucky',
  Wallet = 'Wallet',
  Withdraw = 'Withdraw',
  Kyc = 'Kyc',
  Referral = 'Referral',
  Help = 'Help',
  AboutUs = 'AboutUs',
  AdminPanel = 'AdminPanel',
  AdminUpload = 'AdminUpload',
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
}

export interface SemBundle {
  id: string;
  drawTime: string; // e.g. "1 PM"
  bundleSize: number;
  ticketValue: number;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: 'credit' | 'debit';
  amount: number;
}

export interface DrawResult {
    id: string;
    drawTime: string; // "1 PM", "6 PM", "8 PM"
    date: string; // "YYYY-MM-DD"
    winningNumbers: string[];
    prizeAmount?: number;
    pdfUrl?: string;
}

export interface DrawTimeDetail {
    id: string;
    time: string; // "HH:MM:SS"
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  fee: number;
  totalDeducted: number;
  upiId: string;
  requestDate: string; // YYYY-MM-DD
  status: 'pending' | 'approved' | 'rejected';
}

export interface Winner {
  id: string;
  name: string;
  prizeAmount: number;
  drawTime: string;
  date: string;
  avatarUrl?: string | null;
}

export interface UpiDetail {
  id: string;
  name: string;
  upiId: string;
}

export interface QrCodeDetail {
  id: string;
  name: string;
  imageUrl: string;
}

export interface RecentPurchase {
  id: string;
  userName: string;
  bundleSize: number;
  drawTime: string;
  timestamp: number; // UTC timestamp
}