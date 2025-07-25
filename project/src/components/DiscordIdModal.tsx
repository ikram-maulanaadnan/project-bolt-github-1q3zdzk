// File: src/components/DiscordIdModal.tsx (File Baru)
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Package } from '../types';

interface DiscordIdModalProps {
  pkg: Package;
  onClose: () => void;
}

export const DiscordIdModal: React.FC<DiscordIdModalProps> = ({ pkg, onClose }) => {
  const [discordId, setDiscordId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{17,19}$/.test(discordId)) {
      setError('Format Discord User ID tidak valid. Harap periksa kembali.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Menambahkan ID Discord ke URL pembayaran sebagai parameter 'order_description'
    // Webhook akan membaca parameter ini untuk memberikan role.
    const paymentUrl = new URL(pkg.payment_link);
    paymentUrl.searchParams.set('order_description', discordId);
    
    // Arahkan pengguna ke halaman pembayaran
    window.location.href = paymentUrl.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-white/20 relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">One Step!</h2>
        <p className="text-gray-400 mb-6">Fill with your Discord ID.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="discordId" className="block text-sm font-medium text-gray-300 mb-2">
              Discord User ID
            </label>
            <input
              type="text"
              id="discordId"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 ring-blue-500/50 focus:ring-2 transition"
              placeholder="Contoh: 123456789012345678"
              required
            />
            <p className="text-xs text-gray-500 mt-2">How To Get ID: Discord, activate Developer Mode, Right Click Your Profile and copy user ID.</p>
          </div>
          {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-wait"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lanjut ke Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
};