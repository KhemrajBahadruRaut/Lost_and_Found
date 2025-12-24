'use client';
import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Users,
  Target,
  Clock,
  Award,
  Bell,
  Download,
  Shield,
  Zap,
  BarChart,
  PieChart,
  ArrowUpRight,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    lostItems: 0,
    foundItems: 0,
    matchesMade: 0,
    recoveryRate: 0,
    activeUsers: 0
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchPosts();
    }, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
  try {
    const response = await fetch(
      'http://localhost/lost_and_found_backend/posts/get_posts.php',
      {
        method: 'GET',
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const postsData: Post[] = await response.json();
    setPosts(postsData);

    const calculatedStats = calculateStatsFromPosts(postsData);
    setStats(calculatedStats);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};


  const fetchPosts = async () => {
  try {
    const response = await fetch(
      'http://localhost/lost_and_found_backend/posts/get_posts.php',
      {
        method: 'GET',
        credentials: 'include'
      }
    );

    if (response.ok) {
      const data: Post[] = await response.json();
      setPosts(data);
      setStats(calculateStatsFromPosts(data));
    }
  } catch (error) {
    console.error('Error refreshing posts:', error);
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
    matchesMade: 0,        // update later from matches API
    recoveryRate: totalPosts
      ? Math.round((foundItems / totalPosts) * 100)
      : 0,
    activeUsers: new Set(posts.map(p => p.user.email)).size
  };
};


  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || post.type === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'lost' 
      ? 'bg-gradient-to-r from-red-500 to-pink-500' 
      : 'bg-gradient-to-r from-emerald-500 to-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                 Dashboard
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span>System Live • Last updated just now</span>
                </div>
                <button 
                  onClick={fetchPosts}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              {/* <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <Download size={18} className="mr-2" />
                Export Report
              </button> */}
              <Link href="/" >
              <button className="flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Zap size={18} className="mr-2" />
                Quick Match
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-3">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12% from last week</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recovery  Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recoveryRate}%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Target className="text-emerald-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight size={16} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">Industry leading</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Matches</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.matchesMade}</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <Users className="text-violet-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Bell size={16} className="text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">+3 today</span>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Posts Feed */}
          <div className="lg:col-span-2">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search items by title, description, or location..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-500" />
                    <select
                      className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filter}
                      onChange={(e) =>
                        setFilter(e.target.value as 'all' | 'lost' | 'found')
                      }
                    >
                      <option value="all">All Items</option>
                      <option value="lost">Lost Items</option>
                      <option value="found">Found Items</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['all', 'active', 'pending', 'resolved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-20 h-7 ${getTypeColor(post.type)} rounded-xl flex items-center justify-center text-white font-bold`}>
                          {post.type === 'lost' ? 'Lost' : 'Found'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                            </div>
                            {post.matchScore && (
                              <div className="ml-2 px-2 py-1 bg-linear-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-medium rounded-full">
                                {post.matchScore}% Match
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          <Clock size={14} className="inline mr-1" />
                          {post.date}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Location & User */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {post.location}
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          {post.user.name.charAt(0)}
                        </div>
                        <span className="text-gray-700">{post.user.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image & Actions */}
                  <div className="relative">
                    {post.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div> */}
                      </div>
                    )}
                    
                    <div className="p-6 pt-4">
                      <div className="flex items-center justify-between">
                        <button className="flex-1 mr-2 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center">
                          <Eye size={18} className="mr-2" />
                          View Details
                        </button>
                        <button className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <h3 className="font-bold text-lg mb-6 flex items-center">
                <PieChart className="mr-3" size={20} />
                Quick Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Lost Items</span>
                  <span className="font-bold">{stats.lostItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Found Items</span>
                  <span className="font-bold">{stats.foundItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Active Users</span>
                  <span className="font-bold">{stats.activeUsers}</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-blue-100">Today's Activity</span>
                  <span className="font-bold">+14</span>
                </div> */}
              </div>
              
              <div className="mt-8 pt-6 border-t border-blue-500/30">
                <div className="flex items-center text-sm">
                  <Shield size={16} className="mr-2" />
                  <span>Algorithm matching accuracy: 92%</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Matches */}
            {/* <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Recent Matches</h3>
                <span className="text-sm text-blue-600 font-medium">View All</span>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((match) => (
                  <div key={match} className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-linear-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center mr-4">
                      <Award className="text-emerald-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Phone & Keys Match</p>
                      <p className="text-sm text-gray-500">2 hours ago • 92% accuracy</p>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                ))}
              </div>
            </motion.div> */}

            {/* Quick Actions */}
            {/* <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center">
                  <Zap size={18} className="mr-3" />
                  Run AI Match Scan
                </button>
                <button className="w-full text-left px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors flex items-center">
                  <Bell size={18} className="mr-3" />
                  Set Alert Preferences
                </button>
                <button className="w-full text-left px-4 py-3 bg-violet-50 text-violet-700 rounded-xl hover:bg-violet-100 transition-colors flex items-center">
                  <Users size={18} className="mr-3" />
                  Invite Friends
                </button>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>
    </div>
  );
}