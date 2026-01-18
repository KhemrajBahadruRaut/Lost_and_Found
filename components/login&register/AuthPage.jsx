"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  ShieldCheck
} from 'lucide-react';

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

  // --- LOGIC STARTS (UNCHANGED) ---
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: pendingEmail, code: formData.verificationCode })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setErrors({});
        setTimeout(() => { switchView('login'); }, 2000);
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
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });

    const data = await response.json();

    if (data.success) {
      if (data.user) {
        // Backend returns { id, name, email } - store it properly
        const userData = {
          id: data.user.id,
          name: data.user.name, // This comes from backend as 'name'
          email: data.user.email,
          role: 'User' // Default role for regular users
        };
        
        // Store with the key that Navbar expects
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Trigger event so Navbar updates immediately
        window.dispatchEvent(new Event('userUpdated'));
      }
      
      // Handle admin login separately
      if (data.type === 'admin' && data.token) {
        localStorage.setItem('admin_token', data.token);
        // For admin, create a minimal user object
        const adminUser = {
          id: 'admin',
          name: 'Admin',
          email: formData.email,
          role: 'Admin'
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        window.dispatchEvent(new Event('userUpdated'));
      }

      // Redirect based on user type
      const redirect = data.type === 'admin' ? '/admin' : '/dashboard';
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: pendingEmail, code: formData.verificationCode, password: formData.password })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setErrors({});
        setTimeout(() => { switchView('login'); }, 2000);
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
  // --- LOGIC ENDS ---

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Brand/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-600/30">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'verify' && 'Verify Email'}
            {view === 'reset' && 'New Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {view === 'login' && 'Please enter your details to sign in.'}
            {view === 'signup' && 'Join our community today.'}
            {view === 'forgot' && 'Enter your email to receive a reset code.'}
            {view === 'verify' && <span>We sent a 6-digit code to <span className="font-medium text-indigo-600">{pendingEmail}</span></span>}
            {view === 'reset' && 'Secure your account with a new password.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-8 animate-in fade-in zoom-in duration-300">
          
          {/* Alerts */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-start gap-3">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{errors.submit}</span>
            </div>
          )}

          <div className="space-y-5">
            {view === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.fullName && touched.fullName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="Your Full Name"
                    />
                  </div>
                  {errors.fullName && touched.fullName && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email && touched.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="abc@example.com"
                    />
                  </div>
                  {errors.email && touched.email && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength="10"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.phoneNumber && touched.phoneNumber ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.password && touched.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && touched.password && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.confirmPassword}</p>}
                </div>

                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18}/></>}
                </button>
              </>
            )}

            {view === 'login' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email && touched.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && touched.email && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.password && touched.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && touched.password && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => switchView('forgot')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors hover:underline underline-offset-4"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18}/></>}
                </button>
              </>
            )}

            {view === 'forgot' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email && touched.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && touched.email && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                </div>

                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Code'}
                </button>
              </>
            )}

            {view === 'verify' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">6-Digit Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.verificationCode && touched.verificationCode ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200 text-center text-xl tracking-[0.5em] font-mono`}
                      placeholder="000000"
                      maxLength="6"
                    />
                  </div>
                  {errors.verificationCode && touched.verificationCode && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.verificationCode}</p>}
                </div>

                <button
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify Email'}
                </button>
              </>
            )}

            {view === 'reset' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Verification Code</label>
                  <div className="relative">
                     <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.verificationCode && touched.verificationCode ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200 text-center text-xl tracking-[0.5em] font-mono`}
                      placeholder="000000"
                      maxLength="6"
                    />
                  </div>
                  {errors.verificationCode && touched.verificationCode && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.verificationCode}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.password && touched.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && touched.password && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.confirmPassword}</p>}
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                </button>
              </>
            )}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            {(view === 'forgot' || view === 'verify' || view === 'reset') ? (
              <button
                onClick={() => switchView('login')}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowRight className="rotate-180" size={16}/> Back to Login
              </button>
            ) : (
              <p className="text-gray-600 text-sm">
                {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => switchView(view === 'login' ? 'signup' : 'login')}
                  className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors hover:underline"
                >
                  {view === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}