'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function PostFoundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateFound: '',
    contactInfo: '',
    image: null as File | null,
    storageLocation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value as any);
        }
      });

      const response = await fetch('/api/posts/found', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Found item posted successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to post found item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
        <Navbar/>
      <div className="max-w-5xl pt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Report Found Item</h1>
            <p className="text-gray-600 mt-2">Help reunite lost items with their owners</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Found Black Wallet"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="documents">Documents</option>
                <option value="jewelry">Jewelry</option>
                <option value="clothing">Clothing</option>
                <option value="bags">Bags & Wallets</option>
                <option value="keys">Keys</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the found item in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Location Found */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Location Found *
              </label>
              <input
                type="text"
                name="location"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Where did you find this item?"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Date Found */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Date Found *
              </label>
              <input
                type="date"
                name="dateFound"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.dateFound}
                onChange={handleChange}
              />
            </div>

            {/* Current Storage Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Storage Location *
              </label>
              <input
                type="text"
                name="storageLocation"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Where is the item currently kept?"
                value={formData.storageLocation}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Camera size={16} className="inline mr-1" />
                Upload Photo (Optional but recommended)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {formData.image && (
                <p className="mt-2 text-sm text-gray-500">Selected: {formData.image.name}</p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Contact Information *
              </label>
              <input
                type="text"
                name="contactInfo"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How can the owner contact you?"
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Report Found Item'}
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Thank you for helping reunite lost items with their owners!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}