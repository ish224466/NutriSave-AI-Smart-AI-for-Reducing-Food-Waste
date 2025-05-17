const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
