"use client"
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  CheckCircle,
  Home,
  Package,
  Settings,
  Users,
  RefreshCw
} from 'lucide-react';

// Types
import {
  User,
  LostItem,
  FoundItem,
  Match,
  DashboardStats
} from './types/types';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardStatsComponent from './components/dashboard/DashboardStat';
import UsersTable from './components/users/UsersTable';
import LostItemsTable from './components/items/LostItemsTable';
import FoundItemsTable from './components/items/FoundItemsTable';
import MatchesTable from './components/matches/MatchesTable';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ComingSoon from './components/ui/ComingSoon';

const page: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // State for data
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLostItems: 0,
    totalFoundItems: 0,
    totalMatches: 0,
    activeLostItems: 0,
    activeFoundItems: 0,
    resolvedCases: 0,
    verificationRate: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState({
    users: 1,
    lostItems: 1,
    foundItems: 1,
    matches: 1,
  });

  const [totalPages, setTotalPages] = useState({
    users: 1,
    lostItems: 1,
    foundItems: 1,
    matches: 1,
  });

  // API Calls
  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // Updated Base URL to point to backend's admin API folder
    const response = await fetch(`http://localhost/lost_and_found_backend/admin/api/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/admin/login';
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  const fetchDashboardStats = async () => {
    const data = await fetchWithAuth('dashboard/get_stats.php');
    if (data.success) {
      setStats(data.stats);
    }
  };

  const fetchUsers = async (page: number = 1, search: string = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...(search && { search })
    });
    const data = await fetchWithAuth(`users/get_users.php?${params}`);
    if (data.success) {
      setUsers(data.users); 
      setTotalPages(prev => ({ ...prev, users: data.totalPages }));
    }
  };

  const fetchLostItems = async (page: number = 1, status: string = '', search: string = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...(status && { status }),
      ...(search && { search })
    });
    const data = await fetchWithAuth(`lostItem/get_lost_items.php?${params}`); 
    if (data.success) {
      setLostItems(data.items); 
      setTotalPages(prev => ({ ...prev, lostItems: data.totalPages }));
    }
  };

  const fetchFoundItems = async (page: number = 1, status: string = '', search: string = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...(status && { status }),
      ...(search && { search })
    });
    const data = await fetchWithAuth(`foundItem/get_found_items.php?${params}`); 
    if (data.success) {
      setFoundItems(data.items); 
      setTotalPages(prev => ({ ...prev, foundItems: data.totalPages }));
    }
  };

  const fetchMatches = async () => {
    const data = await fetchWithAuth('matches/get_matches.php'); 
    if (data.success) {
      setMatches(data.data);
    }
  };

  const updateItemStatus = async (itemId: number, type: 'lost' | 'found', status: string) => {
    const endpoint = type === 'lost' 
      ? 'lostItem/update_lost_item_status.php' 
      : 'foundItem/update_found_item_status.php';

    await fetchWithAuth(endpoint, {
      method: 'PUT', 
      body: JSON.stringify({ id: itemId, status }),
    });
    fetchData(); // Refresh data
  };

  const generateMatches = async () => {
    const result = await fetchWithAuth('matches/generate_matches.php', { 
      method: 'POST',
    });
    alert(`Generated ${result.matches_generated} new matches`);
    fetchData();
  };

  const updateMatchStatus = async (matchId: number | string, status: string) => {
    await fetchWithAuth('matches/update_match_status.php', {
      method: 'PUT',
      body: JSON.stringify({ id: matchId, status }),
    });
    fetchData();
  };

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        // Fetch dashboard data in parallel but handle errors individually
        const fetchStats = fetchDashboardStats().catch(e => console.error('Stats failed', e));
        const fetchLost = fetchLostItems(1).catch(e => console.error('Lost items failed', e));
        const fetchFound = fetchFoundItems(1).catch(e => console.error('Found items failed', e));
        
        await Promise.all([fetchStats, fetchLost, fetchFound]);
      } else {
        switch (activeTab) {
          case 'users':
            await fetchUsers(currentPage.users, searchTerm);
            break;
          case 'lost':
            await fetchLostItems(currentPage.lostItems, '', searchTerm);
            break;
          case 'found':
            await fetchFoundItems(currentPage.foundItems, '', searchTerm);
            break;
          case 'matches':
            await fetchMatches();
            break;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'lost', label: 'Lost Items', icon: <Package size={20} /> },
    { id: 'found', label: 'Found Items', icon: <CheckCircle size={20} /> },
    { id: 'matches', label: 'Matches', icon: <RefreshCw size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardStatsComponent
            stats={stats}
            lostItems={lostItems.slice(0, 5)}
            foundItems={foundItems.slice(0, 5)}
            onGenerateMatches={generateMatches}
          />
        );
      case 'users':
        return (
          <UsersTable
            users={users}
            currentPage={currentPage.users}
            totalPages={totalPages.users}
            searchTerm={searchTerm}
            onPageChange={(page: number) => setCurrentPage(prev => ({ ...prev, users: page }))}
            onRefresh={fetchData}
          />
        );
      case 'lost':
        return (
          <LostItemsTable
            items={lostItems}
            currentPage={currentPage.lostItems}
            totalPages={totalPages.lostItems}
            onUpdateStatus={(id: number, status: string) => updateItemStatus(id, 'lost', status)}
            onPageChange={(page: number) => setCurrentPage(prev => ({ ...prev, lostItems: page }))}
            onRefresh={fetchData}
          />
        );
      case 'found':
        return (
          <FoundItemsTable
            items={foundItems}
            currentPage={currentPage.foundItems}
            totalPages={totalPages.foundItems}
            onUpdateStatus={(id: number, status: string) => updateItemStatus(id, 'found', status)}
            onPageChange={(page: number) => setCurrentPage(prev => ({ ...prev, foundItems: page }))}
            onRefresh={fetchData}
          />
        );
      case 'matches':
        return (
          <MatchesTable
            matches={matches}
            onUpdateStatus={updateMatchStatus}
            onGenerateMatches={generateMatches}
          />
        );
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-auto">
        <Header
          title={activeTab}
          onSearch={(value: string) => setSearchTerm(value)}
          onSearchSubmit={fetchData}
          onNavigateToMatches={() => setActiveTab('matches')}
        />
        
        <div className="p-6">
          {renderContent()}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default page;