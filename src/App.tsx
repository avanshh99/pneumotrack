// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Index from "./pages/Index";
// import About from "./pages/About";
// import HowItWorks from "./pages/HowItWorks";
// import Contact from "./pages/Contact";
// import PatientPortal from "./pages/PatientPortal";
// import DoctorPortal from "./pages/DoctorPortal";
// import NotFound from "./pages/NotFound";
// import DoctorDashboard from "./pages/DoctorDashboard";
// import PatientDashboard from "./pages/PatientDashboard";


// const queryClient = new QueryClient();

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const authToken = localStorage.getItem('token');
//   return authToken ? children : <Navigate to="/patient-portal" />;
// };

// // Authentication Check for Doctor Portal
// const DoctorPortalWithAuth = () => {
//   const authToken = localStorage.getItem('authToken');
//   if (authToken) {
//     return <Navigate to="/DoctorDashboard" replace />;
//   }
//   return <DoctorPortal />;
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/how-it-works" element={<HowItWorks />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/patient-portal" element={<PatientPortal />} />
//           <Route path="/patient-dashboard" element={<PatientDashboard />} />
//           <Route path="/doctor-portal" element={<DoctorPortalWithAuth />} />
//           <Route
//             path="/DoctorDashboard"
//             element={
//               <ProtectedRoute>
//                 <DoctorDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;




import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import PatientPortal from "./pages/PatientPortal";
import DoctorPortal from "./pages/DoctorPortal";
import NotFound from "./pages/NotFound";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import UploadRecordsPage from "./pages/UploadRecordsPage";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const patientToken = localStorage.getItem('token');
  const doctorToken = localStorage.getItem('authToken');

  if (role === 'patient' && !patientToken) {
    return <Navigate to="/patient-portal" replace />;
  }
  if (role === 'doctor' && !doctorToken) {
    return <Navigate to="/doctor-portal" replace />;
  }
  return children;
};

// Authentication Check for Patient Portal
const PatientPortalWithAuth = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/patient-dashboard" replace /> : <PatientPortal />;
};

// Authentication Check for Doctor Portal
const DoctorPortalWithAuth = () => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? <Navigate to="/DoctorDashboard" replace /> : <DoctorPortal />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/patient-portal" element={<PatientPortalWithAuth />} />
          <Route path="/upload-records/:userId" element={<UploadRecordsPage />} />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/doctor-portal" element={<DoctorPortalWithAuth />} />
          <Route
            path="/DoctorDashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;