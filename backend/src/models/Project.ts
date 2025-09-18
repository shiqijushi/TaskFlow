import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  name: string
  description?: string
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  progress: number
  members: mongoose.Types.ObjectId[]
  dueDate?: Date | null
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    required: true,
    enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  dueDate: {
    type: Date,
    default: null
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
ProjectSchema.index({ members: 1 })
ProjectSchema.index({ createdBy: 1 })
ProjectSchema.index({ status: 1 })
ProjectSchema.index({ dueDate: 1 })
ProjectSchema.index({ createdAt: -1 })
ProjectSchema.index({ name: 'text', description: 'text' })

export const Project = mongoose.model<IProject>('Project', ProjectSchema)