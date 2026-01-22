'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
}

export default function ImageGallery({ images, alt = 'Image', className = '' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Handle case where images might be empty or undefined
  if (!images || images.length === 0) {
    return null;
  }

  const hasMultiple = images.length > 1;

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative group ${className}`}>
        {/* Main Image */}
        <div 
          className="relative overflow-hidden rounded-lg cursor-pointer bg-gray-100"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Zoom indicator */}
          <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </div>
          
          {/* Image counter */}
          {hasMultiple && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Thumbnail Dots */}
        {hasMultiple && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-4' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
          >
            <X size={32} />
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute top-4 left-4 text-white/80 text-lg">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Main Image Container */}
          <div className="relative max-w-5xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(index);
                  }}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-white' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
