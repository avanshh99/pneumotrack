// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
// import { Card, CardContent } from '@/components/ui/card';
// import axios from "axios";
// import { Button } from '@/components/ui/button';
// import {
//   Upload,
//   ArrowLeft,
//   Send,
//   User2,
//   FileText,
// } from 'lucide-react';

// interface Doctor {
//   id: number;
//   name: string;
//   specialty: string;
//   years_of_experience: number;
//   age_groups: string[];
//   location: {
//     area: string;
//     latitude: number;
//     longitude: number;
//   };
//   contact: {
//     phone: string;
//     email: string;
//   };
//   hospital: string;
//   consultation_fee: number;
//   availability: string[];
// }

// interface Record {
//   _id: string;
//   userId: string;
//   name: string;
//   age: number;
//   pincode: string;
//   xrayDate: Date;
//   xrayReport: {
//     contentType: string;
//     base64: string;
//   } | null;
//   xrayImage: {
//     contentType: string;
//     base64: string;
//   } | null;
// }

// interface User {
//   age: number;
//   email: string;
//   name: string;
//   phone: string;
//   _id: string;
// }

// const PatientDashboard = () => {
//   const [userName, setUserName] = useState<string>("Patient");
//   const [user, setUser] = useState<User | null>(null);
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [showDoctors, setShowDoctors] = useState(false);
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
//   const [locationArea, setLocationArea] = useState<string>('');
//   const [report, setReport] = useState<string>('');
//   const [showAnalysisResult, setShowAnalysisResult] = useState(false);
//   const [records, setRecords] = useState<Record[]>([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchUserAndRecords = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const response = await axios.get("http://localhost:5000/api/users/me", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const userData = response.data.user;
//           setUserName(userData.name);
//           setUser(userData);

//           const recordsResponse = await fetch(`http://localhost:5000/api/getRecords/${userData._id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (recordsResponse.ok) {
//             const data = await recordsResponse.json();
//             setRecords(data);
//           }
//         } catch (err) {
//           console.error("Error fetching user or records:", err.response?.data || err.message);
//           localStorage.removeItem("token");
//           localStorage.removeItem("isPatient");
//           navigate("/patient-portal");
//         }
//       } else {
//         console.log("No token found in localStorage");
//       }
//       setLoading(false);
//     };
//     fetchUserAndRecords();
//   }, [navigate]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setImage(null);
//       setPreview(null);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!image || !preview) return;

//     setAnalyzing(true);
//     setShowAnalysisResult(false);

//     try {
//       const formData = new FormData();
//       formData.append('xrayImage', image);

//       const response = await fetch('http://localhost:5000/api/upload-xray', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to analyze the image');
//       }

//       const result = await response.json();
//       console.log('Analysis Result:', result);

//       const { confidence, prediction, pneumonia_probability } = result;

//       let severityNote = '';
//       if (prediction.toLowerCase() !== 'normal') {
//         if (pneumonia_probability < 0.3) {
//           severityNote = ' - Early Stage Pneumonia';
//         } else if (pneumonia_probability < 0.7) {
//           severityNote = ' - Moderate Stage Pneumonia';
//         } else {
//           severityNote = ' - Severe Pneumonia Detected';
//         }
//       }

//       const report = `Diagnosis: ${prediction} (Confidence: ${(confidence * 100).toFixed(2)}%)${severityNote}`;

//       const newRecord: Record = {
//         _id: '', // Will be set by the server
//         userId: user?._id || '',
//         name: userName,
//         age: user?.age || 0,
//         pincode: '', // Placeholder, update if needed
//         xrayDate: new Date(),
//         xrayReport: null, // Will be updated after saving
//         xrayImage: null, // Will be updated after saving
//       };

//       // Save to database
//       const recordFormData = new FormData();
//       recordFormData.append('userId', user?._id || '');
//       recordFormData.append('name', userName);
//       recordFormData.append('age', (user?.age || 0).toString());
//       recordFormData.append('pincode', ''); // Placeholder
//       recordFormData.append('xrayDate', new Date().toISOString());
//       const blobReport = new Blob([report], { type: 'text/plain' });
//       recordFormData.append('xrayReport', blobReport, 'report.txt');
//       recordFormData.append('xrayImage', image);

//       const recordResponse = await fetch('http://localhost:5000/api/addRecord', {
//         method: 'POST',
//         body: recordFormData,
//       });

//       if (!recordResponse.ok) {
//         throw new Error('Failed to save record');
//       }

