import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false); // 👈 Loading state added

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoading(true); // 👈 Start loading
      toast.info("Uploading and processing...", { autoClose: 3000 });

      const res = await axios.post("http://localhost:3000/api/audio/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { summary, audioFile } = res.data;
      setSummary(summary);
      setAudioUrl(`http://localhost:3000/${audioFile}`);
      toast.success("Done!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-4"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Summarize"}
      </button>

      {loading && (
        <div className="mt-4 text-center text-blue-600 font-semibold animate-pulse">
          ⏳ Please wait, summarizing audio...
        </div>
      )}

      {!loading && summary && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📝 Summary</h2>
          <p className="bg-gray-100 p-4 rounded-lg">{summary}</p>
        </div>
      )}

      {!loading && audioUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">🔊 Speech</h2>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
