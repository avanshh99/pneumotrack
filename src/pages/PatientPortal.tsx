
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle } from "lucide-react";

const PatientPortal = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    diagnosis: string;
    confidence: number;
    severity?: "mild" | "moderate" | "severe";
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset results
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please upload an X-ray image first");
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Random result for demo purposes
      const isPneumonia = Math.random() > 0.5;
      const confidence = 70 + Math.floor(Math.random() * 25);
      
      let severity: "mild" | "moderate" | "severe" | undefined;
      if (isPneumonia) {
        const severityRandom = Math.random();
        if (severityRandom > 0.66) severity = "severe";
        else if (severityRandom > 0.33) severity = "moderate";
        else severity = "mild";
      }
      
      setResult({
        diagnosis: isPneumonia ? "Pneumonia Detected" : "Normal",
        confidence,
        severity: isPneumonia ? severity : undefined
      });
      
      setAnalyzing(false);
      
      toast.success("Analysis completed");
    }, 3000);
  };

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center animate-fade-in">Patient Portal</h1>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Upload your chest X-ray for AI-powered pneumonia detection
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 animate-fade-in animate-delay-200">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Upload size={20} className="text-pneumo-blue" />
                      Upload X-ray
                    </h2>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                      {preview ? (
                        <div className="space-y-4">
                          <img 
                            src={preview} 
                            alt="X-ray preview" 
                            className="max-h-64 mx-auto object-contain"
                          />
                          <p className="text-sm text-gray-500">
                            {file?.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-pneumo-blue/10 flex items-center justify-center">
                            <FileText className="text-pneumo-blue" size={24} />
                          </div>
                          <div>
                            <p className="text-gray-600 mb-2">
                              Drag and drop your X-ray image here or click to browse
                            </p>
                            <p className="text-sm text-gray-500">
                              Supports: JPG, PNG, DICOM
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <Input 
                        type="file" 
                        id="x-ray-upload"
                        accept="image/jpeg,image/png,application/dicom"
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <label htmlFor="x-ray-upload" className="flex-1">
                        <Button variant="outline" className="w-full">
                          {preview ? "Change Image" : "Browse Files"}
                        </Button>
                      </label>
                      
                      <Button 
                        className="flex-1 bg-pneumo-blue hover:bg-blue-600"
                        onClick={handleAnalyze}
                        disabled={!file || analyzing}
                      >
                        {analyzing ? "Analyzing..." : "Analyze X-ray"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {result && (
                  <Card className={`animate-fade-in ${result.diagnosis === "Normal" ? "border-green-300" : "border-amber-300"}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">Analysis Results</h2>
                        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                          result.diagnosis === "Normal" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {result.confidence}% Confidence
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${
                        result.diagnosis === "Normal" ? "bg-green-50" : "bg-amber-50"
                      } mb-4`}>
                        <div className="flex items-center gap-3">
                          <AlertCircle size={24} className={result.diagnosis === "Normal" ? "text-green-600" : "text-amber-600"} />
                          <div>
                            <h3 className="font-semibold">{result.diagnosis}</h3>
                            {result.severity && (
                              <p className="text-sm text-gray-700">
                                Severity: <span className="font-medium">{result.severity}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {result.diagnosis !== "Normal" ? (
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            Our AI has detected signs consistent with pneumonia. We recommend consulting with a doctor for proper diagnosis and treatment.
                          </p>
                          <Button className="w-full bg-pneumo-blue hover:bg-blue-600">
                            Connect with Doctor
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            No signs of pneumonia detected. Remember that this is an AI-based analysis and should not replace professional medical advice.
                          </p>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Tips for healthy lungs:</h4>
                            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                              <li>Avoid smoking and second-hand smoke</li>
                              <li>Exercise regularly</li>
                              <li>Practice deep breathing exercises</li>
                              <li>Get vaccinated against pneumonia and flu</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="space-y-6 animate-fade-in animate-delay-300">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                    <p className="text-gray-600 mb-6">
                      Please login or create an account to save your X-ray results and track your recovery progress.
                    </p>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input id="email" type="email" />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <Input id="password" type="password" />
                      </div>
                      
                      <Button className="w-full bg-pneumo-blue hover:bg-blue-600">
                        Log In
                      </Button>
                      
                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="#" className="text-pneumo-blue hover:underline">
                          Sign up
                        </a>
                      </p>
                    </form>
                  </CardContent>
                </Card>
                
                <div className="bg-pneumo-darkBlue text-white rounded-lg p-6 shadow-lg">
                  <h3 className="font-semibold mb-4">Why Create an Account?</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start">
                      <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                        <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-300">Save and access your X-ray history</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                        <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-300">Track your recovery progress over time</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                        <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-300">Securely connect with doctors for consultations</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                        <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-gray-300">Receive treatment recommendations and prescriptions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PatientPortal;
