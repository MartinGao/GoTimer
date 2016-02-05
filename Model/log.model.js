import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  estimatedTime: {
    type: Number,
    default: 0
  },
  started: {
    type: Date,
    default: null,
  },
  ended: {
    type: Date,
    default: null,
  },
  category: {
    type: String,
    default: 'other',
  }
});

export default mongoose.model('Log', LogSchema);
