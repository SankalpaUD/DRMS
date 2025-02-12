import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  resource: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['damage', 'maintenance', 'broken', 'update', 'other'], 
    required: true 
  },
  subType: { 
    type: String, 
    enum: ['physical', 'water', 'electrical', 'routine', 'emergency', 'preventive', 'Other'], 
    required: false 
  },
  description: { 
    type: String, 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    required: true 
  },
  reportedBy: { 
    type: String, 
    required: true 
  },
  contactInfo: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Resolved'], 
    default: 'Pending' 
  },
  feedback: { 
    type: String, 
    required: false 
  },
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;