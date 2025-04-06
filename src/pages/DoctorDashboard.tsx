import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, User, Calendar, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DoctorDashboard = () => {
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   if (!token) {
  //     navigate('/login'); // Redirect to login if no token
  //   }

  //   const fetchDoctorData = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/api/doctor/all', {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         throw new Error('Failed to fetch doctor data');
  //       }

  //       const data = await res.json();
  //       setDoctorData(data);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching doctor data:', err);
  //       setLoading(false);
  //     }
  //   };

  //   fetchDoctorData();
  // }, [navigate]);

  useEffect(() => {
    const doctorData = localStorage.getItem('loggedInDoctor');

    if (doctorData) {
      try {
        const parsedDoctor = JSON.parse(doctorData);
        setDoctorName(parsedDoctor.name); // Assuming 'name' is a valid key
      } catch (error) {
        console.error('Error parsing doctor data:', error);
        setDoctorName('Doctor');
      }
    } else {
      console.log('No doctor data in localStorage');
      setDoctorName('Doctor'); // Fallback name if nothing is found
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInDoctor');
    localStorage.removeItem('rememberedDoctorEmail');

    toast.success('Logged out successfully!', {
      duration: 1000,
    });

    navigate('/doctor-portal');
  };

  const pendingCases = [
    {
      id: 1,
      name: 'Aarav Sharma',
      age: 45,
      date: '2024-06-15',
      status: 'Pending Review',
    },
    {
      id: 2,
      name: 'Sanya Mehta',
      age: 32,
      date: '2024-06-14',
      status: 'Pending Review',
    },
    {
      id: 3,
      name: 'Raghav Verma',
      age: 58,
      date: '2024-06-13',
      status: 'Pending Review',
    },
  ];

  const completedCases = [
    {
      id: 4,
      name: 'Ishita Roy',
      age: 28,
      date: '2024-06-10',
      status: 'Diagnosed: Pneumonia',
    },
    {
      id: 5,
      name: 'Kunal Nair',
      age: 51,
      date: '2024-06-08',
      status: 'Diagnosed: Normal',
    },
    {
      id: 6,
      name: 'Sunita Iyer',
      age: 64,
      date: '2024-06-05',
      status: 'Diagnosed: Pneumonia',
    },
  ];

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-6 animate-fade-in space-x-10">
            <h1 className="text-3xl font-bold">Welcome, {doctorName}</h1>
            <Button
              onClick={handleLogout}
              className="bg-pneumo-blue hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center p-0"
              title="Logout" // Tooltip for accessibility
            >
              <LogOut size={20} />
            </Button>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 animate-fade-in animate-delay-200">
            <div className="dark-card p-6">
              <h3 className="text-xl font-semibold mb-4">Dashboard Preview</h3>

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
                      <p className="text-sm font-medium">Raghvendra Verma</p>
                      <p className="text-xs text-gray-400">
                        Pneumonia detected
                      </p>
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
                      <p className="text-sm font-medium">Sarah Shaikh</p>
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
                      <p className="text-sm font-medium">Yesubai Patil</p>
                      <p className="text-xs text-gray-400">
                        Follow-up required
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">1h ago</span>
                </div>
              </div>
            </div>

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
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              patient.status.includes('Pneumonia')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DoctorDashboard;
