import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PropertyCard from '@/components/molecules/PropertyCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { propertyService } from '@/services/api/propertyService'
import { savedPropertyService } from '@/services/api/savedPropertyService'

const MapView = () => {
  const [properties, setProperties] = useState([])
  const [savedProperties, setSavedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    loadProperties()
    loadSavedProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await propertyService.getAll()
      setProperties(data)
    } catch (err) {
      setError(err.message || 'Failed to load properties')
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const loadSavedProperties = async () => {
    try {
      const saved = await savedPropertyService.getAll()
      setSavedProperties(saved)
    } catch (err) {
      console.error('Error loading saved properties:', err)
    }
  }

  const handleSaveToggle = () => {
    loadSavedProperties()
  }

  const isPropertySaved = (propertyId) => {
    return savedProperties.some(saved => saved.propertyId === propertyId.toString())
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProperties} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Map View
          </h1>
          <p className="text-gray-600 mt-1">
            {properties.length} properties on the map
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowSidebar(!showSidebar)}
          className="lg:hidden"
        >
          <ApperIcon name={showSidebar ? "X" : "List"} size={16} className="mr-2" />
          {showSidebar ? 'Hide' : 'Show'} List
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative h-[600px] lg:h-[700px] bg-white rounded-lg shadow-elevation overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Map Area */}
          <div className={`${showSidebar ? 'lg:col-span-2' : 'lg:col-span-3'} relative bg-gray-200 flex items-center justify-center`}>
            {/* Interactive Map Placeholder */}
            <div className="text-center">
              <ApperIcon name="Map" size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">
                Interactive Map
              </h3>
              <p className="text-gray-500 mb-6">
                Map integration coming soon. Properties will be displayed with custom markers.
              </p>
              
              {/* Simulated Map Markers */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
                {properties.slice(0, 6).map((property) => (
                  <motion.div
                    key={property.Id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    className="bg-white rounded-lg shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="Home" size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="text-xs text-center">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-gray-600">
                        {property.bedrooms}bd {property.bathrooms}ba
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white shadow-sm p-2 hover:bg-gray-50"
              >
                <ApperIcon name="Plus" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white shadow-sm p-2 hover:bg-gray-50"
              >
                <ApperIcon name="Minus" size={16} />
              </Button>
            </div>
          </div>

          {/* Properties Sidebar */}
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l border-gray-200 h-full overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-display text-lg font-semibold text-gray-900">
                  Properties
                </h3>
                <p className="text-sm text-gray-600">
                  Click on a property to view details
                </p>
              </div>
              <div className="p-4 space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.Id}
                    className={`property-card cursor-pointer p-4 ${
                      selectedProperty?.Id === property.Id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex space-x-3">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {property.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {property.address.city}, {property.address.state}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="accent" className="text-sm">
                            {formatPrice(property.price)}
                          </Badge>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{property.bedrooms}bd</span>
                            <span>{property.bathrooms}ba</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Property Details Modal */}
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-display text-lg font-semibold text-gray-900">
                Property Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProperty(null)}
                className="p-2"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[500px]">
              <PropertyCard
                property={selectedProperty}
                isSaved={isPropertySaved(selectedProperty.Id)}
                onSaveToggle={handleSaveToggle}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MapView