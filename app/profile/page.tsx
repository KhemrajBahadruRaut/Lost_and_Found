'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Package, Search, LogOut } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  lost_items_count: number;
  found_items_count: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/user/get_profile.php', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
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
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4">
              <User size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{profile.full_name}</h2>
            <p className="text-blue-100">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <Phone size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{profile.phone_number || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">{new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Search size={24} className="text-red-600" />
                    <span className="text-sm font-medium text-red-600">Lost Items</span>
                  </div>
                  <p className="text-3xl font-bold text-red-700">{profile.lost_items_count}</p>
                  <p className="text-sm text-red-600 mt-1">Items reported as lost</p>
                </div>

                <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Package size={24} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">Found Items</span>
                  </div>
                  <p className="text-3xl font-bold text-green-700">{profile.found_items_count}</p>
                  <p className="text-sm text-green-600 mt-1">Items reported as found</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t flex gap-4">
              <button
                onClick={() => router.push('/my-posts')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                View My Posts
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
