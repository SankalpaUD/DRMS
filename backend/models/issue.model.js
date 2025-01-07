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
        enum: ['Damage', 'Maintenance', 'Other'], 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Resolved'], 
        default: 'Pending' 
    },
    feedback: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Issue = mongoose.model('ResourceIssue', issueSchema);

export default Issue;