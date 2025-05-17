const Donation = require('../models/Donation');
const axios = require('axios');
const { addDonationToChain } = require('../blockchain/index');

const createDonation = async (req, res) => {
  try {
    const { foodName, quantity, lat, lng, storageTemp, humidity ,cookingTime} = req.body;

    let predictedExpiry = '';
    try {
      const response = await axios.post(`http://localhost:5002/predict`, {
        foodType: foodName,
        cookingTime,
        storageTemp,
        humidity,
      });

      predictedExpiry = response.data.expiry;
    } catch (mlErr) {
      console.error('ML prediction failed:', mlErr.message);
      predictedExpiry = 'Unknown';
    }

    const donation = new Donation({
      foodName,
      quantity,
      location: { lat, lng },
      donor: req.user._id,
      cookingTime,
      storageTemp,
      humidity,
      predictedExpiry,
      donor: req.user._id,
    });

    await donation.save();

    // Add to blockchain
    addDonationToChain({
      foodName: donation.foodName,
      quantity: donation.quantity,
      donor: donation.donor.toString(),
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating donation' });
  }
};

const claimDonation = async (req, res) => {
  try {
    const donationId = req.params.id;

    // Check if valid ObjectId (helps prevent cast errors)
    if (!donationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid donation ID format' });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status === 'claimed') {
      return res.status(400).json({ message: 'Donation already claimed' });
    }

    donation.receiver = req.user._id;
    donation.status = 'claimed';

    await donation.save();

    // Safely add to blockchain
    try {
      addDonationToChain({
        foodName: donation.foodName,
        quantity: donation.quantity,
        donor: donation.donor?.toString(),
        receiver: donation.receiver?.toString(),
        timestamp: new Date().toISOString(),
        status: 'claimed'
      });
    } catch (chainErr) {
      console.warn('Blockchain logging failed:', chainErr.message);
    }

    res.status(200).json(donation);
  } catch (err) {
    console.error('Error in claimDonation:', err.message || err);
    res.status(500).json({ message: 'Error claiming donation', error: err.message });
  }
};

const getDonations = async (req, res) => {
  try {
    // Fetch all donations with related donor and receiver info
    const donations = await Donation.find()
      .populate('donor', 'name email role')    // Populate donor info
      .populate('receiver', 'name email role') // Populate receiver info
      .sort({ createdAt: -1 });                // Sort latest first

    res.status(200).json(donations);
  } catch (err) {
    console.error('Error in getDonations:', err);
    res.status(500).json({ message: 'Error fetching donations' });
  }
};

module.exports = {
  createDonation,
  getDonations,
  claimDonation
};
