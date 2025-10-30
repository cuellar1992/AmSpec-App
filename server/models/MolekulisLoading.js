import mongoose from 'mongoose';

const molekulisLoadingSchema = new mongoose.Schema(
  {
    when: { type: Date, required: true }, // date-only context for the day
    who: { type: String, required: true, trim: true }, // sampler selected
    startAt: { type: Date, required: true }, // window start (same day)
    endAt: { type: Date, required: true }, // window end (same day)
    hours: { type: Number, default: 0 }, // computed (end-start) in hours
    loads: [
      {
        time: { type: String, required: true }, // 'HH:mm'
        product: { type: String, required: true, enum: ['Hyvolt I', 'Hyvol III'] },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save to compute hours
molekulisLoadingSchema.pre('save', function(next) {
  if (this.startAt && this.endAt) {
    const ms = new Date(this.endAt).getTime() - new Date(this.startAt).getTime();
    this.hours = ms > 0 ? +(ms / 36e5).toFixed(2) : 0;
  }
  next();
});

// Indexes
molekulisLoadingSchema.index({ createdAt: -1 });
molekulisLoadingSchema.index({ when: -1 });

const MolekulisLoading = mongoose.model('MolekulisLoading', molekulisLoadingSchema);

export default MolekulisLoading;


