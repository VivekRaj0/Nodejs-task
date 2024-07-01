const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Agent Schema
const agentSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

// User Schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  DOB: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  userType: { type: String, enum: ['Admin', 'User', 'Guest'], required: true }
});

// User's Account Schema
const userAccountSchema = new Schema({
  name: { type: String, required: true }
});

// Policy Category (LOB) Schema
const policyCategorySchema = new Schema({
  category_name: { type: String, required: true }
});

// Policy Carrier Schema
const policyCarrierSchema = new Schema({
  company_name: { type: String, required: true }
});

// Policy Info Schema
const policyInfoSchema = new Schema({
  policyNumber: { type: String, required: true, unique: true },
  policyStartDate: { type: Date, required: true },
  policyEndDate: { type: Date, required: true },
  policyCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCategory' },
  policyCarrier: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCarrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Model Definitions
const Agent = mongoose.model('Agent', agentSchema);
const User = mongoose.model('User', userSchema);
const UserAccount = mongoose.model('UserAccount', userAccountSchema);
const PolicyCategory = mongoose.model('PolicyCategory', policyCategorySchema);
const PolicyCarrier = mongoose.model('PolicyCarrier', policyCarrierSchema);
const PolicyInfo = mongoose.model('PolicyInfo', policyInfoSchema);

module.exports = { Agent, User, UserAccount, PolicyCategory, PolicyCarrier, PolicyInfo };
