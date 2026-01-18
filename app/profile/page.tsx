'use client';

import { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Package, Search, 
  LogOut, MapPin, Shield, Edit3, Camera 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  lost_items_count: number;
  found_items_count: number;
  avatar?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/user/get_profile.php', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
        
        // --- CRITICAL FIX FOR NAVBAR ---
        // Update localStorage with fresh data so Navbar sees the real name
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { 
          ...currentUser, 
          name: data.user.full_name, // Map full_name to name for Navbar
          email: data.user.email 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger a custom event so Navbar updates without reload
        window.dispatchEvent(new Event('userUpdated')); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost/lost_and_found_backend/auth/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.clear();
      window.dispatchEvent(new Event('userUpdated')); // Clear navbar
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
           <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500">Manage your account settings and activity.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Identity Card --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              {/* Cover Gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <div className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer">
                  <Edit3 size={18} />
                </div>
              </div>

              {/* Avatar & Name */}
              <div className="px-6 pb-6 text-center -mt-16">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full p-1 bg-white shadow-md">
                   <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                     {profile.avatar ? (
                       <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
                     ) : (
                       <User size={48} className="text-slate-400" />
                     )}
                   </div>
                   <button className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors border-2 border-white">
                     <Camera size={14} />
                   </button>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
                <p className="text-sm text-slate-500 mb-4">{profile.email}</p>

                <div className="flex gap-2 justify-center mb-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                    Student
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                    <Shield size={10} /> Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
                   <div className="text-center">
                      <span className="block text-2xl font-bold text-slate-900">{profile.lost_items_count}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Lost</span>
                   </div>
                   <div className="text-center border-l border-slate-100">
                      <span className="block text-2xl font-bold text-slate-900">{profile.found_items_count}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Found</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- Right Column: Details & Actions --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <User size={20} className="text-blue-600" /> Personal Details
                 </h3>
                 <button className="text-sm text-blue-600 font-medium hover:underline">Edit Info</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase">Full Name</label>
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100">
                      {profile.full_name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase">Email Address</label>
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100 flex items-center gap-2">
                      <Mail size={16} className="text-slate-400" /> {profile.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase">Phone Number</label>
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100 flex items-center gap-2">
                      <Phone size={16} className="text-slate-400" /> 
                      {profile.phone_number || 'Not provided'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase">Date Joined</label>
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-900 font-medium border border-slate-100 flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
               </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div>
                   <p className="text-rose-600 font-medium mb-1 flex items-center gap-2">
                     <Search size={18} /> Reported Lost
                   </p>
                   <h4 className="text-3xl font-bold text-rose-800">{profile.lost_items_count}</h4>
                </div>
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                   <Package size={24} />
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div>
                   <p className="text-emerald-600 font-medium mb-1 flex items-center gap-2">
                     <Package size={18} /> Reported Found
                   </p>
                   <h4 className="text-3xl font-bold text-emerald-800">{profile.found_items_count}</h4>
                </div>
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                   <Shield size={24} />
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Account Actions</h3>
               <div className="flex flex-col sm:flex-row gap-3">
                 <button 
                   onClick={() => router.push('/my-posts')}
                   className="flex-1 py-2.5 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                 >
                   Manage My Posts
                 </button>
                 <button 
                   onClick={handleLogout}
                   className="flex-1 py-2.5 px-4 bg-white border border-rose-200 text-rose-600 rounded-lg font-medium hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
                 >
                   <LogOut size={18} /> Sign Out
                 </button>
               </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}