import React from "react";
import { MapPin, User, Eye } from "lucide-react";
import { LostItem, FoundItem } from "../../types/types";

interface RecentItemsProps {
  title: string;
  items: (LostItem | FoundItem)[];
  type: "lost" | "found";
}

const RecentItems: React.FC<RecentItemsProps> = ({ title, items, type }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View all →
        </button>
      </div>
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 shrink-0">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs shrink-0 ml-2 ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 truncate">
                  <MapPin size={14} /> {item.location}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 truncate">
                  <User size={14} /> {item.full_name}
                </p>
              </div>
              <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                <Eye size={16} className="text-gray-500" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {type} items found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentItems;
