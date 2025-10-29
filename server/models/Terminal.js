import mongoose from 'mongoose';

const terminalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Terminal name is required'],
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

const Terminal = mongoose.model('Terminal', terminalSchema);

export default Terminal;
