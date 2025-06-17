'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [memberCode, setMemberCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!memberCode || !password) {
        setError('Please enter both member code and password.');
        setIsLoading(false);
        return;
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberCode, password }),
      });

      if (res.ok) {
        router.push('/');
        console.log('Login successful');
      } else {
        setError('Incorrect member code or password.');
      }
    } catch (err) {
      console.log('Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(100, 0, 0, 0.85) 0%, rgba(80, 0, 0, 0.9) 100%), url('./thapar.png')`
        }}
      />

      {/* Fallback background if image doesn't load */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-900"
        style={{ zIndex: -1 }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20">
            {/* Header with logo */}
            <div className="bg-gradient-to-r from-red-900 to-red-800 px-8 py-8 text-center relative overflow-hidden" style={{ backgroundColor: '#640000' }}>
              <div className="absolute inset-0 bg-white bg-opacity-10"></div>
              <div className="relative z-10">
                {/* Institute Logo */}
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="./tiet-small.png"
                    alt="TIET Logo"
                    className="w-full h-full object-contain filter drop-shadow-lg"
                    onError={(e) => {
                      // Fallback if logo doesn't load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full hidden items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                    <span className="text-3xl font-bold" style={{ color: '#640000' }}>TIET</span>
                  </div>
                </div>
                <h1 className="text-x1 sm:text-2xl lg:text-2xl font-bold mb-1 leading-tight" style={{ color: '#640000' }}>
                  Thapar Institute of Engineering & Technology
                </h1>
                <p className="text-sm font-medium" style={{ color: '#640000' }}>Student WebKiosk Portal</p>
              </div>
            </div>

            {/* Form section */}
            <div className="px-6 sm:px-8 py-8">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600 text-sm">Sign in to access your academic portal</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="memberCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enrollment No.
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="memberCode"
                      type="text"
                      value={memberCode}
                      onChange={(e) => setMemberCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit(e); 
                        }
                      }}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      style={{ focusRingColor: '#640000' }}
                      placeholder="Enter your enrollment number"
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #640000'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit(e); 
                        }
                      }}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter your password"
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #640000'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>
                </div>


                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  style={{
                    backgroundColor: '#640000',
                    focusRingColor: '#640000'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#500000'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#640000'}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  Need help? {' '}
                  <button
                    className="font-medium hover:underline"
                    style={{ color: '#640000' }}
                  >
                    Sorry this is just frontend over OG Webkiosk, no help available.
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-white text-opacity-90 text-sm">
            <p className="font-medium">© 2025 Someone free enough to build this!</p>
            <p className="mt-1">Patiala, Punjab, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}