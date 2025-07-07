import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PropertyFilters from '@/components/organisms/PropertyFilters'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import ViewToggle from '@/components/molecules/ViewToggle'
import FilterPill from '@/components/molecules/FilterPill'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { propertyService } from '@/services/api/propertyService'
import { savedPropertyService } from '@/services/api/savedPropertyService'

const Browse = () => {
  const { loadSavedCount } = useOutletContext()
  const [properties, setProperties] = useState([])
  const [savedProperties, setSavedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    propertyTypes: [],
    bedroomsMin: null,
    bathroomsMin: null,
    squareFeetMin: null,
    location: ''
  })

  useEffect(() => {
    loadProperties()
    loadSavedProperties()
  }, [filters])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await propertyService.getAll(filters)
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedroomsMin: null,
      bathroomsMin: null,
      squareFeetMin: null,
      location: ''
    })
  }

  const handleSaveToggle = () => {
    loadSavedProperties()
    loadSavedCount()
  }

  const getActiveFilters = () => {
    const active = []
    
    if (filters.priceMin || filters.priceMax) {
      const min = filters.priceMin ? `$${filters.priceMin.toLocaleString()}` : '$0'
      const max = filters.priceMax ? `$${filters.priceMax.toLocaleString()}` : 'No limit'
      active.push({
        label: `Price: ${min} - ${max}`,
        key: 'price'
      })
    }
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      active.push({
        label: `Type: ${filters.propertyTypes.join(', ')}`,
        key: 'propertyTypes'
      })
    }
    
    if (filters.bedroomsMin) {
      active.push({
        label: `${filters.bedroomsMin}+ bedrooms`,
        key: 'bedroomsMin'
      })
    }
    
    if (filters.bathroomsMin) {
      active.push({
        label: `${filters.bathroomsMin}+ bathrooms`,
        key: 'bathroomsMin'
      })
    }
    
    if (filters.squareFeetMin) {
      active.push({
        label: `${filters.squareFeetMin.toLocaleString()}+ sq ft`,
        key: 'squareFeetMin'
      })
    }
    
    return active
  }

  const removeFilter = (key) => {
    const newFilters = { ...filters }
    switch (key) {
      case 'price':
        newFilters.priceMin = null
        newFilters.priceMax = null
        break
      case 'propertyTypes':
        newFilters.propertyTypes = []
        break
      case 'bedroomsMin':
        newFilters.bedroomsMin = null
        break
      case 'bathroomsMin':
        newFilters.bathroomsMin = null
        break
      case 'squareFeetMin':
        newFilters.squareFeetMin = null
        break
      default:
        break
    }
    setFilters(newFilters)
  }

  const activeFilters = getActiveFilters()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Browse Properties
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {activeFilters.map((filter) => (
            <FilterPill
              key={filter.key}
              label={filter.label}
              onRemove={() => removeFilter(filter.key)}
            />
          ))}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
          >
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </motion.div>
        )}

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          <PropertyGrid
            properties={properties}
            loading={loading}
            error={error}
            view={view}
            savedProperties={savedProperties}
            onRefresh={loadProperties}
            onSaveToggle={handleSaveToggle}
          />
        </div>
      </div>
    </div>
  )
}

export default Browse