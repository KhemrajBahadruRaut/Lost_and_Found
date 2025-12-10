'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              FynDR
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Feed
            </Link>
            <Link href="/post-lost" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Report Lost
            </Link>
            <Link href="/post-found" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Report Found
            </Link>
            <Link href="/my-posts" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              My Posts
            </Link>
            <Link href="/matches" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Matches
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Admin
              </Link>
            )}
            
            <button className="text-gray-700 hover:text-blue-600 p-2">
              <Bell size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 p-2"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/dashboard" className="block px-3 py-2 text-gray-700">Feed</Link>
            <Link href="/post-lost" className="block px-3 py-2 text-gray-700">Report Lost</Link>
            <Link href="/post-found" className="block px-3 py-2 text-gray-700">Report Found</Link>
            <Link href="/my-posts" className="block px-3 py-2 text-gray-700">My Posts</Link>
            <Link href="/matches" className="block px-3 py-2 text-gray-700">Matches</Link>
            <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}