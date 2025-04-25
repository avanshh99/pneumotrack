import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";


const PatientPortal = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);
  const [signupData, setSignupData] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    age: string;
    gender: string;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/patient-dashboard");
    }
  }, [navigate]);

  const API_URL = "http://localhost:5000/api"; // Backend URL

  // Handle Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrors({ email: !email ? "Email is required" : "", password: !password ? "Password is required" : "" });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isPatient", "true");
      toast.success("You have logged in successfully!");
      setErrors({});
      navigate("/patient-dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const errorMap: { [key: string]: string } = {};
        validationErrors.forEach((e: any) => {
          errorMap[e.param] = e.msg;
        });
        setErrors(errorMap);
      } else {
        setErrors({ general: errorMessage });
      }
    }
  };

  // Handle Signup
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    // Frontend validation (only email format and all fields required)
    const { name, email, phone, password, age, gender } = signupData;
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
    if (!phone) newErrors.phone = "Phone is required";
    if (!password) newErrors.password = "Password is required";
    if (!age) newErrors.age = "Age is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare payload with correct data types
    // const payload = {
    //   name,
    //   email,
    //   phone,
    //   password,
    //   age: parseInt(age, 10),
    //   gender,
    // };

    // console.log('Signup payload:', payload); // Debug log

    try {
      const response = await axios.post(`${API_URL}/users/signup`, signupData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isPatient", "true");
      toast.success("Registered successfully");
      setIsSignupOpen(false);
      setErrors({});
      navigate("/patient-dashboard");
    } catch (err: any) {
      console.error('Signup error:', err.response?.data);
      const errorMessage = err.response?.data?.message || "Signup failed";
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const errorMap: { [key: string]: string } = {};
        validationErrors.forEach((e: any) => {
          errorMap[e.param] = e.msg;
        });
        setErrors(errorMap);
      } else {
        setErrors({ general: errorMessage });
      }
    }
  };

  // Handle signup form input changes
  const handleSignupChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return (
    <Layout>
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-16">
        {/* Title and Description */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Patient Portal</h1>
          <p className="text-lg text-gray-600">
            Upload your chest X-ray for AI-powered pneumonia detection
          </p>
        </div>

        {/* Side-by-side Login and Info */}
        <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full items-start justify-center">
          {/* Patient Login */}
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Patient Login</h2>
            {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full bg-pneumo-blue text-white mt-4">
                Login
              </Button>
            </form>
            <p className="text-center mt-4">
              No account?{" "}
              <button
                onClick={() => setIsSignupOpen(true)}
                className="text-pneumo-blue hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Why Create Account */}
          <div className="bg-pneumo-darkBlue text-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="font-semibold text-xl mb-4">Why Create an Account?</h3>
            <ul className="space-y-4">
              {[
                "Save and access your X-ray history",
                "Track your recovery progress over time",
                "Securely connect with doctors for consultations",
                "Receive treatment recommendations and prescriptions",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                    <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
          </DialogHeader>
          {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
                value={signupData.name}
                onChange={handleSignupChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="signupEmail" className="block text-gray-700 mb-1">Email</label>
              <input
                id="signupEmail"
                name="email"
                type="email"
                placeholder="your@email.com"
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="1234567890"
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
                value={signupData.phone}
                onChange={handleSignupChange}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="signupPassword" className="block text-gray-700 mb-1">Password</label>
              <input
                id="signupPassword"
                name="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="age" className="block text-gray-700 mb-1">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                placeholder="25"
                className={`w-full p-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded`}
                value={signupData.age}
                onChange={handleSignupChange}
                required
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>
            <div>
              <label htmlFor="gender" className="block text-gray-700 mb-1">Gender</label>
              <select
                id="gender"
                name="gender"
                className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded`}
                value={signupData.gender}
                onChange={handleSignupChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
            <Button type="submit" className="w-full bg-pneumo-blue text-white">
              Create Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PatientPortal;