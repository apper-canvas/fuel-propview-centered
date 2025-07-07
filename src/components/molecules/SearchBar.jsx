import React, { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ onSearch, placeholder = "Search properties..." }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-24"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

export default SearchBar