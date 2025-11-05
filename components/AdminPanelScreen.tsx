import React, { useState, useRef, useMemo } from 'react';
import { DRAW_TIMES_DETAILS, BUNDLE_SIZES } from '../constants';
import type { DrawResult, User, Banner, SemBundle, WithdrawalRequest, Transaction, UpiDetail, QrCodeDetail } from '../types';

interface AdminPanelScreenProps {
  stats: { totalUsers: number; totalRevenue: number; ticketsSold: number; };
  profitLossData: { day: string; profit: number; }[];
  allUsers: User[];
  banners: Banner[];
  upiDetails: UpiDetail[];
  qrCodes: QrCodeDetail[];
  aboutUsContent: string;
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onAddBanner: (banner: Omit<Banner, 'id'>) => void;
  onDeleteBanner: (bannerId: string) => void;
  onAddUpi: (upi: Omit<UpiDetail, 'id'>) => void;
  onUpdateUpi: (upiId: string, updates: Partial<Omit<UpiDetail, 'id'>>) => void;
  onDeleteUpi: (upiId: string) => void;
  onAddQrCode: (qr: Omit<QrCodeDetail, 'id'>) => void;
  onUpdateQrCode: (qrId: string, updates: Partial<Omit<QrCodeDetail, 'id'>>) => void;
  onDeleteQrCode: (qrId: string) => void;
  onUpdateAboutUs: (content: string) => void;
  onAddBundle: (bundle: Omit<SemBundle, 'id' | 'ticketValue'>) => void;
  onUploadResult: (result: Omit<DrawResult, 'id'>) => void;
  onProcessWithdrawal: (requestId: string, status: 'approved' | 'rejected') => void;
  onBack: () => void;
}

// --- ICONS ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);
const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
);
const RevenueIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.895-.879 4.001 0l.178.134M12 6v-3.75m-3.75 3.75h3.75M12 18v3.75m3.75-3.75h-3.75m-3.75 0h.008v.015h-.008v-.015Zm5.625 0h.008v.015h-.008v-.015Zm-1.5 0h.008v.015h-.008v-.015Zm-1.5 0h.008v.015h-.008v-.015Zm-1.5 0h.008v.015h-.008v-.015Z" />
    </svg>
);


// --- Chart Component ---
const LineChart: React.FC<{ data: { day: string; profit: number }[] }> = ({ data }) => {
  const svgWidth = 320;
  const svgHeight = 160;
  const padding = 20;

  const maxValue = Math.max(...data.map(d => d.profit), 0);
  const minValue = Math.min(...data.map(d => d.profit), 0);
  
  const yRange = maxValue - minValue;
  const scaleY = (val: number) => svgHeight - padding - ((val - minValue) / (yRange || 1)) * (svgHeight - padding * 2);
  const scaleX = (index: number) => padding + (index / (data.length - 1)) * (svgWidth - padding * 2);

  const points = data.map((d, i) => `${scaleX(i)},${scaleY(d.profit)}`).join(' ');
  
  const areaPoints = `${scaleX(0)},${svgHeight - padding} ${points} ${scaleX(data.length - 1)},${svgHeight - padding}`;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
      <line x1={padding} y1={scaleY(0)} x2={svgWidth - padding} y2={scaleY(0)} stroke="currentColor" strokeDasharray="2,2" className="text-gray-300 dark:text-gray-600" />
       <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#areaGradient)" />
      <polyline fill="none" stroke="#4f46e5" strokeWidth="2" points={points} />
      {data.map((d, i) => (
        <text key={i} x={scaleX(i)} y={svgHeight} textAnchor="middle" fontSize="10" className="fill-current text-gray-500">{d.day}</text>
      ))}
    </svg>
  );
};

