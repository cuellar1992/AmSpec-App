/**
 * Generic controller factory for dropdown collections
 * This creates CRUD operations for any dropdown model
 */
export const createDropdownController = (Model, modelName) => {
  return {
    // Get all items (active only by default)
    getAll: async (req, res) => {
      try {
        const { includeInactive } = req.query;
        const filter = includeInactive === 'true' ? {} : { isActive: true };

        const items = await Model.find(filter).sort({ name: 1 });

        res.status(200).json({
          success: true,
          count: items.length,
          data: items,
        });
      } catch (error) {
        console.error(`Error fetching ${modelName}s:`, error);
        res.status(500).json({
          success: false,
          message: `Error fetching ${modelName}s`,
          error: error.message,
        });
      }
    },

    // Get single item by ID
    getById: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);

        if (!item) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        res.status(200).json({
          success: true,
          data: item,
        });
      } catch (error) {
        console.error(`Error fetching ${modelName}:`, error);
        res.status(500).json({
          success: false,
          message: `Error fetching ${modelName}`,
          error: error.message,
        });
      }
    },

    // Create new item
    create: async (req, res) => {
      try {
        const { name } = req.body;

        if (!name || !name.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Name is required',
          });
        }

        // Check if item already exists
        const existingItem = await Model.findOne({ name: name.trim() });
        if (existingItem) {
          return res.status(400).json({
            success: false,
            message: `${modelName} with this name already exists`,
          });
        }

        const item = await Model.create({ name: name.trim() });

        res.status(201).json({
          success: true,
          message: `${modelName} created successfully`,
          data: item,
        });
      } catch (error) {
        console.error(`Error creating ${modelName}:`, error);
        res.status(500).json({
          success: false,
          message: `Error creating ${modelName}`,
          error: error.message,
        });
      }
    },

    // Update item
    update: async (req, res) => {
      try {
        const { name, isActive } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (isActive !== undefined) updateData.isActive = isActive;

        // If updating name, check for duplicates
        if (name) {
          const existingItem = await Model.findOne({
            name: name.trim(),
            _id: { $ne: req.params.id },
          });
          if (existingItem) {
            return res.status(400).json({
              success: false,
              message: `${modelName} with this name already exists`,
            });
          }
        }

        const item = await Model.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!item) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        res.status(200).json({
          success: true,
          message: `${modelName} updated successfully`,
          data: item,
        });
      } catch (error) {
        console.error(`Error updating ${modelName}:`, error);
        res.status(500).json({
          success: false,
          message: `Error updating ${modelName}`,
          error: error.message,
        });
      }
    },

    // Delete item (soft delete by setting isActive to false)
    delete: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(
          req.params.id,
          { isActive: false },
          { new: true }
        );

        if (!item) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        res.status(200).json({
          success: true,
          message: `${modelName} deleted successfully`,
          data: item,
        });
      } catch (error) {
        console.error(`Error deleting ${modelName}:`, error);
        res.status(500).json({
          success: false,
          message: `Error deleting ${modelName}`,
          error: error.message,
        });
      }
    },

    // Permanent delete (use with caution)
    permanentDelete: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);

        if (!item) {
          return res.status(404).json({
            success: false,
            message: `${modelName} not found`,
          });
        }

        res.status(200).json({
          success: true,
          message: `${modelName} permanently deleted`,
        });
      } catch (error) {
        console.error(`Error permanently deleting ${modelName}:`, error);
        res.status(500).json({
          success: false,
          message: `Error permanently deleting ${modelName}`,
          error: error.message,
        });
      }
    },
  };
};
