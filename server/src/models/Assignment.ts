import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  attachments: string[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  maxScore?: number;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  attachments: [{
    type: String,
    default: []
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxScore: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  instructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
assignmentSchema.index({ createdBy: 1, isActive: 1 });
assignmentSchema.index({ dueDate: 1 });

// Virtual for checking if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate;
});

// Ensure virtual fields are serialized
assignmentSchema.set('toJSON', { virtuals: true });
assignmentSchema.set('toObject', { virtuals: true });

export default mongoose.model<IAssignment>('Assignment', assignmentSchema); 