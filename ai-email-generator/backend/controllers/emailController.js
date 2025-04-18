import { generateEmailFromPoints } from "../services/genAIService.js";
import { sendMail } from "../utils/emailService.js";

export const generateEmail = async (req, res) => {
  try {
    const { bulletPoints, tone } = req.body;

    console.log("Received bullet points:", bulletPoints);
    console.log("Received tone:", tone);

    if (!bulletPoints || !tone) {
      return res.status(400).json({ error: "Bullet points and tone are required." });
    }

    const email = await generateEmailFromPoints(bulletPoints, tone);
    res.status(200).json({success:true,message:"template generated successfully", email });
  } catch (error) {
    console.error("Error generating email:", error.message);
    res.status(500).json({ success:false, message: "Failed to generate email." });
  }
};

export const sendEmail = async (req, res) => {
  const {email, text } = req.body;
  try {
    console.log("Received email:", email);
    console.log("Received text:", text);
    sendMail(email,"Subject of email", text );
    res.json({success:true, message:"Email Sent Successfully"});
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}