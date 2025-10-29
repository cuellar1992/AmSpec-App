import mongoose from 'mongoose';

const samplerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sampler name is required'],
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

const Sampler = mongoose.model('Sampler', samplerSchema);

export default Sampler;
