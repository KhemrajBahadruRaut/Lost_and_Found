import React from 'react';
import { X, Menu, Package } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  items: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  items,
  activeTab,
  onTabChange
}) => {
  return (
    <aside className={`${open ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-gray-200">
        {open ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-xl">Lost & Found</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        ) : (
          <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg mx-auto">
            <Menu size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center ${open ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {open && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;