import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const PropertyGallery = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                onClick={prevImage}
              >
                <ApperIcon name="ChevronLeft" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                onClick={nextImage}
              >
                <ApperIcon name="ChevronRight" size={20} />
              </Button>
            </>
          )}
          
          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full"
            onClick={openFullscreen}
          >
            <ApperIcon name="Maximize" size={20} />
          </Button>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                onClick={closeFullscreen}
              >
                <ApperIcon name="X" size={20} />
              </Button>
              
              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                    onClick={prevImage}
                  >
                    <ApperIcon name="ChevronLeft" size={24} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                    onClick={nextImage}
                  >
                    <ApperIcon name="ChevronRight" size={24} />
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PropertyGallery