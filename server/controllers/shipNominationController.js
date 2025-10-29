import ShipNomination from '../models/ShipNomination.js';

// @desc    Get all ship nominations
// @route   GET /api/ship-nominations
// @access  Public
export const getAllShipNominations = async (req, res) => {
  try {
    const nominations = await ShipNomination.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: nominations.length,
      data: nominations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ship nominations',
      error: error.message,
    });
  }
};

// @desc    Get single ship nomination by ID
// @route   GET /api/ship-nominations/:id
// @access  Public
export const getShipNominationById = async (req, res) => {
  try {
    const nomination = await ShipNomination.findById(req.params.id);

    if (!nomination) {
      return res.status(404).json({
        success: false,
        message: 'Ship nomination not found',
      });
    }

    res.status(200).json({
      success: true,
      data: nomination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ship nomination',
      error: error.message,
    });
  }
};

// @desc    Create new ship nomination
// @route   POST /api/ship-nominations
// @access  Public
export const createShipNomination = async (req, res) => {
  try {
    const nomination = await ShipNomination.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ship nomination created successfully',
      data: nomination,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'AmSpec Reference already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating ship nomination',
      error: error.message,
    });
  }
};

// @desc    Update ship nomination
// @route   PUT /api/ship-nominations/:id
// @access  Public
export const updateShipNomination = async (req, res) => {
  try {
    const nomination = await ShipNomination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!nomination) {
      return res.status(404).json({
        success: false,
        message: 'Ship nomination not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ship nomination updated successfully',
      data: nomination,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating ship nomination',
      error: error.message,
    });
  }
};

// @desc    Delete ship nomination
// @route   DELETE /api/ship-nominations/:id
// @access  Public
export const deleteShipNomination = async (req, res) => {
  try {
    const nomination = await ShipNomination.findByIdAndDelete(req.params.id);

    if (!nomination) {
      return res.status(404).json({
        success: false,
        message: 'Ship nomination not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ship nomination deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting ship nomination',
      error: error.message,
    });
  }
};

// @desc    Get ship nominations by status
// @route   GET /api/ship-nominations/status/:status
// @access  Public
export const getShipNominationsByStatus = async (req, res) => {
  try {
    const nominations = await ShipNomination.find({
      status: req.params.status,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: nominations.length,
      data: nominations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ship nominations',
      error: error.message,
    });
  }
};
