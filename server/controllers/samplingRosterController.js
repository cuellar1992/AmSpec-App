import SamplingRoster from '../models/SamplingRoster.js';

// @desc    Get all sampling rosters
// @route   GET /api/sampling-rosters
// @access  Public
export const getAllSamplingRosters = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const total = await SamplingRoster.countDocuments();
    const rosters = await SamplingRoster.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: rosters.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
      data: rosters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sampling rosters',
      error: error.message,
    });
  }
};

// @desc    Get single sampling roster by ID
// @route   GET /api/sampling-rosters/:id
// @access  Public
export const getSamplingRosterById = async (req, res) => {
  try {
    const roster = await SamplingRoster.findById(req.params.id);

    if (!roster) {
      return res.status(404).json({
        success: false,
        message: 'Sampling roster not found',
      });
    }

    res.status(200).json({
      success: true,
      data: roster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sampling roster',
      error: error.message,
    });
  }
};

// @desc    Get sampling roster by AmSpec reference
// @route   GET /api/sampling-rosters/ref/:amspecRef
// @access  Public
export const getSamplingRosterByRef = async (req, res) => {
  try {
    const ref = decodeURIComponent(req.params.amspecRef);
    const roster = await SamplingRoster.findOne({ amspecRef: ref });

    if (!roster) {
      return res.status(404).json({
        success: false,
        message: 'Sampling roster not found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: roster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sampling roster',
      error: error.message,
    });
  }
};

// @desc    Create new sampling roster
// @route   POST /api/sampling-rosters
// @access  Public
export const createSamplingRoster = async (req, res) => {
  try {
    const roster = await SamplingRoster.create(req.body);

    res.status(201).json({
      success: true,
      data: roster,
      message: 'Sampling roster created successfully',
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
      message: 'Error creating sampling roster',
      error: error.message,
    });
  }
};

// @desc    Update sampling roster
// @route   PUT /api/sampling-rosters/:id
// @access  Public
export const updateSamplingRoster = async (req, res) => {
  try {
    const roster = await SamplingRoster.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!roster) {
      return res.status(404).json({
        success: false,
        message: 'Sampling roster not found',
      });
    }

    res.status(200).json({
      success: true,
      data: roster,
      message: 'Sampling roster updated successfully',
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
      message: 'Error updating sampling roster',
      error: error.message,
    });
  }
};

// @desc    Delete sampling roster
// @route   DELETE /api/sampling-rosters/:id
// @access  Public
export const deleteSamplingRoster = async (req, res) => {
  try {
    const roster = await SamplingRoster.findByIdAndDelete(req.params.id);

    if (!roster) {
      return res.status(404).json({
        success: false,
        message: 'Sampling roster not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Sampling roster deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sampling roster',
      error: error.message,
    });
  }
};

