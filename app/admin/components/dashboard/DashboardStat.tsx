import React from 'react';
import { RefreshCw } from 'lucide-react';
import { DashboardStats as DashboardStatsType, LostItem, FoundItem } from '../../types/types';
import StatCard from './StatCard';
import RecentItems from './RecentItems';

interface DashboardStatsProps {
  stats: DashboardStatsType;
  lostItems: LostItem[];
  foundItems: FoundItem[];
  onGenerateMatches: () => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  lostItems,
  foundItems,
  onGenerateMatches
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<div className="text-blue-600">👤</div>}
          color="blue"
          change="+12% from last month"
        />
        <StatCard
          title="Lost Items"
          value={stats.totalLostItems}
          icon={<div className="text-red-600">📦</div>}
          color="red"
          subValue={`${stats.activeLostItems} active`}
        />
        <StatCard
          title="Found Items"
          value={stats.totalFoundItems}
          icon={<div className="text-green-600">✅</div>}
          color="green"
          subValue={`${stats.activeFoundItems} active`}
        />
        <StatCard
          title="Verification Rate"
          value={`${stats.verificationRate}%`}
          icon={<div className="text-purple-600">✔️</div>}
          color="purple"
          subValue={`${stats.resolvedCases} resolved cases`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentItems title="Recent Lost Items" items={lostItems} type="lost" />
        <RecentItems title="Recent Found Items" items={foundItems} type="found" />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Match Generation</h2>
          <button
            onClick={onGenerateMatches}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} />
            Generate Matches
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Using Levenshtein Distance algorithm to match lost and found items based on:
        </p>
        <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-1">
          <li>Title similarity (40% weight)</li>
          <li>Description similarity (40% weight)</li>
          <li>Category match (20% weight)</li>
        </ul>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Matched Items</p>
            <p className="text-2xl font-bold">{stats.totalMatches}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Similarity Threshold</p>
            <p className="text-lg font-bold text-blue-600">30% minimum</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;