import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
}

const UploadRecordsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('token');
      if (token && userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/getRecords/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Failed to fetch records');
          const data = await response.json();
          setRecords(data);
        } catch (error) {
          console.error('Error fetching records:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecords();
  }, [userId]);

  const getImageSrc = (base64: string, contentType: string) => `data:${contentType};base64,${base64}`;

  return (
    <Layout>
      <section className="py-20 px-4 bg-white min-h-screen">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/patient-dashboard')}
              className="mr-2"
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-3xl font-bold text-center">Upload Records</h1>
          </div>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : records.length === 0 ? (
            <p className="text-center text-gray-500">No records found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((record) => (
                <Card key={record._id} className="bg-white/90 backdrop-blur-md border border-pneumo-blue/20 shadow-lg rounded-xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Record #{record._id.slice(-6)}</h2>
                    <p><strong>Name:</strong> {record.name}</p>
                    <p><strong>Age:</strong> {record.age}</p>
                    <p><strong>Pincode:</strong> {record.pincode || 'N/A'}</p>
                    <p><strong>X-ray Date:</strong> {new Date(record.xrayDate).toLocaleDateString()}</p>
                    {record.xrayImage && (
                      <div className="mt-4">
                        <p><strong>X-ray Image:</strong></p>
                        <img
                          src={getImageSrc(record.xrayImage.base64, record.xrayImage.contentType)}
                          alt="X-ray"
                          className="max-h-40 mx-auto object-contain rounded"
                        />
                      </div>
                    )}
                    {record.xrayReport && (
                      <div className="mt-4">
                        <p><strong>Report:</strong></p>
                        <pre className="bg-gray-50 p-2 rounded">{atob(record.xrayReport.base64)}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default UploadRecordsPage;