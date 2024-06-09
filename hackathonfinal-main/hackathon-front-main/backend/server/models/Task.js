const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  flowerStatus: {
    type: String,
    enum: ['healthy', 'dying', 'dead'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  taskType: {
    type: String,
    required: true,
    enum: ['study', 'housework', 'activity'],
  },
});

module.exports = mongoose.model('Task', TaskSchema);
