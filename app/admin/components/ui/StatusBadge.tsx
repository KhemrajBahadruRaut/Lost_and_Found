// components/ui/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Active' };
      case 'resolved':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' };
      case 'closed':
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' };
      case 'matched':
        return { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Matched' };
      case 'pending':
      case 'pending_approval':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' };
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;