//       const savedRecord = await recordResponse.json();
//       setRecords((prevRecords) => [savedRecord, ...prevRecords].slice(0, 5)); // Limit to 5 recent records
//       setReport(report);
//       setShowAnalysisResult(true);
//     } catch (error) {
//       console.error('Error analyzing the image:', error);
//       alert('Analysis failed: ' + (error as Error).message);
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const handleConnectWithDoctors = async () => {
//     if (!locationArea) {
//       alert('Please provide location area to find doctors');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/doctor/getDoctors?age=${user?.age}&location=${encodeURIComponent(locationArea)}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch doctors');
//       }

//       const data = await response.json();
//       setFilteredDoctors(data.slice(0, 5));
//       setShowDoctors(true);
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//       alert('Failed to fetch doctors. Please try again.');
//     }
//   };

//   const handleSendReport = (doctorId: number) => {
//     if (!image) return;

//     const reportData = {
//       doctorId,
//       image: image.name,
//       age: user?.age || 0,
//       location: locationArea,
//       report,
//     };

//     console.log('Sending report:', reportData);
//     alert(
//       `Report sent to doctor ID: ${doctorId}\n\n${JSON.stringify(
//         reportData,
//         null,
//         2
//       )}`
//     );

//     setShowDoctors(false);
//     setShowAnalysisResult(false);
//     setImage(null);
//     setPreview(null);
//     setLocationArea('');
//   };

//   const renderUploadSection = () => (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//       <Card className="bg-white/90 backdrop-blur-md border border-pneumo-blue/20 shadow-lg rounded-xl">
//         <CardContent className="p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <Upload size={20} className="text-pneumo-blue" />
//             Upload X-ray
//           </h2>

//           <input
//             type="file"
//             id="x-ray-upload"
//             accept="image/jpeg,image/png"
//             className="hidden"
//             onChange={handleFileChange}
//           />

//           <div
//             className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100 transition-all"
//             onClick={() => document.getElementById('x-ray-upload')?.click()}
//           >
//             {preview ? (
//               <div className="space-y-4">
//                 <img
//                   src={preview}
//                   alt="X-ray preview"
//                   className="max-h-80 mx-auto object-contain rounded"
//                 />
//                 <p className="text-sm text-gray-500">{image?.name}</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="mx-auto w-12 h-12 rounded-full bg-pneumo-blue/10 flex items-center justify-center">
//                   <FileText className="text-pneumo-blue" size={24} />
//                 </div>
//                 <div>
//                   <p className="text-gray-600 mb-2">
//                     Click here to browse and upload your X-ray image
//                   </p>
//                   <p className="text-sm text-gray-500">Supports: JPG, PNG</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-4">
//             <Button
//               type="button"
//               className="flex-1 bg-pneumo-blue hover:bg-blue-600 text-white"
//               onClick={handleAnalyze}
//               disabled={!image || analyzing}
//             >
//               {analyzing ? 'Analyzing...' : 'Analyze X-ray'}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//       <Card className="bg-white/90 backdrop-blur-md border border-pneumo-blue/20 shadow-lg rounded-xl">
//         <CardContent className="p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <FileText size={20} className="text-pneumo-blue" />
//             Upload History
//           </h2>
//           {records.length === 0 ? (
//             <p className="text-gray-500">No uploads yet.</p>
//           ) : (
//             <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
//               {records.map((record, idx) => (
//                 <div key={idx} className="flex items-start gap-4">
//                   {record.xrayImage && (
//                     <img
//                       src={`data:${record.xrayImage.contentType};base64,${record.xrayImage.base64}`}
//                       alt={`History ${idx}`}
//                       className="w-16 h-16 object-cover rounded border"
//                     />
//                   )}
//                   <div>
//                     <p className="text-sm font-medium">{record.name || 'X-ray'}</p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(record.xrayDate).toLocaleString()}
//                     </p>
//                     {record.xrayReport && (
//                       <p className="text-xs text-gray-600 mt-1 line-clamp-2">
//                         {atob(record.xrayReport.base64)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );

//   const renderAnalysisResult = () => (
//     <div className="max-w-3xl mx-auto">
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center mb-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowAnalysisResult(false)}
//               className="mr-2"
//             >
//               <ArrowLeft size={16} />
//             </Button>
//             <h2 className="text-xl font-semibold">Analysis Result</h2>
//           </div>

//           <div className="mb-6">
//             <img
//               src={preview!}
//               alt="Analyzed X-ray"
//               className="max-h-80 mx-auto rounded"
//             />
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg mb-6">
//             <h3 className="font-medium mb-2">Report:</h3>
//             <p>{report}</p>
//           </div>

//           <div className="space-y-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location Area
//               </label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md"
//                 placeholder="Enter your area (e.g. Andheri West)"
//                 value={locationArea}
//                 onChange={(e) => setLocationArea(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <Button
//             className="w-full bg-pneumo-blue hover:bg-blue-600 text-white"
//             onClick={handleConnectWithDoctors}
//             disabled={!locationArea}
//           >
//             Connect with Doctors
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );

