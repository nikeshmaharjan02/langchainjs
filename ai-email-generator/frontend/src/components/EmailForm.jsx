import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmailForm = () => {
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [result, setResult] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/email/generate", {
        bulletPoints: points,
        tone,
      });

      if (res.data.success) {
        // console.log("Generated email:", res.data);
        setResult(res.data.email);
        toast.success(res.data.message || "Template generated successfully!");
      } else{
        toast.error(res.data.message || "Failed to generate template.");
      }

      
    } catch (error) {
      toast.error("Error generating email");
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !result) {
      return toast.error("Please enter recipient email and ensure the email content is not empty.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/email/send-mail", {
        email: recipientEmail,
        text: result,
      });
      if (res.data.success)  {
        toast.success(res.data.message || "Email sent successfully!");
      } else {
        toast.error(res.data.message || "Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows="5"
          className="w-full border p-3 rounded"
          placeholder="Enter bullet points..."
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        ></textarea>

        <select
          className="w-full border p-3 rounded"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Formal</option>
          <option>Casual</option>
          <option>Friendly</option>
          <option>Apologetic</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Generate Email
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 border rounded space-y-3">
          <h2 className="font-semibold mb-2">Generated Email:</h2>

          <textarea
            rows="15"
            className="w-full border p-3 rounded whitespace-pre-wrap"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          ></textarea>

          <input
            type="email"
            className="w-full border p-3 rounded"
            placeholder="Recipient's Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast.success("Email copied to clipboard!");
              }}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Copy Email
            </button>

            <button
              onClick={handleSendEmail}
              className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            >
              Send Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
