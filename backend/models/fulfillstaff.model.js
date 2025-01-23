import mongoose from 'mongoose';

const fulfillStaffSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
    },
  staffId: { 
    type: String, 
    required: true, 
    unique: true 
    },
  email: { 
    type: String, 
    required: true, 
    unique: true 
    },
  position: { 
    type: String, 
    required: true 
    },
  number: { type: String, 
    required: true, 
    unique: true 
    },
});

const FulfillStaff = mongoose.model('FulfillStaff', fulfillStaffSchema);

export default FulfillStaff;