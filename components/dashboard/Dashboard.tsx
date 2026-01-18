'use client';

import { useEffect, useState } from 'react';
import { 
  Search, Filter, MapPin, Eye, MessageSquare, 
  TrendingUp, Users, Clock, Zap, RefreshCw, 
  LayoutGrid, List, AlertCircle, CheckCircle2,
  ArrowRight, Box, Bell, Menu, X, User,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- Interfaces (Matches your backend structure) ---
interface Post {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string | null;
  user: {
    name: string;
    email: string;
  };
  status: 'active' | 'resolved' | 'pending';
  matchScore?: number;
}

interface DashboardStats {
  totalPosts: number;
  lostItems: number;
  foundItems: number;
  matchesMade: number;
  recoveryRate: number;
  activeUsers: number;
}

export default function DashboardPage() {
  // --- State ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    lostItems: 0,
    foundItems: 0,
    matchesMade: 0,
    recoveryRate: 0,
    activeUsers: 0
  });

  // --- Effects ---
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchPosts();
    }, 30000); 
    return () => clearInterval(interval);
  }, []);

  // --- Data Fetching Logic (Your Original Code) ---
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        'http://localhost/lost_and_found_backend/posts/get_posts.php',
        { method: 'GET', credentials: 'include' }
      );

      if (!response.ok) throw new Error('Failed to fetch posts');

      const postsData: Post[] = await response.json();
      setPosts(postsData);
      setStats(calculateStatsFromPosts(postsData));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        'http://localhost/lost_and_found_backend/posts/get_posts.php',
        { method: 'GET', credentials: 'include' }
      );

      if (response.ok) {
        const data: Post[] = await response.json();
        setPosts(data);
        setStats(calculateStatsFromPosts(data));
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const calculateStatsFromPosts = (posts: Post[]) => {
    const totalPosts = posts.length;
    const lostItems = posts.filter(p => p.type === 'lost').length;
    const foundItems = posts.filter(p => p.type === 'found').length;

    return {
      totalPosts,
      lostItems,
      foundItems,
      matchesMade: 0, // Update later from matches API
      recoveryRate: totalPosts ? Math.round((foundItems / totalPosts) * 100) : 0,
      activeUsers: new Set(posts.map(p => p.user.email)).size
    };
  };

  // --- Filtering ---
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || post.type === filter;

    return matchesSearch && matchesFilter;
  });

  // --- Helper Components ---
  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveNav(id)}
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        activeNav === id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {activeNav === id && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-blue-50 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <Icon size={16} /> {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-blue-100 pb-20">
      
      {/* --- Premium Glass Navbar --- */}
      

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
            <p className="text-slate-500 mt-1">Real-time insights on lost and found items across campus.</p>
          </div>
          <button 
            onClick={fetchPosts}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm ${isRefreshing ? 'animate-pulse' : ''}`}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Updating...' : 'Refresh Data'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Items', val: stats.totalPosts, icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Lost Active', val: stats.lostItems, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Found Items', val: stats.foundItems, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Users', val: stats.activeUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                  <item.icon size={20} />
                </div>
                {i === 0 && <span className="text-xs font-bold text-slate-500">{stats.recoveryRate}% Recovery</span>}
              </div>
              <p className="text-slate-500 text-sm font-medium">{item.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {loading ? <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" /> : item.val}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Controls Toolbar */}
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl p-2 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search items by title, description, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg text-sm transition-all outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {/* Filter Pills */}
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
              {['all', 'lost', 'found'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as any)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                    filter === type 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block" />

            {/* View Toggles */}
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3,4,5,6].map(n => (
               <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4">
                 <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                 <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                 <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
               </div>
             ))}
           </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl"
          >
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <Search size={32} />
             </div>
             <h3 className="text-slate-900 font-bold text-lg">No items found</h3>
             <p className="text-slate-500 text-sm mt-1">Try adjusting your filters to see more results.</p>
             <button 
              onClick={() => {setSearchTerm(''); setFilter('all');}}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
             >
               Clear all filters
             </button>
          </motion.div>
        ) : (
          <motion.div layout className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={post.id}
                  className={`group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300 ${
                    viewMode === 'list' ? 'flex flex-row items-center h-40' : 'flex flex-col'
                  }`}
                >
                  {/* Card Image */}
                  <div className={`relative overflow-hidden bg-slate-100 ${viewMode === 'list' ? 'w-48 h-full shrink-0' : 'h-48 w-full'}`}>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                        <Box size={40} strokeWidth={1} />
                        <span className="text-xs font-medium mt-2">No Image</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border shadow-sm backdrop-blur-md ${
                        post.type === 'lost' 
                          ? 'bg-white/90 text-rose-600 border-rose-100' 
                          : 'bg-white/90 text-emerald-600 border-emerald-100'
                      }`}>
                        {post.type}
                      </span>
                    </div>

                    {/* Match Score Badge */}
                    {post.matchScore && (
                       <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold rounded flex items-center gap-1 shadow-lg">
                         <Zap size={10} className="text-yellow-400" fill="currentColor" />
                         {post.matchScore}% MATCH
                       </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1 w-full relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-base">
                        {post.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${
                         post.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-100' :
                         post.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                         'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    
                    <p className={`text-sm text-slate-500 mb-4 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'}`}>
                      {post.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-[120px]">{post.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock size={12} />
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {post.user.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}