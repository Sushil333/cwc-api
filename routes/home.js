import express from "express";
const router = express.Router();

import { home } from "../controllers/user.js";

router.get("/", home);

export default router;