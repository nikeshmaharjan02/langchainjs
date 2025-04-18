import express from "express";
import {generateEmail, sendEmail} from "../controllers/emailController.js";

const router = express.Router();


router.post("/generate", generateEmail);
router.post("/send-mail", sendEmail)
export default router;