import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Construction size={48} className="text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
      <p className="text-gray-500 max-w-md">
        This feature is currently under development and will be available in the next update.
      </p>
    </div>
  );
};

export default ComingSoon;
