'use client';

import { useState } from 'react';
import { X, Eye, MapPin } from 'lucide-react';

interface FoundUserConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FoundUserConfirmationData) => void;
  itemTitle: string;
  isSubmitting: boolean;
}

export interface FoundUserConfirmationData {
  exactLocation: string;
  conditionWhenFound: string;
  visibleFeatures: string;
  accessoriesFound: string;
  additionalNotes: string;
}

export default function FoundUserConfirmationModal({
  isOpen,
  onClose,
  onSubmit,
  itemTitle,
  isSubmitting
}: FoundUserConfirmationModalProps) {
  const [formData, setFormData] = useState<FoundUserConfirmationData>({
    exactLocation: '',
    conditionWhenFound: '',
    visibleFeatures: '',
    accessoriesFound: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="text-white" size={24} />
              <div>
                <h2 className="text-xl font-bold text-white">Confirm Your Observations</h2>
                <p className="text-green-100 text-sm">For: {itemTitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <MapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-blue-800">
            Please provide details about where and how you found this item. This helps the admin verify 
            the rightful owner. Your observations will be compared with the owner's claims.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-5">
            {/* Exact Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Exact Location Found *
              </label>
              <input
                type="text"
                name="exactLocation"
                value={formData.exactLocation}
                onChange={handleChange}
                placeholder="e.g., Near the library entrance, left side of parking lot B"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Be as specific as possible about where you found it</p>
            </div>

            {/* Condition When Found */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition When Found *
              </label>
              <input
                type="text"
                name="conditionWhenFound"
                value={formData.conditionWhenFound}
                onChange={handleChange}
                placeholder="e.g., Good condition, slightly dirty, wet from rain, zipper was open"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Describe the visible condition of the item when found</p>
            </div>

            {/* Visible Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visible Features You Noticed *
              </label>
              <input
                type="text"
                name="visibleFeatures"
                value={formData.visibleFeatures}
                onChange={handleChange}
                placeholder="e.g., Color, size, brand markings, visible scratches, stickers"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Describe any features you observed on the item</p>
            </div>

            {/* Accessories Found */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Items Found With It (if any)
              </label>
              <input
                type="text"
                name="accessoriesFound"
                value={formData.accessoriesFound}
                onChange={handleChange}
                placeholder="e.g., Keychain attached, strap included, found with other items, nothing else"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">List any accessories or other items found together</p>
            </div>



            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Observations
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any other details about how you found the item or its condition..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Observations'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
