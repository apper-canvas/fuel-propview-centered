import mockSavedProperties from '@/services/mockData/savedProperties.json'

let savedProperties = [...mockSavedProperties]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const savedPropertyService = {
  getAll: async () => {
    await delay(200)
    return [...savedProperties]
  },

  getById: async (id) => {
    await delay(200)
    const saved = savedProperties.find(s => s.Id === parseInt(id))
    if (!saved) {
      throw new Error('Saved property not found')
    }
    return { ...saved }
  },

  create: async (savedData) => {
    await delay(300)
    const newSaved = {
      ...savedData,
      Id: Math.max(...savedProperties.map(s => s.Id)) + 1,
      savedDate: new Date().toISOString()
    }
    savedProperties.push(newSaved)
    return { ...newSaved }
  },

  update: async (id, savedData) => {
    await delay(300)
    const index = savedProperties.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Saved property not found')
    }
    savedProperties[index] = { ...savedProperties[index], ...savedData }
    return { ...savedProperties[index] }
  },

  delete: async (id) => {
    await delay(200)
    const index = savedProperties.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Saved property not found')
    }
    savedProperties.splice(index, 1)
    return true
  },

  isPropertySaved: async (propertyId) => {
    await delay(100)
    return savedProperties.some(s => s.propertyId === propertyId.toString())
  }
}