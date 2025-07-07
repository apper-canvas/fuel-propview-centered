// Transform data from UI format to database format
const transformToDatabase = (uiData) => {
  return {
    Name: uiData.name || `Inquiry for Property ${uiData.propertyId}`,
    email: uiData.email,
    message: uiData.message,
    property_id: parseInt(uiData.propertyId),
    sent_date: new Date().toISOString()
  };
};

// Transform data from database format to UI format
const transformFromDatabase = (dbData) => {
  return {
    Id: dbData.Id,
    name: dbData.Name,
    email: dbData.email,
    message: dbData.message,
    propertyId: dbData.property_id,
    sentDate: dbData.sent_date,
    createdOn: dbData.CreatedOn,
    createdBy: dbData.CreatedBy
  };
};

export const inquiryService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "message" } },
          { field: { Name: "property_id" } },
          { field: { Name: "sent_date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ],
        orderBy: [
          {
            fieldName: "sent_date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('inquiry', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching inquiries:", error?.response?.data?.message);
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
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "message" } },
          { field: { Name: "property_id" } },
          { field: { Name: "sent_date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('inquiry', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Inquiry not found');
      }

      return transformFromDatabase(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching inquiry with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  create: async (inquiryData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDatabase(inquiryData);
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('inquiry', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecord = response.results.find(result => result.success);
        return transformFromDatabase(successfulRecord.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating inquiry:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  update: async (id, inquiryData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = transformToDatabase(inquiryData);
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await apperClient.updateRecord('inquiry', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update inquiry');
        }

        const successfulRecord = response.results.find(result => result.success);
        return transformFromDatabase(successfulRecord.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating inquiry:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('inquiry', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete inquiry');
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting inquiry:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};