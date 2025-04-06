import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplyForAccess from '@/pages/ApplyForAccess';
const DoctorLogin = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showApplyModal, setShowApplyModal] = useState(false);

  const navigate = useNavigate();

  // Load remembered email from localStorage on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedDoctorEmail');
    if (rememberedEmail) {
      setLoginForm(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  // Handle input changes (checkbox and text inputs)
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Login submit handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/doctor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || 'Login failed.');
        return;
      }

      // Store logged-in doctor info
      localStorage.setItem('loggedInDoctor', JSON.stringify(data.doctor));

      // Handle Remember Me
      if (loginForm.rememberMe) {
        localStorage.setItem('rememberedDoctorEmail', loginForm.email);
      } else {
        localStorage.removeItem('rememberedDoctorEmail');
      }

      toast.success('Login successful! Redirecting to dashboard...', {
        duration: 1000,
      });

      // Navigate to dashboard
      navigate('/DoctorDashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Failed to connect to server.');
    }
  };

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-xl animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Doctor Portal Login
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Access your portal to manage patient consultations
          </p>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Stethoscope size={20} className="text-pneumo-blue" />
                Doctor Login
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={handleLoginChange}
                      className="rounded text-pneumo-blue"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-pneumo-blue hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pneumo-blue hover:bg-blue-600"
                >
                  Log In
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Not registered?{' '}
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(true)}
                    className="text-pneumo-blue hover:underline"
                  >
                    Apply for access
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-10 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Doctor Benefits</h2>
              <ul className="space-y-3">
                {[
                  'AI-assisted pneumonia detection for more accurate diagnosis',
                  'Remote consultations with patients from anywhere',
                  'Access to patient history and X-ray progression over time',
                  'Digital prescription system for efficient patient care',
                ].map((benefit, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                      <svg
                        className="w-4 h-4 text-pneumo-blue"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  to="/ApplyForAccess"
                  className="text-pneumo-blue hover:underline"
                >
                  Apply for access
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl relative">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Apply for Access
              </h2>

              <ApplyForAccess
                onSuccess={() => {
                  toast.success("You're good to login now!");
                  setShowApplyModal(false);
                }}
              />
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default DoctorLogin;
