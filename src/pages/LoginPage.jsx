import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.koshpal.com/api/v1';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const validateEmail = (email) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!emailDomain) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  // Validate password requirements
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate email and password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password, role },
        { withCredentials: true }
      );

      // Redirect to the portal
      window.location.href = response.data.redirectUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // Get dashboard name based on role
  const getDashboardName = () => {
    const dashboardNames = {
      EMPLOYEE: 'Employee',
      HR: 'HR',
      COACH: 'Coach',
      ADMIN: 'Admin',
    };
    return dashboardNames[role] || 'your';
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#fff' }}>
      <div className="w-full max-w-md p-10 bg-white shadow-xl rounded-2xl">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <img src="/logo.png" alt="Koshpal Logo" className='h-10' />
          <h1 style={{ 
            fontFamily: 'Outfit, sans-serif', 
            fontWeight: 600, 
            fontSize: '18px', 
            lineHeight: '26px',
            letterSpacing: '0.01em',
            color: '#262626'
          }}>
            Koshpal
          </h1>
        </div>

        {/* Welcome Text */}
        <div className="mb-8">
          <h2 style={{ 
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            fontSize: '28px',
            lineHeight: '36px',
            letterSpacing: '0',
            color: '#262626',
            marginBottom: '8px'
          }}>
            Welcome back
          </h2>
          <p style={{ 
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.01em',
            color: '#666666'
          }}>
            Sign in to access your financial dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg" style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '12px',
              color: '#d5332a',
              backgroundColor: '#fff0f0',
              border: '1px solid #fad3d1'
            }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block mb-2" style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0.04em',
              color: '#262626'
            }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute transform -translate-y-1/2 left-3 top-1/2" style={{ 
                width: '18px', 
                height: '18px',
                color: '#808080'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onBlur={() => validateEmail(email)}
                className="w-full py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.01em',
                  color: '#262626',
                  backgroundColor: '#f5f5f5',
                  border: emailError ? '1px solid #d5332a' : '1px solid #e0e0e0'
                }}
                placeholder="Enter your email"
                required
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = emailError ? '#d5332a' : '#334eac';
                  e.target.style.boxShadow = emailError ? '0 0 0 2px rgba(213, 51, 42, 0.1)' : '0 0 0 2px rgba(51, 78, 172, 0.1)';
                }}
              />
            </div>
            {emailError && (
              <p style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '12px',
                color: '#d5332a',
                marginTop: '4px'
              }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block mb-2" style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0.04em',
              color: '#262626'
            }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute transform -translate-y-1/2 left-3 top-1/2" style={{ 
                width: '18px', 
                height: '18px',
                color: '#808080'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onBlur={() => validatePassword(password)}
                className="w-full py-2.5 pl-10 pr-12 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.01em',
                  color: '#262626',
                  backgroundColor: '#f5f5f5',
                  border: passwordError ? '1px solid #d5332a' : '1px solid #e0e0e0'
                }}
                placeholder="Enter your password"
                required
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = passwordError ? '#d5332a' : '#334eac';
                  e.target.style.boxShadow = passwordError ? '0 0 0 2px rgba(213, 51, 42, 0.1)' : '0 0 0 2px rgba(51, 78, 172, 0.1)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transform -translate-y-1/2 right-3 top-1/2 hover:opacity-70"
                style={{ color: '#808080' }}
              >
                {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
              </button>
            </div>
            {passwordError && (
              <p style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '12px',
                color: '#d5332a',
                marginTop: '4px'
              }}>
                {passwordError}
              </p>
            )}
            {!passwordError && (
              <p style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '11px',
                color: '#999999',
                marginTop: '4px'
              }}>
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded focus:ring-2"
                style={{ 
                  accentColor: '#334eac',
                  borderColor: '#e0e0e0'
                }}
              />
              <span style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.01em',
                color: '#666666'
              }}>
                Remember me
              </span>
            </label>
            <a href="#" className="hover:opacity-80" style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.01em',
              color: '#17a2b8',
              textDecoration: 'none'
            }}>
              Forgot password?
            </a>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block mb-2" style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0.04em',
              color: '#262626'
            }}>
              Login As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-colors cursor-pointer"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.01em',
                color: '#262626',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#334eac';
                e.target.style.boxShadow = '0 0 0 2px rgba(51, 78, 172, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR</option>
              <option value="COACH">Coach</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 transition-all rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.06em',
              color: '#ffffff',
              background: 'linear-gradient(to right, #334eac, #17a2b8)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(to right, #081f5c, #117a8a)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'linear-gradient(to right, #334eac, #17a2b8)';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
