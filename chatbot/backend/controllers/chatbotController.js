import { getChatbotResponse } from "../services/chatbotService.js";

export const handleChatbotRequest = async (req, res) => {
    const { question, thread_id } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Please provide a question." });
    }

    try {
        const response = await getChatbotResponse(question, thread_id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
