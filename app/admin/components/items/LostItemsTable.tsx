import React from 'react';
import { MapPin, Eye, Download, RefreshCw } from 'lucide-react';
import { LostItem } from '../../types/types';
import Pagination from '../ui/Pagination';
import StatusBadge from '../ui/StatusBadge';

interface LostItemsTableProps {
  items: LostItem[];
  currentPage: number;
  totalPages: number;
  onUpdateStatus: (id: number, status: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const LostItemsTable: React.FC<LostItemsTableProps> = ({ 
  items, 
  currentPage, 
  totalPages, 
  onUpdateStatus,
  onPageChange,
  onRefresh 
}) => {
  const [selectedItem, setSelectedItem] = React.useState<LostItem | null>(null);
  
  // Export functionality
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Title,Description,Category,Location,Date Lost,Status,User,Email,Phone,Posted Date"]
        .concat(items.map(item => 
          `${item.id},"${item.title}","${item.description}","${item.category}","${item.location}",${item.date_lost},${item.status},"${item.full_name}","${item.email}",${item.phone_number},"${new Date(item.created_at).toLocaleDateString()}"`
        ))
        .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lost_items_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Lost Items Management</h2>
          <p className="text-gray-600">
            {items.length} items shown
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
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
            disabled={items.length === 0}
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No lost items found</p>
          </div>
        ) : (
          <>
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
                      Date Lost
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
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                              // onError={(e) => {
                              //   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                              // }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">{item.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description?.substring(0, 50)}...
                            </div>
                            {item.reward && (
                              <div className="text-xs text-amber-600 mt-1">
                                Reward: {item.reward}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-medium">{item.full_name}</div>
                          <div className="text-sm text-gray-500 truncate">{item.email}</div>
                          <div className="text-sm text-gray-500">{item.phone_number || item.contact_info}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-1 shrink-0" />
                          <span className="truncate max-w-xs">{item.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {item.date_lost ? new Date(item.date_lost).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {item.status === 'active' && (
                            <button
                              onClick={() => onUpdateStatus(item.id, 'resolved')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm whitespace-nowrap"
                            >
                              Mark Resolved
                            </button>
                          )}
                          {item.status !== 'closed' && (
                            <button
                              onClick={() => onUpdateStatus(item.id, 'closed')}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm whitespace-nowrap"
                            >
                              Close
                            </button>
                          )}
                          <button 
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
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
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200">
            <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-red-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">Lost Item Details</h3>
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
                  <span className="font-semibold text-gray-700 block mb-1">Location:</span>
                  <p className="text-gray-900">{selectedItem.location}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Date Lost:</span>
                  <p className="text-gray-900">{selectedItem.date_lost ? new Date(selectedItem.date_lost).toLocaleDateString() : 'N/A'}</p>
                </div>
                {selectedItem.reward && (
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700 block mb-1">Reward:</span>
                    <p className="text-amber-600 font-medium">{selectedItem.reward}</p>
                  </div>
                )}
                <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                  <span className="font-semibold text-gray-700 block mb-2">User Information:</span>
                  <div className="space-y-1">
                    <p className="text-gray-900"><strong>Name:</strong> {selectedItem.full_name}</p>
                    <p className="text-gray-900"><strong>Email:</strong> {selectedItem.email}</p>
                    <p className="text-gray-900"><strong>Phone:</strong> {selectedItem.phone_number || selectedItem.contact_info}</p>
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

export default LostItemsTable;