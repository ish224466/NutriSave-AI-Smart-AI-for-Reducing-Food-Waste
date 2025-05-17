const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  cookingTime: { type: Number, required: true },     // in minutes
  storageTemp: { type: Number, required: true },     // in °C
  humidity: { type: Number, required: true },        // in % RH
  predictedExpiry: { type: String },                 // From ML model

  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: {
    type: String,
    enum: ['pending', 'claimed', 'delivered'],
    default: 'pending'
  },

  blockchainHash: { type: String } // Optional: for blockchain tracking
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
