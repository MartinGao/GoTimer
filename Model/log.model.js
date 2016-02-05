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
});

export default mongoose.model('Log', LogSchema);
