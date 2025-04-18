import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [threadId, setThreadId] = useState(null); // Store thread ID for session persistence

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/query', {
        question,
        thread_id: threadId, // Send thread ID to maintain history
      });

      setThreadId(response.data.thread_id); // Store thread ID for future messages
      setHistory((prevHistory) => [
        ...prevHistory,
        { question, answer: response.data.text },
      ]);
      setQuestion('');
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-4">Chatbot with Memory</h1>

        <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Ask
          </button>
        </form>

        <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-300">Conversation History</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((item, index) => (
              <li key={index} className="p-2 bg-gray-800 rounded-md">
                <p>
                  <strong className="text-green-400">You:</strong> {item.question}
                </p>
                <p>
                  <strong className="text-yellow-300">Bot:</strong> {item.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
