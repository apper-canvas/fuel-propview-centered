import React from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
      <Button
        variant={view === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="p-2"
      >
        <ApperIcon name="Grid3x3" size={16} />
      </Button>
      <Button
        variant={view === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="p-2"
      >
        <ApperIcon name="List" size={16} />
      </Button>
    </div>
  )
}

export default ViewToggle