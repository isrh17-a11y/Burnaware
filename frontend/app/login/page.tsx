'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await ApiClient.login(formData.email, formData.password);
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
      } else {
        const user = await ApiClient.register(formData.email, formData.password, formData.name);
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom_right,#F5DE7A,#F2EEEC,#EFBF38,#E08600)] p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-[#F2EEEC]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-4 border border-[#763A12]/10">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-medium text-[#763A12]">BurnAware</span>
          </div>
          <h1 className="text-4xl font-bold text-[#763A12] mb-2">Welcome Back</h1>
          <p className="text-[#763A12]/80 text-lg">Your Mental Wellness Companion</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-[#F2EEEC]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-8 animate-fadeIn border border-[#763A12]/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue your wellness journey' : 'Start your wellness journey today'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B9FE8] focus:border-transparent bg-white/80"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B9FE8] focus:border-transparent bg-white/80"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B9FE8] focus:border-transparent bg-white/80"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E08600]/20 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-xs text-orange-800 text-center">
              <strong>Demo:</strong> Use any email/password to try the app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
