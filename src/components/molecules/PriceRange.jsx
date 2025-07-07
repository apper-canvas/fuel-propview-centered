import React from 'react'
import Label from '@/components/atoms/Label'
import Input from '@/components/atoms/Input'

const PriceRange = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
  const formatPrice = (value) => {
    if (!value) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-3">
      <Label>Price Range</Label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1">Min Price</Label>
          <Input
            type="number"
            placeholder="0"
            value={minPrice || ''}
            onChange={(e) => onMinChange(e.target.value ? parseInt(e.target.value) : null)}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1">Max Price</Label>
          <Input
            type="number"
            placeholder="No limit"
            value={maxPrice || ''}
            onChange={(e) => onMaxChange(e.target.value ? parseInt(e.target.value) : null)}
            className="text-sm"
          />
        </div>
      </div>
      {(minPrice || maxPrice) && (
        <div className="text-sm text-gray-600">
          {formatPrice(minPrice || 0)} - {formatPrice(maxPrice || 999999999)}
        </div>
      )}
    </div>
  )
}

export default PriceRange