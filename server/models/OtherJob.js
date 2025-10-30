import mongoose from 'mongoose';

const otherJobSchema = new mongoose.Schema(
  {
    when: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    who: { type: String, required: true, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    hours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otherJobSchema.pre('save', function(next) {
  if (this.startAt && this.endAt) {
    const ms = new Date(this.endAt).getTime() - new Date(this.startAt).getTime();
    this.hours = ms > 0 ? +(ms / 36e5).toFixed(2) : 0;
  }
  next();
});

otherJobSchema.index({ createdAt: -1 });
otherJobSchema.index({ when: -1 });

const OtherJob = mongoose.model('OtherJob', otherJobSchema);

export default OtherJob;


