import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FilterPill = ({ label, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="filter-pill"
    >
      <span className="mr-2">{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
      >
        <ApperIcon name="X" size={14} />
      </button>
    </motion.div>
  )
}

export default FilterPill