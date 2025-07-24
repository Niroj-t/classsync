import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  files: string[];
  submittedAt: Date;
  status: 'submitted' | 'late' | 'graded';
  score?: number;
  feedback?: string;
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
  history: {
    action: string;
    timestamp: Date;
    details?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  files: [{
    type: String,
    required: [true, 'At least one file is required']
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['submitted', 'late', 'graded'],
    default: 'submitted'
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative']
  },
  feedback: {
    type: String,
    trim: true
  },
  gradedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: {
    type: Date
  },
  history: [{
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: {
      type: String
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one submission per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

// Index for efficient queries
submissionSchema.index({ studentId: 1, status: 1 });
submissionSchema.index({ assignmentId: 1, status: 1 });

// Pre-save middleware to update status based on due date
submissionSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('submittedAt')) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignmentId);
    
    if (assignment && this.submittedAt > assignment.dueDate) {
      this.status = 'late';
    }
  }
  next();
});

// Virtual for checking if submission is late
submissionSchema.virtual('isLate').get(function() {
  return this.status === 'late';
});

// Ensure virtual fields are serialized
submissionSchema.set('toJSON', { virtuals: true });
submissionSchema.set('toObject', { virtuals: true });

export default mongoose.model<ISubmission>('Submission', submissionSchema); 