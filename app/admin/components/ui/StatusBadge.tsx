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
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
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