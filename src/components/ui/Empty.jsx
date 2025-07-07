import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  message = 'No properties found', 
  description = 'Try adjusting your search criteria or browse all properties.',
  action = 'Browse Properties',
  onAction 
}) => {
  const navigate = useNavigate()

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      navigate('/browse')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-white rounded-lg shadow-elevation p-8 max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="Home" size={40} className="text-white" />
        </motion.div>
        
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">
          {message}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleAction} className="w-full sm:w-auto">
            <ApperIcon name="Search" size={16} className="mr-2" />
            {action}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/map')}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Map" size={16} className="mr-2" />
            View Map
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty