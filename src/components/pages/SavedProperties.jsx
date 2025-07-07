import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PropertyCard from '@/components/molecules/PropertyCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { savedPropertyService } from '@/services/api/savedPropertyService'
import { propertyService } from '@/services/api/propertyService'

const SavedProperties = () => {
  const { loadSavedCount } = useOutletContext()
  const [savedProperties, setSavedProperties] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSavedProperties()
  }, [])

  const loadSavedProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get saved property IDs
      const saved = await savedPropertyService.getAll()
      setSavedProperties(saved)
      
      // Get full property details for each saved property
      const propertyPromises = saved.map(savedProp => 
        propertyService.getById(savedProp.propertyId)
      )
      
      const propertyDetails = await Promise.all(propertyPromises)
      setProperties(propertyDetails)
    } catch (err) {
      setError(err.message || 'Failed to load saved properties')
      toast.error('Failed to load saved properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = async () => {
    await loadSavedProperties()
    loadSavedCount()
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      try {
        const deletePromises = savedProperties.map(saved => 
          savedPropertyService.delete(saved.Id)
        )
        await Promise.all(deletePromises)
        
        setSavedProperties([])
        setProperties([])
        loadSavedCount()
        toast.success('All saved properties removed')
      } catch (err) {
        toast.error('Failed to remove saved properties')
      }
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSavedProperties} />

  if (properties.length === 0) {
    return (
      <Empty
        message="No saved properties yet"
        description="Save properties while browsing to keep track of your favorites. They'll appear here for easy access."
        action="Browse Properties"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Saved Properties
          </h1>
          <p className="text-gray-600 mt-1">
            {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} saved
          </p>
        </div>
        
        {properties.length > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="text-error hover:text-error/80"
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Saved Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.Id}
            property={property}
            isSaved={true}
            onSaveToggle={handleSaveToggle}
          />
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-3">
          Tips for Managing Your Saved Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <ApperIcon name="Heart" size={16} className="text-accent mt-0.5" />
            <span>Save properties while browsing to compare them later</span>
          </div>
          <div className="flex items-start space-x-2">
            <ApperIcon name="Calendar" size={16} className="text-accent mt-0.5" />
            <span>Schedule tours for your favorite properties</span>
          </div>
          <div className="flex items-start space-x-2">
            <ApperIcon name="Share" size={16} className="text-accent mt-0.5" />
            <span>Share saved properties with family or friends</span>
          </div>
          <div className="flex items-start space-x-2">
            <ApperIcon name="Bell" size={16} className="text-accent mt-0.5" />
            <span>Get notified when similar properties become available</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SavedProperties