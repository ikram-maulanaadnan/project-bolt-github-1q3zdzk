import React, { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePasswordStrength } from '../../utils/security';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { login } = useAuth();

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1000) {
            setError('');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- DEBUGGING LOG ---
    console.log('--- Tombol Login Ditekan ---');
    console.log('Username yang dikirim:', username);
    console.log('Password yang dikirim:', password);
    // ---------------------

    if (lockoutTime > 0) {
      console.log('Login diblokir karena lockout time.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(username, password);
    
    // --- DEBUGGING LOG ---
    console.log('Hasil dari fungsi login:', result);
    // ---------------------

    if (!result.success) {
      setError(result.error || 'Login gagal');
      if (result.lockoutTime) {
        setLockoutTime(result.lockoutTime);
      }
    } else {
       console.log('Login seharusnya berhasil, akan diarahkan ke dashboard.');
    }
    
    setLoading(false);
  };

  const formatLockoutTime = (time: number): string => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const passwordValidation = validatePasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Shield className="w-4 h-4" />
            Secure Admin Login
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Trading Crypto Academy</h1>
          <p className="text-gray-300">Masuk ke dashboard admin yang aman</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              placeholder="Masukkan username"
              required
              disabled={loading || lockoutTime > 0}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 pr-12"
                placeholder="Masukkan password"
                required
                disabled={loading || lockoutTime > 0}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={loading || lockoutTime > 0}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {showPasswordRequirements && password && !passwordValidation.isValid && (
              <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm font-medium">Persyaratan Password:</span>
                </div>
                <ul className="text-yellow-200 text-xs space-y-1">
                  {passwordValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          {lockoutTime > 0 && (
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 text-sm">
                  Akun terkunci. Coba lagi dalam: {formatLockoutTime(lockoutTime)}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || lockoutTime > 0}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memverifikasi...
              </div>
            ) : lockoutTime > 0 ? (
              'Akun Terkunci'
            ) : (
              'Masuk Aman'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
          <p className="text-blue-300 text-sm text-center">
            <strong>Demo Login:</strong><br />
            Username: admin<br />
            Password: Admin123!
          </p>
        </div>

        {/* Security Features */}
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Fitur Keamanan:</span>
          </div>
          <ul className="text-green-200 text-xs space-y-1">
            <li>• Bcrypt hashing dengan salt rounds 12</li>
            <li>• Rate limiting & brute force protection</li>
            <li>• Session timeout & secure storage</li>
            <li>• Input sanitization & CSRF protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;