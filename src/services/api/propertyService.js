// Transform data from UI format to database format
const transformToDatabase = (uiData) => {
  return {
    title: uiData.title,
    price: uiData.price,
    address_street: uiData.address?.street,
    address_city: uiData.address?.city,
    address_state: uiData.address?.state,
    address_zip_code: uiData.address?.zipCode,
    bedrooms: uiData.bedrooms,
    bathrooms: uiData.bathrooms,
    square_feet: uiData.squareFeet,
    property_type: uiData.propertyType,
images: Array.isArray(uiData.images) ? uiData.images.join(',') : uiData.images,
    description: uiData.description,
    features: Array.isArray(uiData.features) ? uiData.features.join(',') : uiData.features,
    coordinates_lat: uiData.coordinates?.lat,
    coordinates_lng: uiData.coordinates?.lng,
    listing_date: uiData.listingDate,
    status: uiData.status,
    neighborhood_info: uiData.neighborhoodInfo
  };
};

// Transform data from database format to UI format
const transformFromDatabase = (dbData) => {
  return {
    Id: dbData.Id,
    title: dbData.title,
    price: dbData.price,
    address: {
      street: dbData.address_street,
      city: dbData.address_city,
      state: dbData.address_state,
      zipCode: dbData.address_zip_code
    },
    bedrooms: dbData.bedrooms,
    bathrooms: dbData.bathrooms,
    squareFeet: dbData.square_feet,
    propertyType: dbData.property_type,
images: dbData.images ? (typeof dbData.images === 'string' ? dbData.images.split(',') : dbData.images) : [],
    description: dbData.description,
    features: dbData.features ? (typeof dbData.features === 'string' ? dbData.features.split(',') : dbData.features) : [],
    coordinates: {
      lat: dbData.coordinates_lat,
      lng: dbData.coordinates_lng
    },
    listingDate: dbData.listing_date,
    status: dbData.status,
    neighborhoodInfo: dbData.neighborhood_info
  };
};

export const propertyService = {
  getAll: async (filters = {}) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates_lat" } },
{ field: { Name: "coordinates_lng" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "neighborhood_info" } }
        ],
        where: [],
        pagingInfo: { limit: 100, offset: 0 }
      };

      // Add filters to where clause
      if (filters.priceMin) {
        params.where.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }

      if (filters.priceMax) {
        params.where.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }

      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        params.where.push({
          FieldName: "property_type",
          Operator: "ExactMatch",
          Values: filters.propertyTypes
        });
      }

      if (filters.bedroomsMin) {
        params.where.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin]
        });
      }

      if (filters.bathroomsMin) {
        params.where.push({
          FieldName: "bathrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathroomsMin]
        });
      }

      if (filters.squareFeetMin) {
        params.where.push({
          FieldName: "square_feet",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin]
        });
      }

      if (filters.location) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "address_city",
                operator: "Contains",
                values: [filters.location]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "address_state",
                operator: "Contains",
                values: [filters.location]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "address_zip_code",
                operator: "Contains",
                values: [filters.location]
              }],
              operator: "OR"
            }
          ]
        }];
      }

      const response = await apperClient.fetchRecords('property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates_lat" } },
{ field: { Name: "coordinates_lng" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "neighborhood_info" } }
        ]
      };
      const response = await apperClient.getRecordById('property', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Property not found');
      }

      return transformFromDatabase(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  search: async (query) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates_lat" } },
{ field: { Name: "coordinates_lng" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "neighborhood_info" } }
        ],
        whereGroups: query ? [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "title",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "description",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "address_city",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "address_state",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }] : [],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  create: async (propertyData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDatabase(propertyData);
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create property');
        }

        const successfulRecord = response.results.find(result => result.success);
        return transformFromDatabase(successfulRecord.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, propertyData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDatabase(propertyData);
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await apperClient.updateRecord('property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update property');
        }

        const successfulRecord = response.results.find(result => result.success);
        return transformFromDatabase(successfulRecord.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete property');
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};