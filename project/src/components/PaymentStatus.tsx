import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { useContent } from '/src/contexts/ContentContext'; // PERBAIKAN: Path absolut

const PaymentStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const { heroContent } = useContent();

  const discordInviteLink = heroContent?.discord_invite_link || '#';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full bg-white/5 p-8 rounded-2xl border border-gray-700">
        {status === 'success' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
            <p className="text-gray-300 mb-6">
              Terima kasih! Role Anda telah diberikan secara otomatis. Silakan bergabung dengan komunitas eksklusif kami di Discord.
            </p>
            <a href={discordInviteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold">
              Gabung ke Server Discord
            </a>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Pembayaran Gagal</h1>
            <p className="text-gray-300 mb-6">Terjadi masalah dengan pembayaran Anda atau pembayaran telah dibatalkan. Silakan coba lagi.</p>
            <Link to="/" className="inline-flex items-center justify-center gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold">
              <Home className="w-4 h-4" />
              Kembali ke Halaman Utama
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
