const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const {
  createDonation,
  getDonations,
  claimDonation,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, createDonation);
router.get('/', protect, getDonations);
router.patch('/:id/claim', protect, claimDonation);

 // Import the Donation model
 router.get('/give', protect,async (req, res) => {
  try {
    const donations = await Donation.find({
      status: 'pending',
      'location.lat': { $ne: null },
      'location.lng': { $ne: null },
    });

    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/claim', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ message: 'Donation already claimed or completed' });
    }

  
    donation.status = 'claimed';
    donation.claimedBy = req.user.id; // assuming JWT sets req.user
    await donation.save();

    res.json({ message: 'Donation claimed successfully' });
  } catch (err) {
    console.error('Claim error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
