import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import { savedPropertyService } from '@/services/api/savedPropertyService'
import { propertyService } from '@/services/api/propertyService'

const Layout = () => {
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    loadSavedCount()
  }, [])

  const loadSavedCount = async () => {
    try {
      const saved = await savedPropertyService.getAll()
      setSavedCount(saved.length)
    } catch (error) {
      console.error('Error loading saved properties:', error)
    }
  }

  const handleSearch = async (query) => {
    try {
      const results = await propertyService.search(query)
      // This would typically update the current page with search results
      console.log('Search results:', results)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} savedCount={savedCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ savedCount, loadSavedCount }} />
      </main>
    </div>
  )
}

export default Layout