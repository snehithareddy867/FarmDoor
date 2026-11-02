import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  User, 
  Store, 
  Bike, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  FileText,
  Upload,
  Clock,
  KeyRound,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useFarmerAuth } from '../../context/FarmerAuthContext';
import { useDeliveryAuth } from '../../context/DeliveryAuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { storageService, STORAGE_KEYS } from '../../services/storage';

export default function AuthPage({ defaultRole = 'customer', defaultMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine initial role from URL params or props
  const paramRole = searchParams.get('role');
  const paramMode = searchParams.get('mode');

  const validRoles = ['customer', 'farmer', 'delivery', 'admin'];
  const initialRole = validRoles.includes(paramRole) ? paramRole : defaultRole;
  const initialMode = paramMode === 'register' ? 'register' : defaultMode;

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [mode, setMode] = useState(selectedRole === 'admin' ? 'login' : initialMode);

  // Auth Context Hooks
  const { login: customerLogin, register: customerRegister } = useCustomerAuth();
  const { login: farmerLogin, register: farmerRegister } = useFarmerAuth();
  const { login: deliveryLogin, register: deliveryRegister, switchDemoAccount } = useDeliveryAuth();
  const { login: adminLogin, switchDemoAdmin } = useAdminAuth();

  // Shared Form States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // 1. Customer Fields
  const [customerEmailOrPhone, setCustomerEmailOrPhone] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerReg, setCustomerReg] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
    acceptTerms: false
  });

  // 2. Farmer Fields
  const [farmerEmailOrPhone, setFarmerEmailOrPhone] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');
  const [farmerReg, setFarmerReg] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmAddress: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    farmType: '',
    productsGrown: '',
    farmDescription: '',
    acceptTerms: false
  });

  // 3. Delivery Partner Fields
  const [deliveryEmailOrPhone, setDeliveryEmailOrPhone] = useState('');
  const [deliveryPassword, setDeliveryPassword] = useState('');
  const [deliveryReg, setDeliveryReg] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    vehicleType: 'Two-Wheeler',
    vehicleNumber: '',
    acceptTerms: false
  });

  // 4. Admin Fields
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Sync state when role or mode changes in URL
  useEffect(() => {
    if (paramRole && validRoles.includes(paramRole) && paramRole !== selectedRole) {
      setSelectedRole(paramRole);
      if (paramRole === 'admin') setMode('login');
    }
  }, [paramRole]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    // Admin has no register mode
    const newMode = role === 'admin' ? 'login' : mode;
    setMode(newMode);
    setSearchParams({ role, mode: newMode });
  };

  const handleSelectMode = (newMode) => {
    if (selectedRole === 'admin' && newMode === 'register') return;
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    setSearchParams({ role: selectedRole, mode: newMode });
  };

  // ==========================================
  // SUBMISSION HANDLERS
  // ==========================================

  // A. Customer Login / Register
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!customerEmailOrPhone.trim()) throw new Error('Please enter your email or phone number.');
        if (!customerPassword) throw new Error('Please enter your password.');
        await customerLogin({ emailOrPhone: customerEmailOrPhone.trim(), password: customerPassword });
        navigate('/customer/dashboard', { replace: true });
      } else {
        if (!customerReg.fullName.trim()) throw new Error('Full name is required.');
        if (!customerReg.email.trim() || !customerReg.email.includes('@')) throw new Error('Valid email address is required.');
        if (customerReg.mobile.length < 10) throw new Error('Valid 10-digit mobile number is required.');
        if (customerReg.password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (customerReg.password !== customerReg.confirmPassword) throw new Error('Passwords do not match.');
        if (!customerReg.acceptTerms) throw new Error('Please accept the Terms of Service.');

        await customerRegister(customerReg);
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Customer authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // B. Farmer Login / Register
  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!farmerEmailOrPhone.trim()) throw new Error('Please enter your email or registered mobile.');
        if (!farmerPassword) throw new Error('Please enter your password.');
        await farmerLogin({ emailOrPhone: farmerEmailOrPhone.trim(), password: farmerPassword });
        navigate('/farmer/dashboard', { replace: true });
      } else {
        if (!farmerReg.fullName.trim()) throw new Error('Grower full name is required.');
        if (!farmerReg.farmName.trim()) throw new Error('Farm or orchard name is required.');
        if (!farmerReg.email.trim()) throw new Error('Email address is required.');
        if (farmerReg.mobile.length < 10) throw new Error('Valid 10-digit mobile number is required.');
        if (farmerReg.password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (farmerReg.password !== farmerReg.confirmPassword) throw new Error('Passwords do not match.');
        if (!farmerReg.acceptTerms) throw new Error('Please accept the Farmer Charter & Terms.');

        const payload = {
          ...farmerReg,
          productsGrown: farmerReg.productsGrown.split(',').map((p) => p.trim()).filter(Boolean),
          documents: [
            { name: 'Government_Photo_ID.pdf', type: 'ID Proof', status: 'Under Review' },
            { name: 'Land_7-12_Ownership_Extract.pdf', type: 'Land Ownership', status: 'Under Review' },
            { name: 'NPOP_Organic_Soil_Audit.pdf', type: 'Organic Certification', status: 'Under Review' }
          ]
        };

        await farmerRegister(payload);
        navigate('/farmer/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Farmer authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // C. Delivery Partner Login / Register
  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!deliveryEmailOrPhone.trim()) throw new Error('Please enter your email or courier phone.');
        if (!deliveryPassword) throw new Error('Please enter your password.');
        await deliveryLogin({ emailOrPhone: deliveryEmailOrPhone.trim(), password: deliveryPassword });
        navigate('/delivery/dashboard', { replace: true });
      } else {
        if (!deliveryReg.fullName.trim()) throw new Error('Full legal name is required.');
        if (!deliveryReg.email.trim()) throw new Error('Email address is required.');
        if (deliveryReg.mobile.length < 10) throw new Error('Valid mobile number is required.');
        if (!deliveryReg.vehicleNumber.trim()) throw new Error('Vehicle registration number is required.');
        if (deliveryReg.password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (deliveryReg.password !== deliveryReg.confirmPassword) throw new Error('Passwords do not match.');
        if (!deliveryReg.acceptTerms) throw new Error('Please accept the Courier Agreement.');

        const payload = {
          ...deliveryReg,
          name: deliveryReg.fullName,
          phone: deliveryReg.mobile,
          documents: [
            { name: 'Driving_License.pdf', type: 'Driving License', status: 'Under Review' },
            { name: 'Aadhaar_Card.pdf', type: 'Government ID', status: 'Under Review' },
            { name: 'Vehicle_Registration_RC.pdf', type: 'Vehicle RC', status: 'Under Review' }
          ]
        };

        await deliveryRegister(payload);
        navigate('/delivery/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Delivery authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // D. Admin Login (Login ONLY)
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!adminIdentifier.trim()) throw new Error('Please enter admin email or username.');
      if (!adminPassword) throw new Error('Please enter password.');
      const res = await adminLogin(adminIdentifier.trim(), adminPassword);
      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        throw new Error(res.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 3500);
  };

  // Role Configurations
  const roleCards = [
    {
      id: 'customer',
      title: 'Customer',
      tagline: 'Household Shopper',
      desc: 'Order dawn-fresh harvests directly from verified regional growers.',
      icon: User,
      color: 'emerald',
      badgeBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'farmer',
      title: 'Farmer',
      tagline: 'Agricultural Grower',
      desc: 'List seasonal produce, set farm gate prices, and receive direct weekly payouts.',
      icon: Sprout,
      color: 'amber',
      badgeBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      tagline: 'Eco-Fleet Courier',
      desc: 'Pick up crates from farms or hubs and deliver fresh to urban households.',
      icon: Bike,
      color: 'blue',
      badgeBg: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'admin',
      title: 'Admin',
      tagline: 'Platform Governance',
      desc: 'Audit farmer KYC, moderate listings, monitor deliveries, and resolve disputes.',
      icon: ShieldCheck,
      color: 'cyan',
      badgeBg: 'bg-cyan-100 text-cyan-800'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f2] text-[#081c15] flex flex-col justify-between selection:bg-[#52b788] selection:text-[#081c15]">
      {/* Top Header Branding */}
      <header className="bg-[#081c15] border-b border-[#2d6a4f]/40 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-[#52b788]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-outfit font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                Farm to Home
                <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#95d5b2]">
                Unified Authentication Portal
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <span>Back to Storefront</span>
            <ChevronRight className="w-4 h-4 text-[#52b788]" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d6a4f]/15 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-2 border border-[#2d6a4f]/25">
            <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
            Choose Your Account Type
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-outfit text-[#081c15] tracking-tight">
            Sign In or Create Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Select your role below to access your dedicated workspace, manage orders, and view live market stats.
          </p>
        </div>

        {/* 1. Four Clearly Separated Account Options */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {roleCards.map((rc) => {
            const Icon = rc.icon;
            const isSelected = selectedRole === rc.id;

            return (
              <button
                key={rc.id}
                type="button"
                onClick={() => handleSelectRole(rc.id)}
                className={`relative text-left p-4 sm:p-5 rounded-3xl transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#081c15] text-white border-[#52b788] shadow-xl scale-[1.02]'
                    : 'bg-white hover:bg-[#faf8f2] text-gray-800 border-gray-200/80 shadow-sm hover:border-[#52b788]/60 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#52b788] text-[#081c15]'
                        : 'bg-gray-100 text-[#081c15]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#52b788] animate-ping" />
                    )}
                  </div>

                  <h3 className={`font-outfit font-black text-base sm:text-lg leading-tight ${
                    isSelected ? 'text-white' : 'text-[#081c15]'
                  }`}>
                    {rc.title}
                  </h3>
                  <span className={`text-[11px] font-bold block mt-0.5 ${
                    isSelected ? 'text-[#52b788]' : 'text-gray-500'
                  }`}>
                    {rc.tagline}
                  </span>
                </div>

                <p className={`text-[11px] mt-3 line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {rc.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* 2. Login / Signup Form Card */}
        <div className="bg-white rounded-[2rem] border border-[#2d6a4f]/20 shadow-xl overflow-hidden max-w-2xl mx-auto">
          {/* Sub-header / Mode Selector */}
          <div className="bg-[#081c15] px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b4332]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52b788]">
                  {selectedRole.toUpperCase()} ACCESS
                </span>
                {selectedRole === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                    Governance Console
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-outfit text-white mt-0.5">
                {selectedRole === 'admin'
                  ? 'Administrator Sign In'
                  : mode === 'login'
                  ? `${roleCards.find((r) => r.id === selectedRole)?.title} Sign In`
                  : `Register as ${roleCards.find((r) => r.id === selectedRole)?.title}`}
              </h2>
            </div>

            {/* Mode Switch (Sign In vs Register) - Hidden for Admin */}
            {selectedRole !== 'admin' ? (
              <div className="grid grid-cols-2 p-1 bg-[#133926] rounded-2xl border border-[#2d6a4f]/50 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSelectMode('login')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#52b788] text-[#081c15] shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('register')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                    mode === 'register'
                      ? 'bg-[#52b788] text-[#081c15] shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Pre-Authorized Access Only</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="p-3.5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* ROLE 1: CUSTOMER FORM                                    */}
            {/* ========================================================= */}
            {selectedRole === 'customer' && (
              <form onSubmit={handleCustomerSubmit} className="space-y-4 text-xs">
                {mode === 'login' ? (
                  <>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        Email Address or 10-Digit Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="name@example.com or 9876543210"
                        value={customerEmailOrPhone}
                        onChange={(e) => setCustomerEmailOrPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-gray-700 font-bold">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[#1b4332] hover:text-[#52b788] font-bold underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#52b788] border-t-transparent rounded-full animate-spin" />
                          <span>Signing in to Customer Portal...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In as Customer</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={customerReg.fullName}
                          onChange={(e) => setCustomerReg({ ...customerReg, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={customerReg.email}
                          onChange={(e) => setCustomerReg({ ...customerReg, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile"
                          value={customerReg.mobile}
                          onChange={(e) => setCustomerReg({ ...customerReg, mobile: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={customerReg.city}
                          onChange={(e) => setCustomerReg({ ...customerReg, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Delivery Address</label>
                      <input
                        type="text"
                        required
                        placeholder="House / Flat No, Society, Street"
                        value={customerReg.deliveryAddress}
                        onChange={(e) => setCustomerReg({ ...customerReg, deliveryAddress: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="At least 6 characters"
                          value={customerReg.password}
                          onChange={(e) => setCustomerReg({ ...customerReg, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Confirm Password</label>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter password"
                          value={customerReg.confirmPassword}
                          onChange={(e) => setCustomerReg({ ...customerReg, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={customerReg.acceptTerms}
                        onChange={(e) => setCustomerReg({ ...customerReg, acceptTerms: e.target.checked })}
                        className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                      />
                      <span className="text-gray-600 text-[11px]">
                        I accept the <a href="#terms" className="underline font-bold text-[#081c15]">Terms of Trade</a> and harvest delivery guidelines.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Creating Customer Account...' : 'Complete Registration & Open Dashboard'}
                    </button>
                  </>
                )}
              </form>
            )}

            {/* ========================================================= */}
            {/* ROLE 2: FARMER FORM                                      */}
            {/* ========================================================= */}
            {selectedRole === 'farmer' && (
              <form onSubmit={handleFarmerSubmit} className="space-y-4 text-xs">
                {mode === 'login' ? (
                  <>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        Farmer Email or Registered Mobile
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ramesh.greenvalley@farmtohome.in"
                        value={farmerEmailOrPhone}
                        onChange={(e) => setFarmerEmailOrPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-gray-700 font-bold">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[#1b4332] hover:text-[#52b788] font-bold underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={farmerPassword}
                          onChange={(e) => setFarmerPassword(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#52b788] border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating Farmer...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Farmer Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Grower Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Balwant Deshmukh"
                          value={farmerReg.fullName}
                          onChange={(e) => setFarmerReg({ ...farmerReg, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Farm / Estate Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sahyadri Agro Collective"
                          value={farmerReg.farmName}
                          onChange={(e) => setFarmerReg({ ...farmerReg, farmName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="grower@farmtohome.in"
                          value={farmerReg.email}
                          onChange={(e) => setFarmerReg({ ...farmerReg, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Mobile</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit phone"
                          value={farmerReg.mobile}
                          onChange={(e) => setFarmerReg({ ...farmerReg, mobile: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Village</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dindori"
                          value={farmerReg.village}
                          onChange={(e) => setFarmerReg({ ...farmerReg, village: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">District</label>
                        <input
                          type="text"
                          required
                          value={farmerReg.district}
                          onChange={(e) => setFarmerReg({ ...farmerReg, district: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={farmerReg.state}
                          onChange={(e) => setFarmerReg({ ...farmerReg, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Products Grown / Harvest Types</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Heirloom Vine Tomatoes, Khapli Wheat, Mustard Greens"
                        value={farmerReg.productsGrown}
                        onChange={(e) => setFarmerReg({ ...farmerReg, productsGrown: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Password</label>
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={farmerReg.password}
                          onChange={(e) => setFarmerReg({ ...farmerReg, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Confirm Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Re-enter password"
                          value={farmerReg.confirmPassword}
                          onChange={(e) => setFarmerReg({ ...farmerReg, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                      <strong>Verification Notice:</strong> New farmer accounts are created in <em>Pending</em> verification status. You can configure your farm profile and add listings immediately, which activate once admin audits your credentials.
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={farmerReg.acceptTerms}
                        onChange={(e) => setFarmerReg({ ...farmerReg, acceptTerms: e.target.checked })}
                        className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                      />
                      <span className="text-gray-600 text-[11px]">
                        I accept the <a href="#charter" className="underline font-bold text-[#081c15]">Fair Farmer Charter</a> and organic quality audit terms.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Submitting Farmer Registration...' : 'Register as Farmer & Open Workspace'}
                    </button>
                  </>
                )}
              </form>
            )}

            {/* ========================================================= */}
            {/* ROLE 3: DELIVERY PARTNER FORM                            */}
            {/* ========================================================= */}
            {selectedRole === 'delivery' && (
              <form onSubmit={handleDeliverySubmit} className="space-y-4 text-xs">
                {mode === 'login' ? (
                  <>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        Courier Email or Registered Mobile
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="santosh.kumar@eco-fleet.in"
                        value={deliveryEmailOrPhone}
                        onChange={(e) => setDeliveryEmailOrPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-gray-700 font-bold">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[#1b4332] hover:text-[#52b788] font-bold underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={deliveryPassword}
                          onChange={(e) => setDeliveryPassword(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#52b788] border-t-transparent rounded-full animate-spin" />
                          <span>Signing in to Fleet Portal...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In as Delivery Partner</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sunil Verma"
                          value={deliveryReg.fullName}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="sunil@eco-fleet.in"
                          value={deliveryReg.email}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit phone"
                          value={deliveryReg.mobile}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, mobile: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Vehicle Type</label>
                        <select
                          value={deliveryReg.vehicleType}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, vehicleType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        >
                          <option value="Electric Two-Wheeler (EV)">Electric Two-Wheeler (EV)</option>
                          <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                          <option value="Electric Cargo Van">Electric Cargo Van</option>
                          <option value="Eco Bicycle">Eco Bicycle (Micro-hub local)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Vehicle Registration Number</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MH 12 EV 9901"
                          value={deliveryReg.vehicleNumber}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, vehicleNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Operating City</label>
                        <input
                          type="text"
                          required
                          value={deliveryReg.city}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Password</label>
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={deliveryReg.password}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">Confirm Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Re-enter password"
                          value={deliveryReg.confirmPassword}
                          onChange={(e) => setDeliveryReg({ ...deliveryReg, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#2d6a4f]/30 bg-[#faf8f2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={deliveryReg.acceptTerms}
                        onChange={(e) => setDeliveryReg({ ...deliveryReg, acceptTerms: e.target.checked })}
                        className="rounded text-[#2d6a4f] focus:ring-[#52b788]"
                      />
                      <span className="text-gray-600 text-[11px]">
                        I accept the <a href="#rider-agreement" className="underline font-bold text-[#081c15]">Fleet Partner Agreement</a> and payout rates.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Submitting Application...' : 'Apply as Delivery Partner & Launch Dashboard'}
                    </button>
                  </>
                )}
              </form>
            )}

            {/* ========================================================= */}
            {/* ROLE 4: ADMIN FORM (LOGIN ONLY - NO SIGNUP PER SPEC)     */}
            {/* ========================================================= */}
            {selectedRole === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                {/* Security Restriction Banner */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 text-white flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-cyan-300">Restricted Administration Access</h4>
                    <p className="text-gray-300 text-[11px] mt-0.5 leading-relaxed">
                      Public registration is strictly disabled for administrator accounts. Only pre-configured personnel with cryptographic permissions can authenticate.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Admin Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="admin@farmtohome.in or devendra"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-gray-300 bg-[#faf8f2] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-950 text-cyan-300 hover:bg-slate-900 font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 border border-cyan-500/40"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying System Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Authenticate & Enter Admin Console</span>
                    </>
                  )}
                </button>


              </form>
            )}
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-black font-outfit text-[#081c15]">Reset Your Password</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter your registered email or phone. We will dispatch an instant password reset token.
            </p>

            {forgotSent ? (
              <div className="my-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verification code dispatched to your phone/email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email or Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter registered account identifier"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-[#faf8f2] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#081c15] text-[#52b788] hover:bg-[#1b4332] font-bold"
                  >
                    Send OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="bg-[#05140f] border-t border-[#1b4332] py-6 px-4 text-center text-xs text-gray-500">
        <p>© 2026 Farm to Home Agricultural Marketplace. Secure Unified Role-Based Authentication System.</p>
      </footer>
    </div>
  );
}

