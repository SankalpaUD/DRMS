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
    enum: ['Damage', 'Maintenance', 'Broken', 'Update', 'Other'], 
    required: true 
  },
  subType: { 
    type: String, 
    enum: ['Physical', 'Water', 'Electrical', 'Routine', 'Emergency', 'Preventive', 'Other'], 
    required: false 
  },
  description: { 
    type: String, 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
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