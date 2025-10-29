import mongoose from 'mongoose';

const chemistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Chemist name is required'],
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

const Chemist = mongoose.model('Chemist', chemistSchema);

export default Chemist;
