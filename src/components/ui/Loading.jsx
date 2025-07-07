import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ type = 'grid' }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-elevation overflow-hidden">
      <div className="skeleton-image" />
      <div className="p-6">
        <div className="skeleton-title" />
        <div className="skeleton-text w-3/4" />
        <div className="skeleton-text w-1/2" />
        <div className="flex space-x-4 mt-4">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>
    </div>
  )

  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  }

  if (type === 'detail') {
    return (
      <div className="space-y-8">
        <div className="skeleton aspect-[4/3] rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton-title" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
            <div className="skeleton-text w-2/3" />
          </div>
          <div className="space-y-4">
            <div className="skeleton h-32 rounded-lg" />
            <div className="skeleton h-20 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-10 w-32" />
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden"
          >
            <SkeletonCard />
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Loading