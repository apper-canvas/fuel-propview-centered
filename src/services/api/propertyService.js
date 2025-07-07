import mockProperties from '@/services/mockData/properties.json'

let properties = [...mockProperties]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const propertyService = {
  getAll: async (filters = {}) => {
    await delay(300)
    
    let filteredProperties = [...properties]
    
    // Apply filters
    if (filters.priceMin || filters.priceMax) {
      filteredProperties = filteredProperties.filter(property => {
        const price = property.price
        const meetsMin = !filters.priceMin || price >= filters.priceMin
        const meetsMax = !filters.priceMax || price <= filters.priceMax
        return meetsMin && meetsMax
      })
    }
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filteredProperties = filteredProperties.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      )
    }
    
    if (filters.bedroomsMin) {
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms >= filters.bedroomsMin
      )
    }
    
    if (filters.bathroomsMin) {
      filteredProperties = filteredProperties.filter(property => 
        property.bathrooms >= filters.bathroomsMin
      )
    }
    
    if (filters.squareFeetMin) {
      filteredProperties = filteredProperties.filter(property => 
        property.squareFeet >= filters.squareFeetMin
      )
    }
    
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase()
      filteredProperties = filteredProperties.filter(property => 
        property.address.city.toLowerCase().includes(searchTerm) ||
        property.address.state.toLowerCase().includes(searchTerm) ||
        property.address.zipCode.includes(searchTerm) ||
        property.address.street.toLowerCase().includes(searchTerm)
      )
    }
    
    return filteredProperties
  },

  getById: async (id) => {
    await delay(200)
    const property = properties.find(p => p.Id === parseInt(id))
    if (!property) {
      throw new Error('Property not found')
    }
    return { ...property }
  },

  search: async (query) => {
    await delay(300)
    
    if (!query) return properties
    
    const searchTerm = query.toLowerCase()
    return properties.filter(property => 
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.city.toLowerCase().includes(searchTerm) ||
      property.address.state.toLowerCase().includes(searchTerm) ||
      property.address.zipCode.includes(searchTerm) ||
      property.address.street.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm)
    )
  },

  create: async (propertyData) => {
    await delay(400)
    const newProperty = {
      ...propertyData,
      Id: Math.max(...properties.map(p => p.Id)) + 1,
      listingDate: new Date().toISOString()
    }
    properties.push(newProperty)
    return { ...newProperty }
  },

  update: async (id, propertyData) => {
    await delay(400)
    const index = properties.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Property not found')
    }
    properties[index] = { ...properties[index], ...propertyData }
    return { ...properties[index] }
  },

  delete: async (id) => {
    await delay(300)
    const index = properties.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Property not found')
    }
    properties.splice(index, 1)
    return true
  }
}