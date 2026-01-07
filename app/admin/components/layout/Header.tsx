import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearch: (value: string) => void;
  onSearchSubmit: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSearch, 
  onSearchSubmit 
}) => {
  const formatTitle = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {formatTitle(title)}
          </h1>
          <p className="text-gray-600">Lost & Found System Administration</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => onSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
            />
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;