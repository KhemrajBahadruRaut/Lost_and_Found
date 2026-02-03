'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, Menu, Bell, User, Settings, ChevronDown, 
  Box, Search, PlusCircle, LayoutGrid, List, Zap, X,
  CheckCheck, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Notification interface
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_type: string | null;
  related_id: string | null;
  link: string | null;
  created_at: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // --- State ---
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // --- Fetch Notifications ---
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        'http://localhost/lost_and_found_backend/user/notifications/get_notifications.php',
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // --- Mark notification as read ---
  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(
        'http://localhost/lost_and_found_backend/user/notifications/mark_read.php',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId }),
        }
      );
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // --- Mark all as read ---
  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        'http://localhost/lost_and_found_backend/user/notifications/mark_all_read.php',
        { method: 'POST', credentials: 'include' }
      );
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // --- Delete notification ---
  const deleteNotification = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        'http://localhost/lost_and_found_backend/user/notifications/delete_notification.php',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId }),
        }
      );
      
      if (response.ok) {
        const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // --- Handle notification click ---
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setNotificationsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  // --- Effects ---
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      try {
        if (userData && userData !== "undefined" && userData !== "null") {
          const parsed = JSON.parse(userData);
          const cleanUser = {
             ...parsed,
             name: parsed.full_name || parsed.name
          };
          setUser(cleanUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();
    fetchNotifications();

    window.addEventListener('userUpdated', loadUser);
    
    // Poll notifications every 30 seconds
    const notifInterval = setInterval(fetchNotifications, 30000);
    
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('userUpdated', loadUser);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(notifInterval);
    };
  }, [fetchNotifications]);

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match_confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'match_rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
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
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* 3. Right Actions (Bell & Profile) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <CheckCheck size={14} />
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                          <p className="text-sm text-slate-500">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                              !notification.is_read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.is_read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {formatTimeAgo(notification.created_at)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => deleteNotification(notification.id, e)}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                        <Link 
                          href="/matches" 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all matches →
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
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
             {/* Mobile Notification Button */}
             <div className="relative" ref={notificationRef}>
               <button 
                 onClick={() => setNotificationsOpen(!notificationsOpen)}
                 className="relative text-slate-600"
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                     {unreadCount > 9 ? '9+' : unreadCount}
                   </span>
                 )}
               </button>
               
               {/* Mobile Notification Dropdown */}
               <AnimatePresence>
                 {notificationsOpen && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden z-50"
                   >
                     <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                       <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                       {unreadCount > 0 && (
                         <button onClick={markAllAsRead} className="text-xs text-blue-600 font-medium">
                           Mark all read
                         </button>
                       )}
                     </div>
                     
                     <div className="max-h-64 overflow-y-auto">
                       {notifications.length === 0 ? (
                         <div className="py-6 text-center">
                           <Bell size={24} className="mx-auto text-slate-200 mb-2" />
                           <p className="text-xs text-slate-500">No notifications</p>
                         </div>
                       ) : (
                         notifications.slice(0, 5).map((notification) => (
                           <div
                             key={notification.id}
                             onClick={() => handleNotificationClick(notification)}
                             className={`flex items-start gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50 border-b border-slate-50 ${
                               !notification.is_read ? 'bg-blue-50/50' : ''
                             }`}
                           >
                             <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                             <div className="flex-1 min-w-0">
                               <p className={`text-xs ${!notification.is_read ? 'font-semibold' : ''}`}>
                                 {notification.title}
                               </p>
                               <p className="text-[10px] text-slate-400 mt-0.5">
                                 {formatTimeAgo(notification.created_at)}
                               </p>
                             </div>
                           </div>
                         ))
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
             
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