import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';

const SummaryPage = () => {
  const [fileType, setFileType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return toast.error('Please select a file first');

    if (fileType === 'pdf' && file.type !== 'application/pdf') {
      return toast.error('Please upload a valid PDF file');
    }

    if (fileType === 'image' && !file.type.startsWith('image/')) {
      return toast.error('Please upload a valid image file');
    }

    setLoading(true);
    const formData = new FormData();
    const endpoint = fileType === 'pdf'
      ? 'http://localhost:3000/api/ocr/pdf'
      : 'http://localhost:3000/api/ocr/image';

    formData.append(fileType === 'image' ? 'files' : 'file', file);

    try {
      const res = await axios.post(endpoint, formData);
      setSummary(res.data.summary || '');
      toast.success('File processed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <NavBar />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">📄 PDF/Image Summary</h1>

        <div className="space-y-2">
          <label className="block font-semibold">Select File Type:</label>
          <select
            className="border p-2 rounded"
            value={fileType}
            onChange={(e) => {
              setFileType(e.target.value);
              setFile(null);
              setSummary('');
              toast.info('Switched file type');
            }}
          >
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Upload File:</label>
          <input
            type="file"
            accept={fileType === 'pdf' ? 'application/pdf' : 'image/*'}
            onChange={e => setFile(e.target.files[0])}
          />
          <button
            onClick={uploadFile}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Upload & Extract'}
          </button>
        </div>

        {summary && (
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="font-semibold">Summary:</h2>
            <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPage;
