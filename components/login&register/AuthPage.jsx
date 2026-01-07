"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState('login'); 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    resetToken: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (/\d/.test(name)) return 'Name cannot contain numbers';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    if (!/^\d{10}$/.test(phone)) return 'Phone number must be exactly 10 digits';
    if (!phone.startsWith('98') && !phone.startsWith('97') && !phone.startsWith('96')) {
      return 'Phone number must start with 98, 97, or 96';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const validateVerificationCode = (code) => {
    if (!code.trim()) return 'Verification code is required';
    if (!/^\d{6}$/.test(code)) return 'Verification code must be 6 digits';
    return '';
  };

  useEffect(() => {
    const newErrors = {};

    if (touched.fullName && view === 'signup') {
      const error = validateName(formData.fullName);
      if (error) newErrors.fullName = error;
    }

    if (touched.email) {
      const error = validateEmail(formData.email);
      if (error) newErrors.email = error;
    }

    if (touched.phoneNumber && view === 'signup') {
      const error = validatePhone(formData.phoneNumber);
      if (error) newErrors.phoneNumber = error;
    }

    if (touched.password && (view === 'login' || view === 'signup' || view === 'reset')) {
      const error = validatePassword(formData.password);
      if (error) newErrors.password = error;
    }

    if (touched.confirmPassword && (view === 'signup' || view === 'reset')) {
      const error = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (error) newErrors.confirmPassword = error;
    }

    if (touched.verificationCode && (view === 'verify' || view === 'reset')) {
      const error = validateVerificationCode(formData.verificationCode);
      if (error) newErrors.verificationCode = error;
    }

    setErrors(newErrors);
  }, [formData, touched, view]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const allTouched = {
      fullName: true,
      email: true,
      phoneNumber: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allTouched);

    const newErrors = {};
    const nameError = validateName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phoneNumber);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (nameError) newErrors.fullName = nameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phoneNumber = phoneError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/auth/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Added for cookie support
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setPendingEmail(formData.email);
        setSuccess(data.message);
        setErrors({});
        setView('verify');
        setFormData(prev => ({ ...prev, verificationCode: '' }));
        setTouched({});
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setTouched({ verificationCode: true });

    const codeError = validateVerificationCode(formData.verificationCode);
    if (codeError) {
      setErrors({ verificationCode: codeError });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/auth/verify_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Added for cookie support
        body: JSON.stringify({
          email: pendingEmail,
          code: formData.verificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setErrors({});
        setTimeout(() => {
          switchView('login');
        }, 2000);
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });

    const newErrors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRITICAL: This allows cookies to be set
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
  const redirect =
    data.type === 'admin'
      ? '/admin/dashboard'
      : '/dashboard';

  setTimeout(() => {
    router.push(redirect);
    router.refresh();
  }, 800);


      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setTouched({ email: true });

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/auth/forget_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Added for cookie support
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (data.success) {
        setPendingEmail(formData.email);
        setSuccess(data.message);
        setErrors({});
        setView('reset');
        setFormData(prev => ({ ...prev, verificationCode: '', password: '', confirmPassword: '' }));
        setTouched({});
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    setTouched({ verificationCode: true, password: true, confirmPassword: true });

    const newErrors = {};
    const codeError = validateVerificationCode(formData.verificationCode);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (codeError) newErrors.verificationCode = codeError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/auth/reset_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Added for cookie support
        body: JSON.stringify({
          email: pendingEmail,
          code: formData.verificationCode,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setErrors({});
        setTimeout(() => {
          switchView('login');
        }, 2000);
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
      resetToken: ''
    });
    setErrors({});
    setTouched({});
    setSuccess('');
    setPendingEmail('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {view === 'login' && 'Welcome Back'}
          {view === 'signup' && 'Create Account'}
          {view === 'forgot' && 'Reset Password'}
          {view === 'verify' && 'Verify Email'}
          {view === 'reset' && 'Reset Password'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {view === 'login' && 'Login to your account'}
          {view === 'signup' && 'Sign up to get started'}
          {view === 'forgot' && 'Enter your email to receive reset code'}
          {view === 'verify' && 'Enter the 6-digit code sent to your email'}
          {view === 'reset' && 'Enter verification code and new password'}
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errors.submit}
          </div>
        )}

        <div className="space-y-4">
          {view === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your Name "
                />
                {errors.fullName && touched.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="abc@gmail.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="98XXXXXXXX"
                  maxLength="10"
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </>
          )}

          {view === 'login' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <button
                  onClick={() => switchView('forgot')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 transition"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
            </>
          )}

          {view === 'forgot' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Send Reset Code'}
              </button>
            </>
          )}

          {view === 'verify' && (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Verification code sent to <span className="font-semibold">{pendingEmail}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest ${
                    errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000000"
                  maxLength="6"
                />
                {errors.verificationCode && touched.verificationCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>
                )}
              </div>

              <button
                onClick={handleVerifyEmail}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </>
          )}

          {view === 'reset' && (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Reset code sent to <span className="font-semibold">{pendingEmail}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest ${
                    errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000000"
                  maxLength="6"
                />
                {errors.verificationCode && touched.verificationCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          {(view === 'forgot' || view === 'verify' || view === 'reset') ? (
            <button
              onClick={() => switchView('login')}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
            >
              Back to Login
            </button>
          ) : (
            <p className="text-gray-600">
              {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => switchView(view === 'login' ? 'signup' : 'login')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
              >
                {view === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 