import express from 'express';
import { getUsers, getUserById, updateUserProfile, updateUserPassword, toggleAdminStatus, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/admin', protect, admin, toggleAdminStatus);
router.delete('/:id', protect, admin, deleteUser);

export default router;