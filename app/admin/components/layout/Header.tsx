import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearch: (value: string) => void;
  onSearchSubmit: () => void;
  onNavigateToMatches?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSearch, 
  onSearchSubmit,
  onNavigateToMatches
}) => {
  const formatTitle = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost/lost_and_found_backend/admin/api/notifications/get_notifications.php', {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
         }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch('http://localhost/lost_and_found_backend/admin/api/notifications/mark_read.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ notificationId })
      });
      // Refresh notifications to update count
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
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
          <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                    {unreadCount}
                  </span>
                )}
            </button>
            
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                  key={notif.id} 
                                  className={`p-4 border-b last:border-0 cursor-pointer transition-colors ${
                                    notif.is_read == 0 
                                      ? 'bg-gray-100 hover:bg-gray-200' 
                                      : 'bg-white hover:bg-blue-50'
                                  }`}
                                  onClick={() => {
                                    markAsRead(notif.id);
                                    setShowNotifications(false);
                                    if (onNavigateToMatches) {
                                      onNavigateToMatches();
                                    }
                                  }}
                                >
                                    <p className={`text-sm ${
                                      notif.is_read == 0 ? 'font-semibold text-gray-900' : 'text-gray-800'
                                    }`}>{notif.message}</p>
                                    <span className="text-xs text-gray-500 mt-1 block">{new Date(notif.created_at).toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;