//   const renderDoctorsList = () => (
//     <div className="max-w-4xl mx-auto">
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center mb-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowDoctors(false)}
//               className="mr-2"
//             >
//               <ArrowLeft size={16} />
//             </Button>
//             <h2 className="text-xl font-semibold">Available Doctors</h2>
//           </div>

//           <p className="mb-6 text-gray-600">
//             Based on your location ({locationArea}) and age ({user?.age})
//           </p>

//           {filteredDoctors.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500 mb-4">
//                 No doctors found matching your criteria.
//               </p>
//               <Button variant="outline" onClick={() => setShowDoctors(false)}>
//                 Try different criteria
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredDoctors.map((doctor) => (
//                 <div
//                   key={doctor.id}
//                   className="border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between"
//                 >
//                   <div className="flex items-start space-x-4 mb-4 md:mb-0">
//                     <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-gray-500">
//                       <User2 size={24} />
//                     </div>
//                     <div>
//                       <h3 className="font-medium">{doctor.name}</h3>
//                       <p className="text-sm text-gray-600">
//                         {doctor.specialty}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {doctor.hospital}, {doctor.location.area}
//                       </p>
//                       <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
//                         <p className="text-xs text-gray-400">
//                           {doctor.years_of_experience} years experience
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           ₹{doctor.consultation_fee} consultation fee
//                         </p>
//                       </div>
//                       <p className="text-xs text-pneumo-blue mt-1">
//                         Available: {doctor.availability.join(', ')}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col space-y-2 w-full md:w-auto">
//                     <Button
//                       size="sm"
//                       className="bg-pneumo-blue hover:bg-blue-600 text-white"
//                       onClick={() => handleSendReport(doctor.id)}
//                     >
//                       <Send size={16} className="mr-2" />
//                       Send Report
//                     </Button>
//                     <div className="flex flex-col items-center md:items-end">
//                       <a
//                         href={`tel:${doctor.contact.phone}`}
//                         className="text-xs text-center text-pneumo-blue hover:underline"
//                       >
//                         {doctor.contact.phone}
//                       </a>
//                       <a
//                         href={`mailto:${doctor.contact.email}`}
//                         className="text-xs text-center text-pneumo-blue hover:underline mt-1"
//                       >
//                         {doctor.contact.email}
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );

//   return (
//     <Layout>
//       <section className="py-20 px-4 bg-white min-h-screen">
//         <div className="container mx-auto">
//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold">Welcome {userName} !</h1>
//             <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
//               Upload your chest X-ray for AI-powered pneumonia detection.
//             </p>
//           </div>
//           {!showAnalysisResult && !showDoctors
//             ? renderUploadSection()
//             : showAnalysisResult && !showDoctors
//             ? renderAnalysisResult()
//             : renderDoctorsList()}
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default PatientDashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Send, User2, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  _id: string;
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

interface Record {
  _id: string;
  userId: string;
  name: string;
  age: number;
  pincode: string;
  xrayDate: Date;
  xrayReport: {
    contentType: string;
    base64: string;
  } | null;
  xrayImage: {
    contentType: string;
    base64: string;
  } | null;
  status: 'Pending' | 'Under Review' | 'Resolved';
  doctorFeedback?: string;
}

interface User {
  age: number;
  email: string;
  name: string;
  phone: string;
  _id: string;
}

const PatientDashboard = () => {
  const [userName, setUserName] = useState<string>('Patient');
  const [user, setUser] = useState<User | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [locationArea, setLocationArea] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserAndRecords = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(
            'http://localhost:5000/api/users/me',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const userData = response.data.user;
          setUserName(userData.name);
          setUser(userData);

          const recordsResponse = await fetch(
            `http://localhost:5000/api/getRecords/${userData._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (recordsResponse.ok) {
            const data = await recordsResponse.json();
            setRecords(data);
          } else {
            throw new Error('Failed to fetch records');
          }
        } catch (err) {
          console.error(
            'Error fetching user or records:',
            err.response?.data || err.message
          );
          localStorage.removeItem('token');
          localStorage.removeItem('isPatient');
          navigate('/patient-portal');
        }
      } else {
        console.log('No token found in localStorage');
        navigate('/patient-portal');
      }
      setLoading(false);
    };
    fetchUserAndRecords();
  }, [navigate]);

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
      formData.append('xrayImage', image);

      const response = await fetch('http://localhost:5000/api/upload-xray', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the image');
      }

      const result = await response.json();
      console.log('Analysis Result:', result);

      const { confidence, prediction, pneumonia_probability } = result;

      let severityNote = '';
      if (prediction.toLowerCase() !== 'normal') {
        if (pneumonia_probability < 0.3) {
          severityNote = ' - Early Stage Pneumonia';
        } else if (pneumonia_probability < 0.7) {
          severityNote = ' - Moderate Stage Pneumonia';
        } else {
          severityNote = ' - Severe Pneumonia Detected';
        }
      }

      const report = `Diagnosis: ${prediction} (Confidence: ${(
        confidence * 100
      ).toFixed(2)}%)${severityNote}`;

      const newRecord: Record = {
        _id: '',
        userId: user?._id || '',
        name: userName,
        age: user?.age || 0,
        pincode: '',
        xrayDate: new Date(),
        xrayReport: null,
        xrayImage: null,
        status: 'Pending',
      };

      const recordFormData = new FormData();
      recordFormData.append('userId', user?._id || '');
      recordFormData.append('name', userName);
      recordFormData.append('age', (user?.age || 0).toString());
      recordFormData.append('pincode', '');
      recordFormData.append('xrayDate', new Date().toISOString());
      const blobReport = new Blob([report], { type: 'text/plain' });
      recordFormData.append('xrayReport', blobReport, 'report.txt');
      recordFormData.append('xrayImage', image);

      const recordResponse = await fetch(
        'http://localhost:5000/api/addRecord',
        {
          method: 'POST',
          body: recordFormData,
        }
      );

      if (!recordResponse.ok) {
        throw new Error('Failed to save record');
      }

      const savedRecord = await recordResponse.json();
      setRecords(prevRecords => [savedRecord, ...prevRecords].slice(0, 5));
      setReport(report);
      setShowAnalysisResult(true);
    } catch (error) {
      console.error('Error analyzing the image:', error);
      toast.error('Analysis failed: ' + (error as Error).message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConnectWithDoctors = async () => {
    if (!locationArea) {
      toast.error('Please provide location area to find doctors');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/doctor/getDoctors?age=${
          user?.age
        }&location=${encodeURIComponent(locationArea)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setFilteredDoctors(
        data.map(doctor => ({
          ...doctor,
          id: doctor._id,
        }))
      );
      setShowDoctors(true);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors. Please try again.');
    }
  };

  const handleSendReport = async (doctorId: string, doctorName: string) => {
    if (!image || !records[0]) {
      toast.error('No record to send. Please analyze an X-ray first.');
      return;
    }

    try {
      const recordId = records[0]._id;

      const assignResponse = await fetch(
        'http://localhost:5000/api/assignRecord',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            doctorId,
            recordId,
          }),
        }
      );

      if (!assignResponse.ok) {
        const errorData = await assignResponse.json();
        throw new Error(
          errorData.message || 'Failed to assign record to doctor'
        );
      }

      toast.success(`Report successfully sent to : ${doctorName}`);

      setShowDoctors(false);
      setShowAnalysisResult(false);
      setImage(null);
      setPreview(null);
      setLocationArea('');
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error(error.message || 'Failed to send report to doctor.');
    }
  };

  const isValidBase64 = (str: string | undefined): boolean => {
    if (typeof str !== 'string' || str.length === 0) return false;
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUploadSection = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/90 backdrop-blur-md border border-pneumo-blue/20 shadow-lg rounded-xl">
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
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100 transition-all"
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
      <Card className="bg-white/90 backdrop-blur-md border border-pneumo-blue/20 shadow-lg rounded-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-pneumo-blue" />
            Upload History
          </h2>
          {records.length === 0 ? (
            <p className="text-gray-500">No uploads yet.</p>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
              {records.map((record, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  {record.xrayImage &&
                  record.xrayImage.base64 &&
                  isValidBase64(record.xrayImage.base64) ? (
                    <img
                      src={`data:${
                        record.xrayImage.contentType || 'image/jpeg'
                      };base64,${record.xrayImage.base64}`}
                      alt={`History ${idx}`}
                      className="w-16 h-16 object-cover rounded border"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        console.error(
                          'Failed to load image:',
                          record.xrayImage
                        );
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                      <p className="text-xs text-gray-500">No Image</p>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {record.name || 'X-ray'}
                      </p>
                      {record.doctorFeedback && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedFeedback(record.doctorFeedback!)
                          }
                          title="View Doctor Feedback"
                        >
                          <MessageSquare
                            size={16}
                            className="text-pneumo-blue"
                          />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(record.xrayDate).toLocaleString()}
                    </p>
                    {record.xrayReport &&
                    record.xrayReport.base64 &&
                    isValidBase64(record.xrayReport.base64) ? (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {atob(record.xrayReport.base64)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1">
                        No report available
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      <strong>Status:</strong>{' '}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Doctor Feedback</h3>
            <p className="text-gray-600">{selectedFeedback}</p>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedFeedback(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
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
            disabled={!locationArea}
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
            Based on your location ({locationArea}) and age ({user?.age})
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
                  key={doctor._id}
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
                      onClick={() => handleSendReport(doctor._id, doctor.name)}
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
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Welcome {userName} !</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Upload your chest X-ray for AI-powered pneumonia detection.
            </p>
          </div>
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