import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';

const QAPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return toast.error('Please enter a question');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/ocr/query', { question });
      if (res.data.answer) {
        setAnswer(res.data.answer);
        toast.success('Answer received');
      } else {
        toast.warn('No answer returned');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <NavBar />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">💬 Ask a Question</h1>

        <div className="space-y-2">
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>

        {answer && (
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="font-semibold">Answer:</h2>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QAPage;
