import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ message = 'Something went wrong', onRetry }) => {
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
          className="w-16 h-16 bg-gradient-to-br from-error to-warning rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="AlertCircle" size={32} className="text-white" />
        </motion.div>
        
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="w-full sm:w-auto">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Refresh Page
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Error