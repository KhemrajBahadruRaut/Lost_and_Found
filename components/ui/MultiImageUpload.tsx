'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';

interface MultiImageUploadProps {
  images: File[];
  previews: string[];
  onChange: (files: File[], previews: string[]) => void;
  maxImages?: number;
  error?: string;
}

export default function MultiImageUpload({
  images,
  previews,
  onChange,
  maxImages = 5,
  error
}: MultiImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const remainingSlots = maxImages - images.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            onChange([...images, ...newFiles], [...previews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    // If no async reading needed (empty selection)
    if (newFiles.length === 0) return;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onChange(newImages, newPreviews);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const newPreviews = [...previews];
    
    // Swap items
    [newImages[draggedIndex], newImages[index]] = [newImages[index], newImages[draggedIndex]];
    [newPreviews[draggedIndex], newPreviews[index]] = [newPreviews[index], newPreviews[draggedIndex]];
    
    onChange(newImages, newPreviews);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg transition-all cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="px-6 py-8 text-center">
            <Upload className={`mx-auto h-10 w-10 mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB each • {images.length}/{maxImages} images
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Image Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {previews.map((preview, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-lg overflow-hidden border-2 aspect-square ${
                draggedIndex === index 
                  ? 'border-blue-500 opacity-50' 
                  : 'border-gray-200 hover:border-blue-300'
              } ${index === 0 ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  Primary
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Drag handle */}
                <div className="bg-white/90 p-1.5 rounded cursor-grab active:cursor-grabbing">
                  <GripVertical size={16} className="text-gray-700" />
                </div>
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Image number */}
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      {previews.length > 1 && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <GripVertical size={12} />
          Drag images to reorder. First image will be the thumbnail.
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
