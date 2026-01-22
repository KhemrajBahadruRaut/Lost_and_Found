'use client';
import { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, AlertCircle, X, Upload, Tag, MessageSquare, Phone, DollarSign, CheckCircle, XCircle, Info, HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MultiImageUpload from '@/components/ui/MultiImageUpload';

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
          type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        } min-w-[320px] max-w-md`}
      >
        <div className="shrink-0">
          {type === 'success' ? (
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle size={24} className="text-white" />
            </div>
          ) : (
            <div className="bg-rose-500 rounded-full p-1">
              <XCircle size={24} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const CategoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'Electronics', label: '📱 Electronics' },
  { value: 'Documents', label: '📄 Documents' },
  { value: 'Jewelry', label: '💎 Jewelry' },
  { value: 'Clothing', label: '👕 Clothing' },
  { value: 'Bags & Wallets', label: '🎒 Bags & Wallets' },
  { value: 'Keys', label: '🔑 Keys' },
  { value: 'Other', label: '📦 Other' },
];

export default function PostLostPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateLost: '',
    contactInfo: '',
    reward: '',
  });

  const validateTitle = (title: string): boolean => {
    // Title should not contain only numbers
    const containsOnlyNumbers = /^\d+$/.test(title);
    // Title should contain at least one letter
    const containsLetter = /[a-zA-Z]/.test(title);
    // Title should have meaningful length
    const hasValidLength = title.trim().length >= 5;
    
    return !containsOnlyNumbers && containsLetter && hasValidLength;
  };

  const validateNepaliPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const mobilePattern = /^(98|97)\d{8}$/;
    const landlinePattern = /^01\d{7}$/;
    const withCountryCode = /^(\+977|977)(98|97)\d{8}$/;
    
    return mobilePattern.test(cleaned) || landlinePattern.test(cleaned) || withCountryCode.test(cleaned);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (!validateTitle(formData.title)) {
      if (/^\d+$/.test(formData.title)) {
        newErrors.title = 'Title cannot consist only of numbers';
      } else if (!/[a-zA-Z]/.test(formData.title)) {
        newErrors.title = 'Title must contain letters';
      } else if (formData.title.trim().length < 5) {
        newErrors.title = 'Title must be at least 5 characters';
      }
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide a more detailed description (at least 20 characters)';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.dateLost) {
      newErrors.dateLost = 'Date is required';
    } else {
      const selectedDate = new Date(formData.dateLost);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dateLost = 'Date cannot be in the future';
      }
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(formData.contactInfo);
      const isValidPhone = validateNepaliPhone(formData.contactInfo);
      
      if (!isValidEmail && !isValidPhone) {
        newErrors.contactInfo = 'Please enter a valid phone number (e.g., 9812345678) or email';
      }
    }
    
    // Validate images
    const totalSize = images.reduce((acc, img) => acc + img.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      newErrors.images = 'Total image size must be less than 50MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      dateLost: '',
      contactInfo: '',
      reward: '',
    });
    setImages([]);
    setImagePreviews([]);
    setCharacterCount(0);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({
        message: 'Please fix the errors in the form',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value as string);
        }
      });

      // Add multiple images
      images.forEach((image) => {
        formDataToSend.append('images[]', image);
      });

      const response = await fetch('http://localhost/lost_and_found_backend/report/report_lost.php', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (response.ok) {
        setToast({
          message: 'Lost item reported successfully! We\'ll help you find it.',
          type: 'success'
        });
        clearForm();
      } else if (response.status === 401) {
        setToast({
          message: 'You are not logged in. Please log in first.',
          type: 'error'
        });
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      console.error('Error:', error);
      setToast({
        message: 'Failed to post lost item. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for title field
    if (name === 'title') {
      // Prevent input that contains only numbers
      if (/^\d+$/.test(value) && value.length >= 5) {
        return; // Don't update if it's only numbers
      }
    }
    
    setFormData({ ...formData, [name]: value });
    
    if (name === 'description') {
      setCharacterCount(value.length);
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImagesChange = (files: File[], previews: string[]) => {
    setImages(files);
    setImagePreviews(previews);
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };

  const formatTitlePlaceholder = (category: string) => {
    if (!category) return 'e.g., Black Leather Wallet';
    
    const baseTitles: Record<string, string> = {
      'Electronics': 'Smartphone',
      'Documents': 'ID Card',
      'Jewelry': 'Gold Ring',
      'Clothing': 'Jacket',
      'Bags & Wallets': 'Backpack',
      'Keys': 'Keychain',
      'Other': 'Personal Item'
    };
    
    return `e.g., ${baseTitles[category] || 'Lost Item'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <Navbar />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Report Lost Item</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to report your lost item. Providing accurate details increases 
            the chances of recovering your item.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Item Information</h2>
                <p className="text-gray-500 text-sm mt-1">Fields marked with * are required</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Title & Category Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={formatTitlePlaceholder(formData.category)}
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={60}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.title}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Descriptive title without numbers only (minimum 5 letters)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <span className="text-xs text-gray-500">
                      {characterCount}/1000
                    </span>
                  </div>
                  <textarea
                    name="description"
                    rows={5}
                    maxLength={1000}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Provide detailed description including color, size, brand, distinguishing features, contents, etc."
                    value={formData.description}
                    onChange={handleChange}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Location & Date Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Known Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Main Library, Room 203"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Lost *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="dateLost"
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.dateLost ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.dateLost}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.dateLost && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.dateLost}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos (Optional - up to 5 images)
                  </label>
                  
                  <MultiImageUpload
                    images={images}
                    previews={imagePreviews}
                    onChange={handleImagesChange}
                    maxImages={5}
                    error={errors.images}
                  />
                </div>

                {/* Contact & Reward Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="contactInfo"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.contactInfo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Phone: 9812345678 or email@example.com"
                        value={formData.contactInfo}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.contactInfo && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.contactInfo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="reward"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Rs. 500 reward"
                        value={formData.reward}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Report...
                      </span>
                    ) : (
                      'Submit Lost Item Report'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Help & Tips */}
          <div className="space-y-6">
            {/* Help Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
                Reporting Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold">1</span>
                  </div>
                  <span className="text-sm text-gray-600">Use descriptive titles (no numbers only)</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold">2</span>
                  </div>
                  <span className="text-sm text-gray-600">Include unique identifying marks or features</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold">3</span>
                  </div>
                  <span className="text-sm text-gray-600">Clear photos greatly improve recovery chances</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold">4</span>
                  </div>
                  <span className="text-sm text-gray-600">Double-check contact information accuracy</span>
                </li>
              </ul>
            </div>

            {/* Contact Formats */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                Accepted Contact Formats
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">Phone Numbers:</p>
                  <div className="text-sm text-blue-700 space-y-1 pl-2">
                    <p>• 98XXXXXXXX (10 digits)</p>
                    <p>• 97XXXXXXXX (10 digits)</p>
                    <p>• 01XXXXXXX (9 digits)</p>
                    <p>• +977-98XXXXXXXX</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">Email:</p>
                  <p className="text-sm text-blue-700 pl-2">• Any valid email address</p>
                </div>
              </div>
            </div>

            {/* Title Guidelines */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                Title Requirements
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <div className="fhrink-0 mt-0.5">✓</div>
                  <span className="ml-2">Must contain letters (minimum 5 characters)</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 mt-0.5">✓</div>
                  <span className="ml-2">Descriptive and clear (e.g., "Black Leather Wallet")</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 mt-0.5">✗</div>
                  <span className="ml-2">Cannot be only numbers (e.g., "12345")</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 mt-0.5">✗</div>
                  <span className="ml-2">Avoid vague titles (e.g., "Lost Item")</span>
                </li>
              </ul>
            </div>

            {/* Terms & Privacy */}
            <div className="text-xs text-gray-500">
              <p>
                By submitting this form, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
                . Your information will be used solely for the purpose of recovering lost items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}