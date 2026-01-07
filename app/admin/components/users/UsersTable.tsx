import React from 'react';
import { User, Download, RefreshCw } from 'lucide-react';
import { User as UserType } from '../../types/types';
import Pagination from '../ui/Pagination';

interface UsersTableProps {
  users: UserType[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  currentPage, 
  totalPages, 
  searchTerm,
  onPageChange,
  onRefresh 
}) => {
  // Export functionality
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Email,Phone,Verified,Lost Items,Found Items,Joined"]
        .concat(users.map(user => 
          `${user.id},${user.full_name},${user.email},${user.phone_number},${user.is_verified},${user.lost_items_count},${user.found_items_count},${new Date(user.created_at).toLocaleDateString()}`
        ))
        .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">
            {users.length} users shown
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onRefresh}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={users.length === 0}
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lost Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Found Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <span className="font-medium">{user.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone_number}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {user.lost_items_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {user.found_items_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersTable;