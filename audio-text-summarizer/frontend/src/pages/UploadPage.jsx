import FileUpload from "../components/FileUpload";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4">🎤 Audio Summary & Speech</h1>
        <FileUpload />
      </div>
    </div>
  );
};

export default UploadPage;
