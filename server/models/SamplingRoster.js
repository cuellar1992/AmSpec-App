import mongoose from 'mongoose';

const samplingRosterSchema = new mongoose.Schema(
  {
    // Ship Nomination reference
    amspecRef: {
      type: String,
      required: [true, 'AmSpec reference is required'],
      trim: true,
    },
    // Form fields
    vessel: {
      type: String,
      required: [true, 'Vessel name is required'],
      trim: true,
    },
    berth: {
      type: String,
      required: [true, 'Berth is required'],
      trim: true,
    },
    pob: {
      type: Date,
      required: [true, 'POB is required'],
    },
    etb: {
      type: Date,
      required: [true, 'ETB is required'],
    },
    startDischarge: {
      type: Date,
      required: [true, 'Start Discharge is required'],
    },
    dischargeTimeHours: {
      type: Number,
      required: [true, 'Discharge Time Hours is required'],
      min: [0, 'Discharge Time Hours must be positive'],
    },
    cargo: {
      type: String,
      required: [true, 'Cargo is required'],
      trim: true,
    },
    surveyor: {
      type: String,
      required: [true, 'Surveyor is required'],
      trim: true,
    },
    preDischargeTest: {
      type: String,
      trim: true,
    },
    postDischargeTest: {
      type: String,
      trim: true,
    },
    // Office Sampling data
    officeSampling: [
      {
        who: { type: String, trim: true },
        startOffice: { type: Date, required: true },
        finishSampling: { type: Date, required: true },
        hours: { type: Number, default: 0 }, // Calculated hours
      },
    ],
    // Line Sampling data
    lineSampling: [
      {
        who: { type: String, trim: true },
        startLineSampling: { type: Date, required: true },
        finishLineSampling: { type: Date, required: true },
        hours: { type: Number, default: 0 }, // Calculated hours
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster lookups
samplingRosterSchema.index({ amspecRef: 1 });
samplingRosterSchema.index({ createdAt: -1 });

// Pre-save hook to calculate hours for office sampling
samplingRosterSchema.pre('save', function(next) {
  // Calculate hours for office sampling records
  if (this.officeSampling && Array.isArray(this.officeSampling)) {
    this.officeSampling.forEach((record) => {
      if (record.startOffice && record.finishSampling) {
        const ms = new Date(record.finishSampling).getTime() - new Date(record.startOffice).getTime();
        record.hours = ms > 0 ? +(ms / 36e5).toFixed(2) : 0;
      }
    });
  }

  // Calculate hours for line sampling records
  if (this.lineSampling && Array.isArray(this.lineSampling)) {
    this.lineSampling.forEach((record) => {
      if (record.startLineSampling && record.finishLineSampling) {
        const ms = new Date(record.finishLineSampling).getTime() - new Date(record.startLineSampling).getTime();
        record.hours = ms > 0 ? +(ms / 36e5).toFixed(2) : 0;
      }
    });
  }

  next();
});

const SamplingRoster = mongoose.model('SamplingRoster', samplingRosterSchema);

export default SamplingRoster;

