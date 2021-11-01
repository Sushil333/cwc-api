import express from "express";

import { signin, signup } from "../controllers/auth.js";

/**
 * @route   POST /api/users
 * @desc    List of all users
 * @access  Public
 */

const router = express.Router();
router.post("/signin", signin);
router.post("/signup", signup);

export default router;