import { getVectorStore } from '../config/chromaDB.js';

export const queryPDF = async (req, res) => {
  try {
    const { question } = req.body;
    const results = await getVectorStore().similaritySearch(question);
    console.log(results[0]);

    if (results.length === 0) {
      return res.json({success:false, answer: '❌ No content available' });
    }

    res.json({success:true, answer: results[0].pageContent });
  } catch (error) {
    res.status(500).json({ succcess:false,error: error.message });
    console.log(error);
  }
};
