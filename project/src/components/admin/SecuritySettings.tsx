import React, { useState } from 'react';
import { Shield, Key, Clock, AlertTriangle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePasswordStrength, SECURITY_CONFIG } from '../../utils/security';

/**
 * SecuritySettings Component
 * This component allows the admin user to view their session information,
 * see the current security configuration of the application, and change their password.
 */
const SecuritySettings: React.FC = () => {
  // --- HOOKS --- //
  const { changePassword, sessionInfo, logout } = useAuth();

  // --- STATE MANAGEMENT --- //
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- DERIVED STATE & VALIDATION --- //
  const passwordValidation = validatePasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  // --- EVENT HANDLERS --- //

  /**
   * Handles the submission of the password change form.
   */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      setMessage({ type: 'error', text: 'New password does not meet security requirements' });
      return;
    }

    if (!passwordsMatch) {
      setMessage({ type: 'error', text: 'Password confirmation does not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Call the changePassword function from the AuthContext.
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Password changed successfully. Please log in again.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Automatically log the user out after a successful password change.
      setTimeout(() => {
        logout();
      }, 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to change password' });
    }
    
    setLoading(false);
  };

  // --- HELPER FUNCTIONS --- //

  const formatSessionTime = (timestamp: number): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const getSessionDuration = (): string => {
    if (!sessionInfo) return '0 minutes';
    
    const duration = Date.now() - sessionInfo.createdAt;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    }
    return `${minutes} minutes`;
  };

  // --- RENDER --- //
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Security Settings</h1>
        <p className="text-gray-300">Manage your account security and login sessions.</p>
      </div>

      {/* Session Information Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Session Information</h2>
        </div>
        
        {/* FIXED: Added a check to ensure sessionInfo exists before rendering its properties */}
        {sessionInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Session ID</label>
                <p className="text-white font-mono text-sm bg-white/5 p-2 rounded break-all">
                  {/* Defensive check for sessionId before calling substring */}
                  {sessionInfo.sessionId ? `${sessionInfo.sessionId.substring(0, 16)}...` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Login Time</label>
                <p className="text-white">{formatSessionTime(sessionInfo.createdAt)}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Last Activity</label>
                <p className="text-white">{formatSessionTime(sessionInfo.lastActivity)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Session Duration</label>
                <p className="text-white">{getSessionDuration()}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Session information is currently unavailable.</p>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 pr-12"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 pr-12"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {newPassword && !passwordValidation.isValid && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm font-medium">Password Requirements:</span>
                </div>
                <ul className="text-red-200 text-xs space-y-1">
                  {passwordValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 pr-12"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-red-400 text-sm">Passwords do not match</p>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Security Configuration Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Security Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-400">Salt Rounds</label>
            <p className="text-white">{SECURITY_CONFIG.SALT_ROUNDS}</p>
          </div>
          <div>
            <label className="text-gray-400">Max Login Attempts</label>
            <p className="text-white">{SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS}</p>
          </div>
          <div>
            <label className="text-gray-400">Lockout Duration</label>
            <p className="text-white">{SECURITY_CONFIG.LOCKOUT_DURATION / 60000} minutes</p>
          </div>
          <div>
            <label className="text-gray-400">Session Timeout</label>
            <p className="text-white">{SECURITY_CONFIG.SESSION_TIMEOUT / (60000 * 60)} hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
