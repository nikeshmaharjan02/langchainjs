import usageLogModel from "../model/usageLogModel.js";

export const logAnalytics = async ({
  type,
  question,
  context,
  prompt,
  response,
  inputTokens,
  outputTokens,
  totalTokens,
  cost,
}) => {
  try {
    await usageLogModel.create({
      model: "gemini-1.5-flash",
      type,
      question,
      context,
      prompt,
      response,
      inputTokens,
      outputTokens,
      totalTokens,
      cost,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("📉 Logging failed:", err.message);
  }
};
