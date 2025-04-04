
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Stethoscope, Users, User, Calendar, FileText } from "lucide-react";

const DoctorPortal = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted:", loginForm);
    toast.success("Login successful! Redirecting to dashboard...");
  };

  // Mock patient cases
  const pendingCases = [
    { id: 1, name: "John Doe", age: 45, date: "2024-06-15", status: "Pending Review" },
    { id: 2, name: "Sarah Johnson", age: 32, date: "2024-06-14", status: "Pending Review" },
    { id: 3, name: "Michael Smith", age: 58, date: "2024-06-13", status: "Pending Review" },
  ];

  const completedCases = [
    { id: 4, name: "Emily Brown", age: 28, date: "2024-06-10", status: "Diagnosed: Pneumonia" },
    { id: 5, name: "Robert Garcia", age: 51, date: "2024-06-08", status: "Diagnosed: Normal" },
    { id: 6, name: "Linda Wilson", age: 64, date: "2024-06-05", status: "Diagnosed: Pneumonia" },
  ];

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center animate-fade-in">Doctor Portal</h1>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Access patient records and provide expert pneumonia consultations
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 animate-fade-in animate-delay-200">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Stethoscope size={20} className="text-pneumo-blue" />
                      Doctor Login
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <Input 
                          id="password"
                          name="password"
                          type="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-pneumo-blue" />
                          <span>Remember me</span>
                        </label>
                        <a href="#" className="text-pneumo-blue hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      
                      <Button type="submit" className="w-full bg-pneumo-blue hover:bg-blue-600">
                        Log In
                      </Button>
                      
                      <p className="text-center text-sm text-gray-600">
                        Not registered?{" "}
                        <a href="#" className="text-pneumo-blue hover:underline">
                          Apply for access
                        </a>
                      </p>
                    </form>
                  </CardContent>
                </Card>

                <div className="dark-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Doctor Dashboard Preview</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-pneumo-blue/20 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Users size={28} className="text-pneumo-blue mb-2" />
                      <span className="text-2xl font-bold">27</span>
                      <span className="text-sm text-gray-300">Patients</span>
                    </div>
                    <div className="bg-pneumo-blue/20 rounded-lg p-4 flex flex-col items-center justify-center">
                      <FileText size={28} className="text-pneumo-blue mb-2" />
                      <span className="text-2xl font-bold">12</span>
                      <span className="text-sm text-gray-300">Pending Cases</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-pneumo-dark p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                          <User size={16} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">John D.</p>
                          <p className="text-xs text-gray-400">Pneumonia detected</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">10m ago</span>
                    </div>
                    <div className="bg-pneumo-dark p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <User size={16} className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sarah J.</p>
                          <p className="text-xs text-gray-400">Normal results</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">25m ago</span>
                    </div>
                    <div className="bg-pneumo-dark p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                          <User size={16} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Michael S.</p>
                          <p className="text-xs text-gray-400">Follow-up required</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 animate-fade-in animate-delay-300">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-pneumo-blue" />
                      Patient Cases
                    </h2>
                    
                    <Tabs defaultValue="pending" className="space-y-4">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="pending">Pending Review</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="pending" className="space-y-4">
                        {pendingCases.map(patient => (
                          <div 
                            key={patient.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{patient.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Age: {patient.age} • Uploaded: {patient.date}
                                </p>
                              </div>
                              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                                {patient.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        <Button variant="outline" className="w-full">
                          View All Pending Cases
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="completed" className="space-y-4">
                        {completedCases.map(patient => (
                          <div 
                            key={patient.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{patient.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Age: {patient.age} • Diagnosed: {patient.date}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                patient.status.includes("Pneumonia") 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {patient.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        <Button variant="outline" className="w-full">
                          View All Completed Cases
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Doctor Benefits</h2>
                    
                    <ul className="space-y-3">
                      <li className="flex gap-3 items-start">
                        <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                          <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-gray-700">AI-assisted pneumonia detection for more accurate diagnosis</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                          <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-gray-700">Remote consultations with patients from anywhere</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                          <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-gray-700">Access to patient history and X-ray progression over time</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                          <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-gray-700">Digital prescription system for efficient patient care</span>
                      </li>
                    </ul>
                    
                    <div className="mt-6">
                      <Button className="w-full bg-pneumo-blue hover:bg-blue-600">
                        Apply for Doctor Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DoctorPortal;
