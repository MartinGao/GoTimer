import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // name: {
  // 	type: String,
  // 	required: true,
  // 	unique: true
  // },
});

export default mongoose.model('User', UserSchema);
