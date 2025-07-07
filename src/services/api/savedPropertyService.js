// Transform data from UI format to database format
const transformToDatabase = (uiData) => {
  return {
    property_id: parseInt(uiData.propertyId),
    saved_date: uiData.savedDate || new Date().toISOString(),
    notes: uiData.notes || ''
  };
};

// Transform data from database format to UI format
const transformFromDatabase = (dbData) => {
  return {
    Id: dbData.Id,
    propertyId: dbData.property_id ? dbData.property_id.toString() : '',
    savedDate: dbData.saved_date,
    notes: dbData.notes || ''
  };
};

export const savedPropertyService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } },
          { field: { Name: "notes" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('saved_property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching saved properties:", error?.response?.data?.message);
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
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } },
          { field: { Name: "notes" } }
        ]
      };

      const response = await apperClient.getRecordById('saved_property', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Saved property not found');
      }

      return transformFromDatabase(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching saved property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  create: async (savedData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDatabase(savedData);
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('saved_property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to save property');
        }

        const successfulRecord = response.results.find(result => result.success);
        return transformFromDatabase(successfulRecord.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating saved property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, savedData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDatabase(savedData);
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await apperClient.updateRecord('saved_property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update saved property');
        }

        const successfulRecord = response.results.find(result => result.success);
        return transformFromDatabase(successfulRecord.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating saved property:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('saved_property', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete saved property');
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting saved property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  isPropertySaved: async (propertyId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "property_id" } }
        ],
        where: [{
          FieldName: "property_id",
          Operator: "EqualTo",
          Values: [parseInt(propertyId)]
        }],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords('saved_property', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking if property is saved:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};