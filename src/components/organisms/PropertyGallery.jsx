import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

// 360-degree photo viewer component
const Photo360Viewer = ({ photo360Url, title }) => {
  const [viewerReady, setViewerReady] = useState(false)
  const [error, setError] = useState(false)

  React.useEffect(() => {
    if (!photo360Url || typeof window === 'undefined' || !window.pannellum) return

    try {
      const viewer = window.pannellum.viewer('photo360-container', {
        type: 'equirectangular',
        panorama: photo360Url,
        autoLoad: true,
        showControls: true,
        showFullscreenCtrl: true,
        showZoomCtrl: true,
        mouseZoom: true,
        draggable: true,
        keyboardZoom: true,
        orientationOnByDefault: false,
        compass: false,
        northOffset: 0,
        onLoad: () => setViewerReady(true),
        onError: () => setError(true)
      })

      return () => {
        try {
          if (viewer && viewer.destroy) {
            viewer.destroy()
          }
        } catch (e) {
          console.warn('Error destroying 360 viewer:', e)
        }
      }
    } catch (e) {
      console.error('Error initializing 360 viewer:', e)
      setError(true)
    }
  }, [photo360Url])

  if (error) {
    return (
      <div className="aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">360° view unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        id="photo360-container" 
        className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden"
        style={{ width: '100%', height: '400px' }}
      />
      {!viewerReady && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading 360° view...</p>
          </div>
        </div>
      )}
    </div>
  )
}
const PropertyGallery = ({ images, title, photo360 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [is360Mode, setIs360Mode] = useState(false)

  // Check if 360-degree photo is available
  const has360Photo = photo360 && photo360.trim() !== ''

  // Load pannellum script if 360 photo is available
  React.useEffect(() => {
    if (!has360Photo || window.pannellum) return

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
    script.async = true
    document.head.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
    document.head.appendChild(link)

    return () => {
      try {
        document.head.removeChild(script)
        document.head.removeChild(link)
      } catch (e) {
        // Script/link may have already been removed
      }
    }
  }, [has360Photo])

  const toggle360Mode = () => {
    setIs360Mode(!is360Mode)
  }

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
        {/* 360-degree mode toggle */}
        {has360Photo && (
          <div className="flex items-center justify-end mb-4">
            <Button
              variant={is360Mode ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggle360Mode}
              className="flex items-center"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              360° View
            </Button>
          </div>
        )}

        {/* Main Content */}
        {is360Mode && has360Photo ? (
          <Photo360Viewer photo360Url={photo360} title={title} />
        ) : (
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
        )}

{/* Thumbnails */}
        {!is360Mode && images.length > 1 && (
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