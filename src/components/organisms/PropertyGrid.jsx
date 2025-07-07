import React from 'react'
import { motion } from 'framer-motion'
import PropertyCard from '@/components/molecules/PropertyCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  view = 'grid', 
  savedProperties = [], 
  onRefresh,
  onSaveToggle 
}) => {
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={onRefresh} />
  if (!properties || properties.length === 0) {
    return <Empty message="No properties found matching your criteria" />
  }

  const isPropertySaved = (propertyId) => {
    return savedProperties.some(saved => saved.propertyId === propertyId.toString())
  }

  const gridClass = view === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'space-y-6'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={gridClass}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.Id}
          property={property}
          isSaved={isPropertySaved(property.Id)}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </motion.div>
  )
}

export default PropertyGrid