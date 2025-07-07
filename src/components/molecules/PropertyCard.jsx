import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { savedPropertyService } from '@/services/api/savedPropertyService'

const PropertyCard = ({ property, isSaved = false, onSaveToggle }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleSaveToggle = async (e) => {
    e.stopPropagation()
    setIsLoading(true)
    
    try {
      if (isSaved) {
        await savedPropertyService.delete(property.Id)
        toast.success('Property removed from saved list')
      } else {
        await savedPropertyService.create({
          propertyId: property.Id.toString(),
          notes: ''
        })
        toast.success('Property saved successfully')
      }
      onSaveToggle && onSaveToggle()
    } catch (error) {
      toast.error('Failed to update saved properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="property-card cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="accent" className="price-badge">
            {formatPrice(property.price)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isSaved 
              ? 'bg-accent text-white hover:bg-accent/90' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-accent'
          }`}
          onClick={handleSaveToggle}
          disabled={isLoading}
        >
          <ApperIcon 
            name={isSaved ? "Heart" : "Heart"} 
            size={16} 
            className={isSaved ? "fill-current" : ""}
          />
        </Button>
      </div>
      
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          <span className="text-sm">
            {property.address.city}, {property.address.state}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <ApperIcon name="Bed" size={16} className="mr-1" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Bath" size={16} className="mr-1" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Square" size={16} className="mr-1" />
            <span>{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {property.propertyType}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Calendar" size={16} className="mr-1" />
            <span>
              {new Date(property.listingDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard