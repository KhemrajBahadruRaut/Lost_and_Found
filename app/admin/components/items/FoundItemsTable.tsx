import React from 'react';
import { MapPin, Eye, Download, RefreshCw } from 'lucide-react';
import { FoundItem } from '../../types/types';
import Pagination from '../ui/Pagination';
import StatusBadge from '../ui/StatusBadge';

interface FoundItemsTableProps {
  items: FoundItem[];
  currentPage: number;
  totalPages: number;
  onUpdateStatus: (id: number, status: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const FoundItemsTable: React.FC<FoundItemsTableProps> = ({
  items,
  currentPage,
  totalPages,
  onUpdateStatus,
  onPageChange,
  onRefresh
}) => {
  const [selectedItem, setSelectedItem] = React.useState<FoundItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Found Items Management</h2>
          <p className="text-gray-600">
             {items.length} items shown
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
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Found
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Storage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/100';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-medium truncate">{item.full_name}</div>
                      <div className="text-sm text-gray-500 truncate">{item.email}</div>
                      <div className="text-sm text-gray-500 truncate">{item.phone_number}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={14} className="mr-1 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.date_found}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 truncate max-w-xs block">
                      {item.storage_location}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.status === 'active' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'resolved')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => onUpdateStatus(item.id, 'closed')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                      >
                        Close
                      </button>
                      <button 
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm transition-colors"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
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
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200">
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">Found Item Details</h3>
              <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-6">
              {selectedItem.image && (
                <img src={selectedItem.image} className="w-full h-64 object-cover rounded-lg" alt={selectedItem.title} />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Title:</span>
                  <p className="text-gray-900">{selectedItem.title}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Category:</span>
                  <p className="text-gray-900">{selectedItem.category}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700 block mb-1">Description:</span>
                  <p className="text-gray-900">{selectedItem.description}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Location Found:</span>
                  <p className="text-gray-900">{selectedItem.location}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Date Found:</span>
                  <p className="text-gray-900">{selectedItem.date_found}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700 block mb-1">Storage Location:</span>
                  <p className="text-gray-900">{selectedItem.storage_location}</p>
                </div>
                <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                  <span className="font-semibold text-gray-700 block mb-2">User Information:</span>
                  <div className="space-y-1">
                    <p className="text-gray-900"><strong>Name:</strong> {selectedItem.full_name}</p>
                    <p className="text-gray-900"><strong>Email:</strong> {selectedItem.email}</p>
                    <p className="text-gray-900"><strong>Phone:</strong> {selectedItem.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedItem(null)} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItemsTable;