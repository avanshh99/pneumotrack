import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, Calendar, LogOut, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ConsultationRecord {
  _id: string;
  doctorId: string;
  recordIds: string[]; // Expect an array of strings
  createdAt: string;
}

interface RecordDetails {
  _id: string;
  name: string;
  age: number;
  xrayDate: string;
  xrayImage: { contentType: string; base64: string } | null;
  xrayReport: { contentType: string; base64: string } | null;
  status: string;
  doctorFeedback?: string;
}

interface ConsultationWithRecord {
  _id: string;
  doctorId: string;
  recordId: RecordDetails;
  createdAt: string;
}

const DoctorDashboard = () => {
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [pendingConsultations, setPendingConsultations] = useState<
    ConsultationWithRecord[]
  >([]);
  const [completedConsultations, setCompletedConsultations] = useState<
    ConsultationWithRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] =
    useState<ConsultationWithRecord | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const doctorData = localStorage.getItem('loggedInDoctor');
    const token = localStorage.getItem('authToken');


    if (!token || !doctorData) {
      console.log(
        'Missing token or doctor data, redirecting to /doctor-portal'
      );
      navigate('/doctor-portal');
      return;
    }

    let doctorId, doctorName;
    try {
      const parsedData = JSON.parse(doctorData);
      doctorId = parsedData.id || parsedData._id || '';
      doctorName = parsedData.name || 'Doctor';
      console.log('Extracted doctorId:', doctorId);
      console.log('Extracted doctorName:', doctorName);

      if (!doctorId) {
        console.error('Doctor ID is missing or undefined in localStorage');
        navigate('/doctor-portal');
        return;
      }

      setDoctorName(doctorName);
      setDoctorId(doctorId);
    } catch (error) {
      console.error('Error parsing doctor data from localStorage:', error);
      setDoctorName('Doctor');
      navigate('/doctor-portal');
      return;
    }

    const fetchConsultations = async (doctorId: string) => {
      if (!doctorId) {
        console.log('No doctorId available', { doctorId });
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/consultations/${doctorId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );


        if (!res.ok) {
          const errorText = await res.text();
          console.log('Response error:', errorText);
          throw new Error('Failed to fetch consultations');
        }

        const data: ConsultationRecord = await res.json();
        console.log('Response data:', data);
        console.log('Record IDs:', data.recordIds);

        // Validate recordIds (ensure they are strings)
        const validRecordIds = data.recordIds.filter(
          id => typeof id === 'string'
        );
        if (validRecordIds.length !== data.recordIds.length) {
          console.warn(
            'Some record IDs are invalid (not strings):',
            data.recordIds
          );
        }

        // Fetch full details for each record
        const recordDetails = await Promise.all(
          validRecordIds.map(async recordId => {
            try {
              const recordRes = await fetch(
                `http://localhost:5000/api/records/${recordId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (!recordRes.ok) {
                console.error(
                  `Failed to fetch record ${recordId}: ${recordRes.status}`
                );
                return null;
              }
              return await recordRes.json();
            } catch (err) {
              return null;
            }
          })
        );

        // Filter out null records
        const validRecords = recordDetails.filter(
          record => record !== null
        ) as RecordDetails[];

        // Filter pending and completed based on doctorFeedback
        const pending = validRecords.filter(record => !record.doctorFeedback);
        const completed = validRecords.filter(record => record.doctorFeedback);

        setPendingConsultations(
          pending.map(record => ({
            _id: data._id,
            doctorId: data.doctorId,
            recordId: record,
            createdAt: data.createdAt,
          }))
        );
        setCompletedConsultations(
          completed.map(record => ({
            _id: data._id,
            doctorId: data.doctorId,
            recordId: record,
            createdAt: data.createdAt,
          }))
        );

        setLoading(false);
      } catch (err) {
        
        toast.error('No consultations yet');
        setLoading(false);
      }
    };

    fetchConsultations(doctorId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInDoctor');
    localStorage.removeItem('rememberedDoctorEmail');

    toast.success('Logged out successfully!', {
      duration: 1000,
    });

    navigate('/doctor-portal');
  };

  const handleViewRecord = (consultation: ConsultationWithRecord) => {
    setSelectedRecord(consultation);
    setFeedback(consultation.recordId.doctorFeedback || '');
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
    setFeedback('');
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRecord || !feedback.trim()) {
      toast.error('Please provide feedback before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/api/submitFeedback', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: selectedRecord.recordId._id,
          feedback,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast.success('Feedback submitted successfully!');
      setPendingConsultations(prev =>
        prev.filter(c => c.recordId._id !== selectedRecord.recordId._id)
      );
      setCompletedConsultations(prev => [
        ...prev,
        {
          ...selectedRecord,
          recordId: { ...selectedRecord.recordId, doctorFeedback: feedback },
        },
      ]);
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-6 animate-fade-in space-x-10">
            <h1 className="text-3xl font-bold">Welcome, {doctorName}</h1>
            <Button
              onClick={handleLogout}
              className="bg-pneumo-blue hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center p-0"
              title="Logout"
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
                  <span className="text-2xl font-bold">
                    {pendingConsultations.length +
                      completedConsultations.length}
                  </span>
                  <span className="text-sm text-gray-300">Patients</span>
                </div>
                <div className="bg-pneumo-blue/20 rounded-lg p-4 flex flex-col items-center justify-center">
                  <FileText size={28} className="text-pneumo-blue mb-2" />
                  <span className="text-2xl font-bold">
                    {pendingConsultations.length}
                  </span>
                  <span className="text-sm text-gray-300">Pending Cases</span>
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
                    {loading ? (
                      <p>Loading...</p>
                    ) : pendingConsultations.length === 0 ? (
                      <p>No pending cases.</p>
                    ) : (
                      pendingConsultations.map(consultation => (
                        <div
                          key={consultation.recordId._id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-medium">
                              {consultation.recordId.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Age: {consultation.recordId.age} • Uploaded:{' '}
                              {new Date(
                                consultation.recordId.xrayDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                              Pending Review
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRecord(consultation)}
                              title="View Report"
                            >
                              <Eye size={16} className="text-pneumo-blue" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full">
                      View All Pending Cases
                    </Button>
                  </TabsContent>
                  <TabsContent value="completed" className="space-y-4">
                    {loading ? (
                      <p>Loading...</p>
                    ) : completedConsultations.length === 0 ? (
                      <p>No completed cases.</p>
                    ) : (
                      completedConsultations.map(consultation => (
                        <div
                          key={consultation.recordId._id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-medium">
                              {consultation.recordId.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Age: {consultation.recordId.age} • Diagnosed:{' '}
                              {new Date(
                                consultation.recordId.xrayDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRecord(consultation)}
                              title="View Feedback"
                            >
                              <Eye size={16} className="text-pneumo-blue" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full">
                      View All Completed Cases
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          {selectedRecord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-sky-50 rounded-lg p-6 max-w-4xl w-full shadow-lg border border-sky-200">
                <div className="flex flex-row items-start space-x-6">
                  {/* X-ray Image Section */}
                  <div className="w-1/3">
                    <h3 className="text-lg font-semibold mb-2">
                      Patient Report - {selectedRecord.recordId.name}
                    </h3>
                    {selectedRecord.recordId.xrayImage?.base64 && (
                      <div>
                        <strong>X-ray Image:</strong>
                        <img
                          src={`data:${selectedRecord.recordId.xrayImage.contentType};base64,${selectedRecord.recordId.xrayImage.base64}`}
                          alt="X-ray"
                          className="mt-2 w-full h-auto rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Details and Feedback Section */}
                  <div className="w-2/3 space-y-2">
                    <div>
                      <p>
                        <strong>Age:</strong> {selectedRecord.recordId.age}
                      </p>
                      <p>
                        <strong>Uploaded:</strong>{' '}
                        {new Date(
                          selectedRecord.recordId.xrayDate
                        ).toLocaleString()}
                      </p>
                      {selectedRecord.recordId.xrayReport?.base64 && (
                        <p className="mt-2">
                          <strong>Diagnosis:</strong>{' '}
                          {atob(selectedRecord.recordId.xrayReport.base64)}
                        </p>
                      )}
                    </div>

                    {selectedRecord.recordId.doctorFeedback ? (
                      <div className="mt-4">
                        <p>
                          <strong>Feedback:</strong>{' '}
                          {selectedRecord.recordId.doctorFeedback}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">
                          Feedback:
                        </label>
                        <textarea
                          className="w-full border rounded p-3"
                          rows={7}
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
                          placeholder="Enter your feedback for the patient..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                  {!selectedRecord.recordId.doctorFeedback && (
                    <Button onClick={handleSubmitFeedback}>
                      Submit Feedback
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DoctorDashboard;
