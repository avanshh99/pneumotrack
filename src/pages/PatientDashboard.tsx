import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Upload,
  History,
  Send,
  User2,
  ArrowLeft,
} from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  years_of_experience: number;
  age_groups: string[];
  location: {
    area: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
  };
  hospital: string;
  consultation_fee: number;
  availability: string[];
}

interface UploadRecord {
  name: string;
  url: string;
  timestamp: string;
  report?: string;
  ageGroup?: string;
  location?: string;
}

const PatientDashboard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<UploadRecord[]>([]);
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [age, setAge] = useState<number | ''>('');
  const [locationArea, setLocationArea] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);

  // Fetch full doctor list (if needed for local filtering or fallback)
  // useEffect(() => {
  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await fetch('/data/doctors.json');
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setDoctors(data);
  //     } catch (error) {
  //       console.error('Error loading doctors list:', error);
  //     }
  //   };

  //   fetchDoctors();
  // }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
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

  const handleAnalyze = async () => {
    if (!image || !preview) return;
  
    setAnalyzing(true);
    setShowAnalysisResult(false);
  
    try {
      const formData = new FormData();
      formData.append("file", image);
  
      const response = await fetch("http://localhost:5000/api/upload-xray", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to analyze the image");
      }
  
      const result = await response.json();
      console.log("Analysis Result:", result);
  
      const { confidence, prediction, pneumonia_probability } = result;
  
      let severityNote = "";
      if (prediction.toLowerCase() !== "normal") {
        if (pneumonia_probability < 0.3) {
          severityNote = " - Early Stage Pneumonia";
        } else if (pneumonia_probability < 0.7) {
          severityNote = " - Moderate Stage Pneumonia";
        } else {
          severityNote = " - Severe Pneumonia Detected";
        }
      }
  
      const report = `Diagnosis: ${prediction} (Confidence: ${(confidence * 100).toFixed(2)}%)${severityNote}`;
  
      const newRecord: UploadRecord = {
        name: image.name,
        url: preview,
        timestamp: new Date().toLocaleString(),
        report,
      };
  
      setHistory(prev => [newRecord, ...prev]);
      setReport(report);
      setShowAnalysisResult(true);
    } catch (error) {
      console.error("Error analyzing the image:", error);
      alert("Analysis failed: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };
  

  const handleConnectWithDoctors = async () => {
    console.log('Trying to fetch doctors...');
    if (!age || !locationArea) {
      alert('Please provide both age and location area to find doctors');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctor/getDoctors?age=${age}&location=${encodeURIComponent(locationArea)}`
      );
      // console.log('Response status:', response.status);

      const data = await response.json();
      // console.log('Received doctors:', data);

      setFilteredDoctors(data.slice(0, 5)); // limiting to top 5
      setShowDoctors(true);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to fetch doctors. Please try again.');
    }
  };

  const handleSendReport = (doctorId: number) => {
    if (!image) return;

    const reportData = {
      doctorId,
      image: image.name,
      age,
      location: locationArea,
      report,
    };

    console.log('Sending report:', reportData);
    alert(
      `Report sent to doctor ID: ${doctorId}\n\n${JSON.stringify(
        reportData,
        null,
        2
      )}`
    );

    // Reset states
    setShowDoctors(false);
    setShowAnalysisResult(false);
    setImage(null);
    setPreview(null);
    setAge('');
    setLocationArea('');
  };

  const renderUploadSection = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Upload Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload size={20} className="text-pneumo-blue" />
            Upload X-ray
          </h2>

          <input
            type="file"
            id="x-ray-upload"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer"
            onClick={() => document.getElementById('x-ray-upload')?.click()}
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
              {analyzing ? 'Analyzing...' : 'Analyze X-ray'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload History Card */}
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
                    {record.report && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {record.report}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysisResult = () => (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnalysisResult(false)}
              className="mr-2"
            >
              <ArrowLeft size={16} />
            </Button>
            <h2 className="text-xl font-semibold">Analysis Result</h2>
          </div>

          <div className="mb-6">
            <img
              src={preview!}
              alt="Analyzed X-ray"
              className="max-h-80 mx-auto rounded"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Report:</h3>
            <p>{report}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Age
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="Enter patient age"
                value={age}
                onChange={e =>
                  setAge(e.target.value ? parseInt(e.target.value) : '')
                }
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Area
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your area (e.g. Andheri West)"
                value={locationArea}
                onChange={e => setLocationArea(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            className="w-full bg-pneumo-blue hover:bg-blue-600 text-white"
            onClick={handleConnectWithDoctors}
            disabled={!age || !locationArea}
          >
            Connect with Doctors
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDoctorsList = () => (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDoctors(false)}
              className="mr-2"
            >
              <ArrowLeft size={16} />
            </Button>
            <h2 className="text-xl font-semibold">Available Doctors</h2>
          </div>

          <p className="mb-6 text-gray-600">
            Based on your location ({locationArea}) and age ({age})
          </p>

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No doctors found matching your criteria.
              </p>
              <Button variant="outline" onClick={() => setShowDoctors(false)}>
                Try different criteria
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between"
                >
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-gray-500">
                      <User2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">
                        {doctor.specialty}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.hospital}, {doctor.location.area}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <p className="text-xs text-gray-400">
                          {doctor.years_of_experience} years experience
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{doctor.consultation_fee} consultation fee
                        </p>
                      </div>
                      <p className="text-xs text-pneumo-blue mt-1">
                        Available: {doctor.availability.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      className="bg-pneumo-blue hover:bg-blue-600 text-white"
                      onClick={() => handleSendReport(doctor.id)}
                    >
                      <Send size={16} className="mr-2" />
                      Send Report
                    </Button>
                    <div className="flex flex-col items-center md:items-end">
                      <a
                        href={`tel:${doctor.contact.phone}`}
                        className="text-xs text-center text-pneumo-blue hover:underline"
                      >
                        {doctor.contact.phone}
                      </a>
                      <a
                        href={`mailto:${doctor.contact.email}`}
                        className="text-xs text-center text-pneumo-blue hover:underline mt-1"
                      >
                        {doctor.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <section className="py-20 px-4 bg-white min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Welcome, Patient
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Upload your chest X-ray for AI-powered pneumonia detection.
          </p>

          {!showAnalysisResult && !showDoctors
            ? renderUploadSection()
            : showAnalysisResult && !showDoctors
            ? renderAnalysisResult()
            : renderDoctorsList()}
        </div>
      </section>
    </Layout>
  );
};

export default PatientDashboard;

// import { useState, useEffect } from "react";
// import Layout from "@/components/layout/Layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FileText, Upload, History, Send } from "lucide-react";

//   interface Doctor {
//     id: number;
//     name: string;
//     specialty: string;
//     years_of_experience: number;
//     age_groups: string[];
//     location: {
//       area: string;
//       latitude: number;
//       longitude: number;
//     };
//     contact: {
//       phone: string;
//       email: string;
//     };
//     hospital: string;
//     consultation_fee: number;
//     availability: string[];
//   }

//   interface UploadRecord {
//     name: string;
//     url: string;
//     timestamp: string;
//     report?: string;
//     ageGroup?: string;
//     location?: string;
//   }

//   const PatientDashboard = () => {
//     const [image, setImage] = useState<File | null>(null);
//     const [preview, setPreview] = useState<string | null>(null);
//     const [analyzing, setAnalyzing] = useState(false);
//     const [history, setHistory] = useState<UploadRecord[]>([]);
//     const [showDoctors, setShowDoctors] = useState(false);
//     const [doctors, setDoctors] = useState<Doctor[]>([]);
//     const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
//     const [ageGroup, setAgeGroup] = useState<string>("");
//     const [location, setLocation] = useState<string>("");
//     const [report, setReport] = useState<string>("");
//     const [showAnalysisResult, setShowAnalysisResult] = useState(false);
//     const [selectedLocation, setSelectedLocation] = useState<string>("");
//     // Load doctors data
//     useEffect(() => {
//       const fetchDoctors = async () => {
//         try {
//           const response = await fetch('/data/doctorsList.json');
//           const data = await response.json();
//           setDoctors(data);
//         } catch (error) {
//           console.error('Error loading doctors list:', error);
//         }
//       };

//       fetchDoctors();
//     }, []);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file && file.type.startsWith("image/")) {
//         setImage(file);
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreview(reader.result as string);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         setImage(null);
//         setPreview(null);
//       }
//     };

//     const handleAnalyze = () => {
//       if (!image || !preview) return;
//       setAnalyzing(true);

//       // Simulate API call to your model
//       setTimeout(() => {
//         const newRecord: UploadRecord = {
//           name: image.name,
//           url: preview,
//           timestamp: new Date().toLocaleString(),
//           report: "Pneumonia detected with 85% confidence. Immediate consultation recommended."
//         };

//         setHistory((prev) => [newRecord, ...prev]);
//         setReport(newRecord.report);
//         setShowAnalysisResult(true);
//         setAnalyzing(false);
//       }, 1500);
//     };

//     const handleConnectWithDoctors = () => {
//       if (!ageGroup || !selectedLocation) {
//         alert("Please provide age group and location to find doctors");
//         return;
//       }

//       // Filter doctors based on age group and location area
//       const filtered = doctors.filter(doctor =>
//         doctor.age_groups.includes(ageGroup) &&
//         doctor.location.area.toLowerCase().includes(selectedLocation.toLowerCase())
//       ).slice(0, 5); // Get top 5 doctors

//       setFilteredDoctors(filtered);
//       setShowDoctors(true);
//     };

//     const handleSendReport = (doctorId: number) => {
//       if (!image) return;

//       // Create form data to send to your API
//       const formData = new FormData();
//       formData.append('image', image);
//       formData.append('ageGroup', ageGroup);
//       formData.append('location', selectedLocation);
//       formData.append('doctorId', doctorId.toString());
//       formData.append('report', report || '');

//       // Here you would make the actual API call to your backend
//       console.log('Sending report to doctor:', doctorId, 'with data:', {
//         image: image.name,
//         ageGroup,
//         location: selectedLocation,
//         report
//       });

//       alert(`Report sent to doctor ID: ${doctorId}`);

//       // Reset states
//       setShowDoctors(false);
//       setShowAnalysisResult(false);
//       setImage(null);
//       setPreview(null);
//       setAgeGroup("");
//       setSelectedLocation("");
//     };

//     return (
//       <Layout>
//         <section className="py-20 px-4 bg-white min-h-screen">
//           <div className="container mx-auto">
//             <h1 className="text-3xl font-bold mb-6 text-center">Welcome, Patient</h1>
//             <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
//               Upload your chest X-ray for AI-powered pneumonia detection.
//             </p>

//             {!showAnalysisResult && !showDoctors ? (
//               <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardContent className="p-6">
//                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                       <Upload size={20} className="text-pneumo-blue" />
//                       Upload X-ray
//                     </h2>

//                     <input
//                       type="file"
//                       id="x-ray-upload"
//                       accept="image/jpeg,image/png"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />

//                     <div
//                       className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer"
//                       onClick={() => document.getElementById("x-ray-upload")?.click()}
//                     >
//                       {preview ? (
//                         <div className="space-y-4">
//                           <img
//                             src={preview}
//                             alt="X-ray preview"
//                             className="max-h-80 mx-auto object-contain rounded"
//                           />
//                           <p className="text-sm text-gray-500">{image?.name}</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           <div className="mx-auto w-12 h-12 rounded-full bg-pneumo-blue/10 flex items-center justify-center">
//                             <FileText className="text-pneumo-blue" size={24} />
//                           </div>
//                           <div>
//                             <p className="text-gray-600 mb-2">
//                               Click here to browse and upload your X-ray image
//                             </p>
//                             <p className="text-sm text-gray-500">Supports: JPG, PNG</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-4">
//                       <Button
//                         type="button"
//                         className="flex-1 bg-pneumo-blue hover:bg-blue-600 text-white"
//                         onClick={handleAnalyze}
//                         disabled={!image || analyzing}
//                       >
//                         {analyzing ? "Analyzing..." : "Analyze X-ray"}
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent className="p-6">
//                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                       <History size={20} className="text-pneumo-blue" />
//                       Upload History
//                     </h2>
//                     {history.length === 0 ? (
//                       <p className="text-gray-500">No uploads yet.</p>
//                     ) : (
//                       <ul className="space-y-4 overflow-y-auto max-h-96 pr-2">
//                         {history.map((record, idx) => (
//                           <li key={idx} className="flex items-start gap-4">
//                             <img
//                               src={record.url}
//                               alt={`History ${idx}`}
//                               className="w-16 h-16 object-cover rounded border"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">{record.name}</p>
//                               <p className="text-xs text-gray-500">{record.timestamp}</p>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             ) : showAnalysisResult && !showDoctors ? (
//               <div className="max-w-3xl mx-auto">
//                 <Card>
//                   <CardContent className="p-6">
//                     <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>
//                     <div className="mb-6">
//                       <img
//                         src={preview!}
//                         alt="Analyzed X-ray"
//                         className="max-h-80 mx-auto rounded"
//                       />
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                       <h3 className="font-medium mb-2">Report:</h3>
//                       <p>{report}</p>
//                     </div>

//                     <div className="space-y-4 mb-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Patient Age Group
//                         </label>
//                         <select
//                           className="w-full p-2 border rounded-md"
//                           value={ageGroup}
//                           onChange={(e) => setAgeGroup(e.target.value)}
//                         >
//                           <option value="">Select Age Group</option>
//                           <option value="0-18">0-18</option>
//                           <option value="19-40">19-40</option>
//                           <option value="41-60">41-60</option>
//                           <option value="60+">60+</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Current Location
//                         </label>
//                         <input
//                           type="text"
//                           className="w-full p-2 border rounded-md"
//                           placeholder="Enter your location"
//                           value={location}
//                           onChange={(e) => setLocation(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <Button
//                       className="w-full bg-pneumo-blue hover:bg-blue-600 text-white"
//                       onClick={handleConnectWithDoctors}
//                     >
//                       Connect with Doctors
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>
//             ) : (
//               <div className="max-w-4xl mx-auto">
//                 <Card>
//                   <CardContent className="p-6">
//                     <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
//                     <p className="mb-6 text-gray-600">
//                       Based on your location ({location}) and age group ({ageGroup})
//                     </p>

//                     {filteredDoctors.length === 0 ? (
//                       <p className="text-gray-500">No doctors found matching your criteria.</p>
//                     ) : (
//                       <div className="space-y-4">
//                         {filteredDoctors.map((doctor) => (
//                           <div key={doctor.id} className="border rounded-lg p-4 flex items-center justify-between">
//                             <div className="flex items-center space-x-4">
//                               <img
//                                 src={doctor.image}
//                                 alt={doctor.name}
//                                 className="w-16 h-16 rounded-full object-cover"
//                               />
//                               <div>
//                                 <h3 className="font-medium">{doctor.name}</h3>
//                                 <p className="text-sm text-gray-600">{doctor.specialization}</p>
//                                 <p className="text-sm text-gray-500">{doctor.hospital}, {doctor.location}</p>
//                                 <p className="text-xs text-gray-400">{doctor.experience} years experience</p>
//                               </div>
//                             </div>
//                             <Button
//                               size="sm"
//                               className="bg-pneumo-blue hover:bg-blue-600 text-white"
//                               onClick={() => handleSendReport(doctor.id)}
//                             >
//                               <Send size={16} className="mr-2" />
//                               Send Report
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     <Button
//                       variant="outline"
//                       className="mt-6"
//                       onClick={() => setShowDoctors(false)}
//                     >
//                       Back
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </section>
//       </Layout>
//     );
//   };

//   export default PatientDashboard;
