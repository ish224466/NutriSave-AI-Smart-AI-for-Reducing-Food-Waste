const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation'); // Adjust path as needed
const User = require('../models/User'); // Adjust path as needed

router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find();
    const users = await User.find();

    const quantitySum = donations.reduce((sum, d) => sum + (parseFloat(d.quantity) || 0), 0);
    const weightSum = await Donation.countDocuments();
    const volunteers = await User.countDocuments({ role: 'receiver' });
    const donors = await User.countDocuments({ role: 'donor' });

    res.json({
      quantitySum,
      weightSum,
      volunteers,
      donors,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
