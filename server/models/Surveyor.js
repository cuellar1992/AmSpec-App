import mongoose from 'mongoose';

const surveyorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Surveyor name is required'],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Surveyor = mongoose.model('Surveyor', surveyorSchema);

export default Surveyor;
