'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, Bell, User, Settings, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      if (userData && userData !== "undefined" && userData !== "null") {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      setUser(null);
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost/lost_and_found_backend/auth/logout.php', {
        method: 'POST',
        credentials: 'include', 
      });
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              FynDR
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Feed</Link>
            <Link href="/post-lost" className="text-gray-700 hover:text-blue-600 font-medium">Report Lost</Link>
            <Link href="/post-found" className="text-gray-700 hover:text-blue-600 font-medium">Report Found</Link>
            <Link href="/my-posts" className="text-gray-700 hover:text-blue-600 font-medium">My Posts</Link>
            <Link href="/matches" className="text-gray-700 hover:text-blue-600 font-medium">Matches</Link>
            
            <button className="text-gray-700 hover:text-blue-600 p-1 relative">
              <Bell size={22} />
              {/* Notification Badge Placeholder */}
              {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span> */}
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                  {getInitials(user?.name)}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
                <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={16} className="mr-2" /> View Profile
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings size={16} className="mr-2" /> Settings
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-1">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
            <div className="flex items-center mb-4 pb-4 border-b">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 mr-3">
                  {getInitials(user?.name)}
                </div>
                <div>
                   <div className="font-medium">{user?.name}</div>
                   <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
            </div>
            <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Feed</Link>
            <Link href="/post-lost" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Report Lost</Link>
            <Link href="/post-found" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Report Found</Link>
            <Link href="/my-posts" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">My Posts</Link>
            <Link href="/matches" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Matches</Link>
            <Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Profile</Link>
            <Link href="/settings" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Settings</Link>
            <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium mt-2">
              Logout
            </button>
        </div>
      )}
    </nav>
  );
}