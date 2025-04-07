import { useState , useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload ,History } from "lucide-react";

interface UploadRecord {
    name: string;
    url: string;
    timestamp: string;
  }


const PatientDashboard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<UploadRecord[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleAnalyze = () => {
    if (!image || !preview) return;
    setAnalyzing(true);

    setTimeout(() => {
      const newRecord: UploadRecord = {
        name: image.name,
        url: preview,
        timestamp: new Date().toLocaleString(),
      };

      setHistory((prev) => [newRecord, ...prev]);
      alert("Analysis complete! (dummy response)");
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="py-20 px-4 bg-white min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome, Patient</h1>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Upload your chest X-ray for AI-powered pneumonia detection.
          </p>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-pneumo-blue" />
                  Upload X-ray
                </h2>

                {/* Hidden file input + label */}
                <input
                  type="file"
                  id="x-ray-upload"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer"
                  onClick={() => document.getElementById("x-ray-upload")?.click()}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="X-ray preview"
                        className="max-h-80 mx-auto object-contain rounded"
                      />
                      <p className="text-sm text-gray-500">{image?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-pneumo-blue/10 flex items-center justify-center">
                        <FileText className="text-pneumo-blue" size={24} />
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">
                          Click here to browse and upload your X-ray image
                        </p>
                        <p className="text-sm text-gray-500">Supports: JPG, PNG</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    className="flex-1 bg-pneumo-blue hover:bg-blue-600 text-white"
                    onClick={handleAnalyze}
                    disabled={!image || analyzing}
                  >
                    {analyzing ? "Analyzing..." : "Analyze X-ray"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <History size={20} className="text-pneumo-blue" />
                  Upload History
                </h2>
                {history.length === 0 ? (
                  <p className="text-gray-500">No uploads yet.</p>
                ) : (
                  <ul className="space-y-4 overflow-y-auto max-h-96 pr-2">
                    {history.map((record, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <img
                          src={record.url}
                          alt={`History ${idx}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div>
                          <p className="text-sm font-medium">{record.name}</p>
                          <p className="text-xs text-gray-500">{record.timestamp}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PatientDashboard;








// const [image, setImage] = useState<File | null>(null);
// const [preview, setPreview] = useState<string | null>(null);

// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file && file.type.startsWith("image/")) {
//     setImage(file);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   } else {
//     setImage(null);
//     setPreview(null);
//   }
// };