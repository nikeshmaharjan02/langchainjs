import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  model: {
    type: String, // e.g., "gemini-pro"
    required: true,
  },
  type: {
    type: String,
    enum: ['qa', 'summary'],
    required: true,
  },
  question: {
    type: String, // What user asked
    required: true,
  },
  context: {
    type: String, // Retrieved context (RAG)
  },
  prompt: {
    type: String, // Final prompt sent to LLM (context + question)
    required: true,
  },
  response: {
    type: String, // Model's answer
    required: true,
  },
  inputTokens: {
    type: Number, // Tokens in prompt
    required: true,
  },
  outputTokens: {
    type: Number, // Tokens in response
    required: true,
  },
  totalTokens: {
    type: Number, // inputTokens + outputTokens
    required: true,
  },
  cost: {
    type: Number, // Estimated cost (e.g., $0.002 per 1K tokens)
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const usageLogModel = mongoose.models.usageLog || mongoose.model("usageLog", usageLogSchema);

export default usageLogModel;

