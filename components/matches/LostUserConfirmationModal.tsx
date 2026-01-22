'use client';

import { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';

interface LostUserConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LostUserConfirmationData) => void;
  itemTitle: string;
  isSubmitting: boolean;
}

export interface LostUserConfirmationData {
  uniqueMarks: string;
  itemContents: string;
  distinguishingFeatures: string;
  personalIdentifiers: string;
  hiddenDetails: string;
  additionalNotes: string;
}

export default function LostUserConfirmationModal({
  isOpen,
  onClose,
  onSubmit,
  itemTitle,
  isSubmitting
}: LostUserConfirmationModalProps) {
  const [formData, setFormData] = useState<LostUserConfirmationData>({
    uniqueMarks: '',
    itemContents: '',
    distinguishingFeatures: '',
    personalIdentifiers: '',
    hiddenDetails: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-white" size={24} />
              <div>
                <h2 className="text-xl font-bold text-white">Prove Your Ownership</h2>
                <p className="text-red-100 text-sm">For: {itemTitle}</p>
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

        {/* Alert */}
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-amber-800">
            <strong>Private Information:</strong> These details will only be visible to the admin for verification purposes. 
            The person who found your item will NOT see this information.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-5">
            {/* Unique Marks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unique Marks or Damage *
              </label>
              <input
                type="text"
                name="uniqueMarks"
                value={formData.uniqueMarks}
                onChange={handleChange}
                placeholder="e.g., Scratch on corner, torn strap, dent on side, stain mark"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Describe any scratches, dents, tears, stains, or wear marks</p>
            </div>

            {/* Item Contents */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contents Inside (if applicable)
              </label>
              <input
                type="text"
                name="itemContents"
                value={formData.itemContents}
                onChange={handleChange}
                placeholder="e.g., Contains ID card, 3 keys, blue pen, receipts from XYZ store"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">List what was inside (for bags, wallets, cases, etc.)</p>
            </div>

            {/* Distinguishing Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Distinguishing Features *
              </label>
              <input
                type="text"
                name="distinguishingFeatures"
                value={formData.distinguishingFeatures}
                onChange={handleChange}
                placeholder="e.g., Custom keychain attached, sticker on back, missing button, faded color"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Any features that make your item unique and identifiable</p>
            </div>

            {/* Personal Identifiers */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Personal Identifiers
              </label>
              <input
                type="text"
                name="personalIdentifiers"
                value={formData.personalIdentifiers}
                onChange={handleChange}
                placeholder="e.g., Name written inside, initials engraved, ID number, serial number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Any names, numbers, or identifiers on/in the item</p>
            </div>

            {/* Hidden Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hidden or Internal Details *
              </label>
              <input
                type="text"
                name="hiddenDetails"
                value={formData.hiddenDetails}
                onChange={handleChange}
                placeholder="e.g., Secret pocket contents, hidden compartment, sticker under flap"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Details that only the true owner would know</p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any other details that can help prove this is your item..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Ownership Proof'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
