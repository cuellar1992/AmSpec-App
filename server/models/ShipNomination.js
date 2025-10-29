import mongoose from 'mongoose';

const shipNominationSchema = new mongoose.Schema(
  {
    vesselName: {
      type: String,
      required: [true, 'Vessel name is required'],
      trim: true,
    },
    amspecReference: {
      type: String,
      required: [true, 'AmSpec reference is required'],
      unique: true,
      trim: true,
    },
    clientReference: {
      type: String,
      trim: true,
    },
    clients: [{
      type: String,
      trim: true,
    }],
    productTypes: [{
      type: String,
      required: [true, 'At least one product type is required'],
      trim: true,
    }],
    agent: {
      type: String,
      trim: true,
    },
    pilotOnBoard: {
      type: Date,
    },
    etb: {
      type: Date,
    },
    etc: {
      type: Date,
    },
    terminal: {
      type: String,
      trim: true,
    },
    berth: {
      type: String,
      trim: true,
    },
    surveyor: {
      type: String,
      trim: true,
    },
    sampler: {
      type: String,
      trim: true,
    },
    chemist: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries
shipNominationSchema.index({ amspecReference: 1 });
shipNominationSchema.index({ vesselName: 1 });
shipNominationSchema.index({ status: 1 });
shipNominationSchema.index({ createdAt: -1 });

const ShipNomination = mongoose.model('ShipNomination', shipNominationSchema);

export default ShipNomination;
