import { useState } from "react";
import { studentsAPI } from "../../services/api";

const BulkStudentUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setSuccess("");
      setUploadResult(null);
      
      // Simple preview for CSV
      if (selectedFile.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const lines = text.split('\n').slice(0, 6); // Preview first 5 rows
          setPreview(lines);
        };
        reader.readAsText(selectedFile);
      } else {
        setPreview([]);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await studentsAPI.bulkUpload(file);
      setSuccess(`Successfully uploaded ${res.data.count || 'students'}`);
      setUploadResult(res.data);
      setFile(null);
      setPreview([]);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to upload students");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = "first_name,last_name,email,phone,date_of_birth,gender,class,arm";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Student Upload</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Students</h2>
          
          <div className="mb-4">
            <button
              onClick={downloadTemplate}
              className="text-blue-500 hover:underline text-sm"
            >
              Download CSV Template
            </button>
          </div>
          
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
            </div>
            
            {file && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">Selected: {file.name}</p>
                <p className="text-sm text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Students"}
            </button>
          </form>
          
          {/* Upload Result */}
          {uploadResult && (
            <div className="mt-4 p-3 bg-green-50 rounded">
              <p className="font-semibold text-green-800">Upload Complete!</p>
              <p className="text-sm text-green-700">
                {uploadResult.success_count || 0} students uploaded successfully
              </p>
              {uploadResult.error_count > 0 && (
                <p className="text-sm text-red-700">
                  {uploadResult.error_count} errors
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Preview */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">File Preview</h2>
          
          {preview.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {preview.map((line, idx) => (
                    <tr key={idx} className={idx === 0 ? "bg-gray-100 font-semibold" : ""}>
                      {line.split(',').map((cell, cellIdx) => (
                        <td key={cellIdx} className="border p-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">
                Showing first 5 rows
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Select a CSV file to preview its contents
            </p>
          )}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Download the CSV template to ensure correct format</li>
          <li>Fill in the student details following the column headers</li>
          <li>Save the file as CSV and upload it</li>
          <li>Required fields: first_name, last_name, email</li>
          <li>Optional fields: phone, date_of_birth, gender, class, arm</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkStudentUpload;