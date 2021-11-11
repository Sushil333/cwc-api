import express from "express";

import home from '../controllers/home.js';

/**
 * @route   GET /
 * @desc    List of all users
 * @access  Public
 */

const router = express.Router();
router.get("/", home);

export default router;