// --- Kyc Modal ---
const KycModal: React.FC<{ user: User; onClose: () => void; onProcess: (status: 'Verified' | 'Rejected') => void; }> = ({ user, onClose, onProcess }) => {
    if (!user.kycDetails) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">KYC Review: {user.name}</h2>
                <div className="space-y-4">
                    <p><strong>Document Type:</strong> {user.kycDetails.documentType}</p>
                    <p><strong>Document Number:</strong> {user.kycDetails.documentNumber}</p>
                    <p><strong>Submission Date:</strong> {user.kycDetails.submissionDate}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold mb-1">Front Side</p>
                            <img src={user.kycDetails.frontImageUrl} alt="Document Front" className="rounded-lg w-full object-contain" />
                        </div>
                        {user.kycDetails.backImageUrl && (
                             <div>
                                <p className="font-semibold mb-1">Back Side</p>
                                <img src={user.kycDetails.backImageUrl} alt="Document Back" className="rounded-lg w-full object-contain" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => onProcess('Rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Reject</button>
                        <button onClick={() => onProcess('Verified')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">Approve</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- TABS ---
const DashboardTab: React.FC<{ stats: AdminPanelScreenProps['stats'], profitLossData: AdminPanelScreenProps['profitLossData']}> = ({ stats, profitLossData }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
                    <RevenueIcon className="w-8 h-8 text-green-500"/>
                    <div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
                    <ChartIcon className="w-8 h-8 text-indigo-500"/>
                    <div>
                        <p className="text-sm text-gray-500">Tickets Sold</p>
                        <p className="text-2xl font-bold">{stats.ticketsSold}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
                    <UsersIcon className="w-8 h-8 text-blue-500"/>
                    <div>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Profit & Loss (Last 7 Days)</h3>
                 <div className="h-48">
                    <LineChart data={profitLossData} />
                 </div>
            </div>
        </div>
    );
};

const UsersTab: React.FC<{ users: User[]; onUpdateUser: AdminPanelScreenProps['onUpdateUser']; }> = ({ users, onUpdateUser }) => {
    const [editingBalance, setEditingBalance] = useState<{ [userId: string]: string }>({});
    
    const handleBalanceChange = (userId: string, value: string) => {
        setEditingBalance(prev => ({ ...prev, [userId]: value }));
    };

    const handleBalanceSave = (userId: string) => {
        const newBalance = parseFloat(editingBalance[userId]);
        if (!isNaN(newBalance)) {
            onUpdateUser(userId, { walletBalance: newBalance });
        }
        setEditingBalance(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white p-4 border-b dark:border-gray-700">User Management ({users.length})</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Balance</th>
                            <th scope="col" className="px-6 py-3">KYC Status</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}<br/><span className="font-normal text-gray-500">{user.email}</span></td>
                                <td className="px-6 py-4">
                                    {editingBalance[user.id] !== undefined ? (
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={editingBalance[user.id]} onChange={e => handleBalanceChange(user.id, e.target.value)} className="w-24 p-1 border rounded dark:bg-gray-700"/>
                                            <button onClick={() => handleBalanceSave(user.id)} className="text-green-500">Save</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            ₹{user.walletBalance.toFixed(2)}
                                            <button onClick={() => handleBalanceChange(user.id, user.walletBalance.toString())} className="text-blue-500 text-xs">(Edit)</button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">{user.kycStatus}</td>
                                <td className="px-6 py-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={user.status === 'active'} onChange={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'blocked' : 'active' })} className="sr-only peer"/>
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                        <span className="ml-3 text-sm font-medium">{user.status === 'active' ? 'Active' : 'Blocked'}</span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
};

const ContentTab: React.FC<{ 
    banners: Banner[];
    upiDetails: UpiDetail[];
    qrCodes: QrCodeDetail[];
    aboutUsContent: string;
    onAddBanner: AdminPanelScreenProps['onAddBanner']; 
    onDeleteBanner: AdminPanelScreenProps['onDeleteBanner']; 
    onAddUpi: AdminPanelScreenProps['onAddUpi'];
    onUpdateUpi: AdminPanelScreenProps['onUpdateUpi'];
    onDeleteUpi: AdminPanelScreenProps['onDeleteUpi'];
    onAddQrCode: AdminPanelScreenProps['onAddQrCode'];
    onUpdateQrCode: AdminPanelScreenProps['onUpdateQrCode'];
    onDeleteQrCode: AdminPanelScreenProps['onDeleteQrCode'];
    onUpdateAboutUs: AdminPanelScreenProps['onUpdateAboutUs'];
}> = (props) => {
    const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '' });
    const [newUpi, setNewUpi] = useState({ name: '', upiId: '' });
    const [editingUpi, setEditingUpi] = useState<UpiDetail | null>(null);
    const [newQr, setNewQr] = useState({ name: '', imageUrl: '' });
    const [editingQr, setEditingQr] = useState<QrCodeDetail | null>(null);
    const [aboutContent, setAboutContent] = useState(props.aboutUsContent);

    const handleAddBanner = (e: React.FormEvent) => {
        e.preventDefault();
        if(newBanner.title && newBanner.imageUrl) {
            props.onAddBanner(newBanner);
            setNewBanner({ title: '', imageUrl: '' });
        }
    }

    const handleAddUpi = (e: React.FormEvent) => {
        e.preventDefault();
        if(newUpi.name && newUpi.upiId) {
            props.onAddUpi(newUpi);
            setNewUpi({ name: '', upiId: '' });
        }
    }
    
    const handleUpdateUpi = () => {
        if (editingUpi) {
            props.onUpdateUpi(editingUpi.id, { name: editingUpi.name, upiId: editingUpi.upiId });
            setEditingUpi(null);
        }
    }

    const handleAddQrCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQr.name && newQr.imageUrl) {
            props.onAddQrCode(newQr);
            setNewQr({ name: '', imageUrl: '' });
        }
    };

    const handleUpdateQrCode = () => {
        if (editingQr) {
            props.onUpdateQrCode(editingQr.id, { name: editingQr.name, imageUrl: editingQr.imageUrl });
            setEditingQr(null);
        }
    };
    
    const handleSaveAboutUs = () => {
        props.onUpdateAboutUs(aboutContent);
        alert('About Us content updated!');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">About Us Page Content</h3>
                 <textarea
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    rows={8}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter content for the About Us page..."
                />
                <button
                    onClick={handleSaveAboutUs}
                    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
                    Save About Us
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">QR Code Management</h3>
                 <form onSubmit={handleAddQrCode} className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input type="text" placeholder="Name (e.g., Main QR)" value={newQr.name} onChange={e => setNewQr(p => ({...p, name: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700"/>
                    <input type="text" placeholder="Image URL" value={newQr.imageUrl} onChange={e => setNewQr(p => ({...p, imageUrl: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700"/>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">Add QR</button>
                 </form>
                 <div className="space-y-2">
                    {props.qrCodes.map(qr => (
                        <div key={qr.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            {editingQr?.id === qr.id ? (
                                <div className="flex-grow flex gap-2">
                                     <input type="text" value={editingQr.name} onChange={e => setEditingQr({...editingQr, name: e.target.value})} className="w-full p-1 border rounded dark:bg-gray-600"/>
                                     <input type="text" value={editingQr.imageUrl} onChange={e => setEditingQr({...editingQr, imageUrl: e.target.value})} className="w-full p-1 border rounded dark:bg-gray-600"/>
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center gap-3">
                                    <img src={qr.imageUrl} alt={qr.name} className="w-10 h-10 object-cover rounded"/>
                                    <p className="font-medium">{qr.name}</p>
                                </div>
                            )}
                            <div className="flex gap-2 ml-2">
                                {editingQr?.id === qr.id ? (
                                    <button onClick={handleUpdateQrCode} className="text-green-500 font-semibold">Save</button>
                                ) : (
                                    <button onClick={() => setEditingQr(qr)} className="text-blue-500 font-semibold">Edit</button>
                                )}
                                <button onClick={() => props.onDeleteQrCode(qr.id)} className="text-red-500 font-semibold">Delete</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">UPI Management</h3>
                 <form onSubmit={handleAddUpi} className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input type="text" placeholder="Name (e.g., Main UPI)" value={newUpi.name} onChange={e => setNewUpi(p => ({...p, name: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700"/>
                    <input type="text" placeholder="UPI ID (e.g., company@upi)" value={newUpi.upiId} onChange={e => setNewUpi(p => ({...p, upiId: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700"/>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">Add UPI</button>
                 </form>
                 <div className="space-y-2">
                    {props.upiDetails.map(upi => (
                        <div key={upi.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            {editingUpi?.id === upi.id ? (
                                <div className="flex-grow flex gap-2">
                                     <input type="text" value={editingUpi.name} onChange={e => setEditingUpi({...editingUpi, name: e.target.value})} className="w-full p-1 border rounded dark:bg-gray-600"/>
                                     <input type="text" value={editingUpi.upiId} onChange={e => setEditingUpi({...editingUpi, upiId: e.target.value})} className="w-full p-1 border rounded dark:bg-gray-600"/>
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    <p className="font-medium">{upi.name}</p>
                                    <p className="text-sm text-gray-500">{upi.upiId}</p>
                                </div>
                            )}
                            <div className="flex gap-2 ml-2">
                                {editingUpi?.id === upi.id ? (
                                    <button onClick={handleUpdateUpi} className="text-green-500 font-semibold">Save</button>
                                ) : (
                                    <button onClick={() => setEditingUpi(upi)} className="text-blue-500 font-semibold">Edit</button>
                                )}
                                <button onClick={() => props.onDeleteUpi(upi.id)} className="text-red-500 font-semibold">Delete</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Banner Management</h3>
                 <form onSubmit={handleAddBanner} className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input type="text" placeholder="Banner Title" value={newBanner.title} onChange={e => setNewBanner(p => ({...p, title: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700"/>
                    <input type="text" placeholder="Image URL" value={newBanner.imageUrl} onChange={e => setNewBanner(p => ({...p, imageUrl: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700"/>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap">Add Banner</button>
                 </form>
                 <div className="space-y-2">
                    {props.banners.map(banner => (
                        <div key={banner.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <img src={banner.imageUrl} alt={banner.title} className="w-16 h-8 object-cover rounded"/>
                            <span className="font-medium">{banner.title}</span>
                            <button onClick={() => props.onDeleteBanner(banner.id)} className="text-red-500 font-semibold">Delete</button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

const LotteryTab: React.FC<{ onAddBundle: AdminPanelScreenProps['onAddBundle']; onUploadResult: AdminPanelScreenProps['onUploadResult']; }> = (props) => {
    const [newBundle, setNewBundle] = useState({ drawTime: DRAW_TIMES_DETAILS[0].id, bundleSize: BUNDLE_SIZES[0].toString(), imageUrl: '' });
    const [newResult, setNewResult] = useState({ drawTime: DRAW_TIMES_DETAILS[0].id, date: new Date().toISOString().split('T')[0], winningNumbers: '' });

    const handleAddBundle = (e: React.FormEvent) => {
        e.preventDefault();
        const bundleSize = parseInt(newBundle.bundleSize);
        if(bundleSize && newBundle.imageUrl) {
            props.onAddBundle({ ...newBundle, bundleSize });
            setNewBundle({ drawTime: DRAW_TIMES_DETAILS[0].id, bundleSize: BUNDLE_SIZES[0].toString(), imageUrl: '' });
            alert('New ticket bundle added successfully!');
        }
    };
    
     const handleUploadResult = (e: React.FormEvent) => {
        e.preventDefault();
        const numbers = newResult.winningNumbers.split(',').map(n => n.trim()).filter(Boolean);
        if (numbers.length > 0) {
            props.onUploadResult({ ...newResult, winningNumbers: numbers });
            setNewResult(p => ({ ...p, winningNumbers: ''}));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleAddBundle} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">Add New Ticket Bundle</h3>
                 <div>
                    <label className="block text-sm font-medium">Draw Time</label>
                    <select value={newBundle.drawTime} onChange={e => setNewBundle(p => ({...p, drawTime: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700">
                        {DRAW_TIMES_DETAILS.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium">Bundle Size</label>
                    <select value={newBundle.bundleSize} onChange={e => setNewBundle(p => ({...p, bundleSize: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700">
                        {BUNDLE_SIZES.map(s => <option key={s} value={s}>{s} Tickets</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium">Ticket Image URL</label>
                    <input type="text" placeholder="https://placehold.co/..." value={newBundle.imageUrl} onChange={e => setNewBundle(p => ({...p, imageUrl: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700" required/>
                 </div>
                 <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700">Add Bundle</button>
            </form>
            <form onSubmit={handleUploadResult} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Publish New Results</h3>
                <div>
                    <label className="block text-sm font-medium">Draw Time</label>
                    <select value={newResult.drawTime} onChange={e => setNewResult(p => ({...p, drawTime: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700">
                      {DRAW_TIMES_DETAILS.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input type="date" value={newResult.date} onChange={e => setNewResult(p => ({...p, date: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Winning Numbers (comma-separated)</label>
                    <textarea rows={2} value={newResult.winningNumbers} onChange={e => setNewResult(p => ({...p, winningNumbers: e.target.value}))} placeholder="e.g., 12345, 67890, ..." className="w-full p-2 border rounded dark:bg-gray-700" required />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600">Publish Results</button>
            </form>
        </div>
    );
};

const WithdrawalsTab: React.FC<{ requests: WithdrawalRequest[]; onProcess: (id: string, status: 'approved' | 'rejected') => void; }> = ({ requests, onProcess }) => {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const processedRequests = requests.filter(r => r.status !== 'pending');

    const StatusPill: React.FC<{status: WithdrawalRequest['status']}> = ({status}) => {
        const color = status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{status}</span>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white p-4 border-b dark:border-gray-700">Pending Withdrawal Requests ({pendingRequests.length})</h3>
                {pendingRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">UPI ID</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(req => (
                                    <tr key={req.id} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{req.userName}</td>
                                        <td className="px-4 py-2">
                                            <p>Request: ₹{req.amount.toFixed(2)}</p>
                                            <p className="text-xs text-red-500">Fee: ₹{req.fee.toFixed(2)}</p>
                                            <p className="font-bold">Total: ₹{req.totalDeducted.toFixed(2)}</p>
                                        </td>
                                        <td className="px-4 py-2 text-xs">
                                            <p>{req.upiId}</p>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button onClick={() => onProcess(req.id, 'approved')} className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded hover:bg-green-600">Approve</button>
                                                <button onClick={() => onProcess(req.id, 'rejected')} className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded hover:bg-red-600">Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="p-4 text-gray-500 dark:text-gray-400">No pending requests.</p>}
            </div>
            
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white p-4 border-b dark:border-gray-700">Processed Requests ({processedRequests.length})</h3>
                {processedRequests.length > 0 && (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedRequests.map(req => (
                                    <tr key={req.id} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{req.userName}</td>
                                        <td className="px-4 py-2">₹{req.amount.toFixed(2)}</td>
                                        <td className="px-4 py-2">{req.requestDate}</td>
                                        <td className="px-4 py-2"><StatusPill status={req.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const KycTab: React.FC<{ users: User[]; onUpdateUser: AdminPanelScreenProps['onUpdateUser']; }> = ({ users, onUpdateUser }) => {
    const [reviewingUser, setReviewingUser] = useState<User | null>(null);
    const pendingUsers = users.filter(u => u.kycStatus === 'Pending');
    const processedUsers = users.filter(u => u.kycStatus === 'Verified' || u.kycStatus === 'Rejected');

    const handleProcess = (status: 'Verified' | 'Rejected') => {
        if (reviewingUser) {
            onUpdateUser(reviewingUser.id, { kycStatus: status });
            setReviewingUser(null);
        }
    };
    
    const StatusPill: React.FC<{status: User['kycStatus']}> = ({status}) => {
        const color = status === 'Verified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{status}</span>;
    }

    return (
         <div className="space-y-6">
            {reviewingUser && <KycModal user={reviewingUser} onClose={() => setReviewingUser(null)} onProcess={handleProcess} />}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white p-4 border-b dark:border-gray-700">Pending KYC Requests ({pendingUsers.length})</h3>
                {pendingUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Submission Date</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map(user => (
                                    <tr key={user.id} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{user.name}<br/><span className="text-xs text-gray-500">{user.email}</span></td>
                                        <td className="px-4 py-2">{user.kycDetails?.submissionDate}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                 <button onClick={() => setReviewingUser(user)} className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded hover:bg-blue-600">View Documents</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="p-4 text-gray-500 dark:text-gray-400">No pending KYC requests.</p>}
            </div>
            
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white p-4 border-b dark:border-gray-700">Processed KYC Requests ({processedUsers.length})</h3>
                 {processedUsers.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedUsers.map(user => (
                                    <tr key={user.id} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2"><StatusPill status={user.kycStatus} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : <p className="p-4 text-gray-500 dark:text-gray-400">No processed KYC requests.</p>}
            </div>
        </div>
    )
}

const TransactionsTab: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');

    const filteredTransactions = useMemo(() => {
        if (filter === 'deposit') {
            return transactions.filter(t => t.description.toLowerCase().includes('deposit'));
        }
        if (filter === 'withdrawal') {
            return transactions.filter(t => t.description.toLowerCase().includes('withdrawal'));
        }
        return transactions;
    }, [transactions, filter]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Transaction History ({filteredTransactions.length})</h3>
                <div className="flex space-x-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
                    <button onClick={() => setFilter('deposit')} className={`px-3 py-1 text-sm rounded-full ${filter === 'deposit' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Deposits</button>
                    <button onClick={() => setFilter('withdrawal')} className={`px-3 py-1 text-sm rounded-full ${filter === 'withdrawal' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Withdrawals</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(tx => (
                            <tr key={tx.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{tx.userName}</td>
                                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{tx.description}</td>
                                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{tx.date}</td>
                                <td className={`px-4 py-2 text-right font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                    {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const AdminPanelScreen: React.FC<AdminPanelScreenProps> = (props) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardTab stats={props.stats} profitLossData={props.profitLossData} />;
            case 'users':
                return <UsersTab users={props.allUsers} onUpdateUser={props.onUpdateUser} />;
            case 'kyc':
                return <KycTab users={props.allUsers} onUpdateUser={props.onUpdateUser} />;
            case 'transactions':
                return <TransactionsTab transactions={props.transactions} />;
            case 'withdrawals':
                return <WithdrawalsTab requests={props.withdrawalRequests} onProcess={props.onProcessWithdrawal} />;
            case 'content':
                return <ContentTab banners={props.banners} upiDetails={props.upiDetails} qrCodes={props.qrCodes} aboutUsContent={props.aboutUsContent} onAddBanner={props.onAddBanner} onDeleteBanner={props.onDeleteBanner} onAddUpi={props.onAddUpi} onUpdateUpi={props.onUpdateUpi} onDeleteUpi={props.onDeleteUpi} onAddQrCode={props.onAddQrCode} onUpdateQrCode={props.onUpdateQrCode} onDeleteQrCode={props.onDeleteQrCode} onUpdateAboutUs={props.onUpdateAboutUs} />;
            case 'lottery':
                return <LotteryTab onAddBundle={props.onAddBundle} onUploadResult={props.onUploadResult} />;
            default:
                return null;
        }
    };
    
    const tabClass = (tabName: string) => 
        `px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`;


    return (
        <div className="p-4 space-y-6">
             <div className="flex items-center gap-4">
                <button onClick={props.onBack} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full -ml-2">
                    <ArrowLeftIcon className="h-6 w-6"/>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Control Panel</h2>
            </div>
            
             <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
                     <button onClick={() => setActiveTab('dashboard')} className={tabClass('dashboard')}>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab('users')} className={tabClass('users')}>
                        Users
                    </button>
                    <button onClick={() => setActiveTab('kyc')} className={tabClass('kyc')}>
                        KYC
                    </button>
                    <button onClick={() => setActiveTab('withdrawals')} className={tabClass('withdrawals')}>
                        Withdrawals
                    </button>
                    <button onClick={() => setActiveTab('transactions')} className={tabClass('transactions')}>
                        Transactions
                    </button>
                    <button onClick={() => setActiveTab('content')} className={tabClass('content')}>
                        Content
                    </button>
                    <button onClick={() => setActiveTab('lottery')} className={tabClass('lottery')}>
                        Lottery
                    </button>
                </nav>
            </div>

            <div className="animate-fade-in">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminPanelScreen;