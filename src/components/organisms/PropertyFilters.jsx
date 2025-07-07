import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Label from '@/components/atoms/Label'
import Select from '@/components/atoms/Select'
import PriceRange from '@/components/molecules/PriceRange'

const PropertyFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment']
  const bedroomOptions = [1, 2, 3, 4, 5]
  const bathroomOptions = [1, 2, 3, 4, 5]

  const handlePropertyTypeChange = (type) => {
    const currentTypes = filters.propertyTypes || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    onFilterChange({ ...filters, propertyTypes: newTypes })
  }

  const hasActiveFilters = () => {
    return filters.priceMin || filters.priceMax || 
           (filters.propertyTypes && filters.propertyTypes.length > 0) ||
           filters.bedroomsMin || filters.bathroomsMin || filters.squareFeetMin
  }

  return (
    <div className="bg-white rounded-lg shadow-elevation p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-gray-900">
          Filters
        </h3>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-accent hover:text-accent/80"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <PriceRange
        minPrice={filters.priceMin}
        maxPrice={filters.priceMax}
        onMinChange={(value) => onFilterChange({ ...filters, priceMin: value })}
        onMaxChange={(value) => onFilterChange({ ...filters, priceMax: value })}
      />

      {/* Property Type */}
      <div>
        <Label>Property Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.propertyTypes?.includes(type) || false}
                onChange={() => handlePropertyTypeChange(type)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <Label>Minimum Bedrooms</Label>
        <Select
          value={filters.bedroomsMin || ''}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            bedroomsMin: e.target.value ? parseInt(e.target.value) : null 
          })}
        >
          <option value="">Any</option>
          {bedroomOptions.map((num) => (
            <option key={num} value={num}>
              {num}+ bedroom{num > 1 ? 's' : ''}
            </option>
          ))}
        </Select>
      </div>

      {/* Bathrooms */}
      <div>
        <Label>Minimum Bathrooms</Label>
        <Select
          value={filters.bathroomsMin || ''}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            bathroomsMin: e.target.value ? parseInt(e.target.value) : null 
          })}
        >
          <option value="">Any</option>
          {bathroomOptions.map((num) => (
            <option key={num} value={num}>
              {num}+ bathroom{num > 1 ? 's' : ''}
            </option>
          ))}
        </Select>
      </div>

      {/* Square Footage */}
      <div>
        <Label>Minimum Square Feet</Label>
        <Select
          value={filters.squareFeetMin || ''}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            squareFeetMin: e.target.value ? parseInt(e.target.value) : null 
          })}
        >
          <option value="">Any</option>
          <option value="500">500+ sq ft</option>
          <option value="1000">1,000+ sq ft</option>
          <option value="1500">1,500+ sq ft</option>
          <option value="2000">2,000+ sq ft</option>
          <option value="2500">2,500+ sq ft</option>
          <option value="3000">3,000+ sq ft</option>
        </Select>
      </div>
    </div>
  )
}

export default PropertyFilters