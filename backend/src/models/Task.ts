import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: mongoose.Types.ObjectId
  dueDate?: Date | null
  project?: mongoose.Types.ObjectId
  tags: string[]
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in_progress', 'in_review', 'completed', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// 创建索引
TaskSchema.index({ assignee: 1, status: 1 })
TaskSchema.index({ createdBy: 1 })
TaskSchema.index({ dueDate: 1 })
TaskSchema.index({ priority: 1 })
TaskSchema.index({ project: 1 })
TaskSchema.index({ createdAt: -1 })
TaskSchema.index({ title: 'text', description: 'text' })

export const Task = mongoose.model<ITask>('Task', TaskSchema)