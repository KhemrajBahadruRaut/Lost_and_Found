'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, Menu, Bell, User, Settings, ChevronDown, 
  Box, Search, PlusCircle, LayoutGrid, List, Zap, X 
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Used to detect active page
  
  // --- State ---
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // --- Effects ---

  useEffect(() => {
    // 1. Function to load user from local storage
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      try {
        if (userData && userData !== "undefined" && userData !== "null") {
          const parsed = JSON.parse(userData);
          // Ensure we handle both 'name' and 'full_name' if your backend varies
          const cleanUser = {
             ...parsed,
             name: parsed.full_name || parsed.name // Prioritize full_name if available
          };
          setUser(cleanUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    // 2. Initial Load
    loadUser();

    // 3. LISTEN FOR UPDATES (This fixes the guest issue)
    window.addEventListener('userUpdated', loadUser);
    
    // 4. Handle Scroll
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // 5. Click Outside Profile
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      window.removeEventListener('userUpdated', loadUser); // Remove listener
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await fetch('http://localhost/lost_and_found_backend/auth/logout.php', {
        method: 'POST',
        credentials: 'include', 
      });
      localStorage.clear();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // --- Navigation Links Data ---
  const navLinks = [
    { name: 'Feed', href: '/dashboard', icon: LayoutGrid },
    { name: 'Report Lost', href: '/post-lost', icon: PlusCircle },
    { name: 'Report Found', href: '/post-found', icon: Search },
    { name: 'My Posts', href: '/my-posts', icon: List },
    { name: 'Matches', href: '/matches', icon: Zap },
  ];

  return (
    <motion.nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-sm' 
          : 'bg-white/50 backdrop-blur-md border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* 1. Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform">
               <Box size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FynDR
            </span>
          </Link>

          {/* 2. Desktop Navigation (Centered Pill) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-2 ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200/50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {/* Optional: Show icon only on active or always */}
                    {/* <link.icon size={14} /> */} 
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* 3. Right Actions (Bell & Profile) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notification */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            
            <div className="h-6 w-px bg-slate-200" />
            
            {/* User Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 focus:outline-none group"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Guest'}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user?.role || 'User'}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-md group-hover:shadow-blue-500/20 transition-all">
                   <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-blue-700 font-bold text-xs">
                     {getInitials(user?.name)}
                   </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Dropdown Menu */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 overflow-hidden"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm text-slate-900 font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <User size={16} className="mr-2" /> View Profile
                      </Link>
                      <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Settings size={16} className="mr-2" /> Settings
                      </Link>
                    </div>
                    
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 4. Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button className="relative text-slate-600">
               <Bell size={20} />
               <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
             </button>
             <button 
               onClick={() => setMenuOpen(!menuOpen)} 
               className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
             >
               {menuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu (Slide Down) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
               {/* Mobile User Info */}
               <div className="flex items-center mb-6 pb-6 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 mr-3">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                     <div className="font-bold text-slate-900">{user?.name}</div>
                     <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
               </div>

               {/* Mobile Links */}
               {navLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium ${
                      pathname === link.href 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon size={18} className="mr-3 opacity-70" />
                    {link.name}
                  </Link>
               ))}

               {/* Mobile Actions */}
               <div className="pt-4 mt-4 border-t border-slate-100">
                 <Link href="/profile" className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <User size={18} className="mr-3 opacity-70" /> Profile
                 </Link>
                 <Link href="/settings" className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <Settings size={18} className="mr-3 opacity-70" /> Settings
                 </Link>
                 <button 
                   onClick={handleLogout} 
                   className="w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 mt-2"
                 >
                   <LogOut size={18} className="mr-3 opacity-70" /> Logout
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}