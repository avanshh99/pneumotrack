// src/pages/DoctorLogin.tsx
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";

const DoctorLogin = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate(); // <-- Ho

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted:", loginForm);
    toast.success("Login successful! Redirecting to dashboard...");
    navigate("/DoctorDashboard");
    // Navigate to dashboard (e.g., using useNavigate or Next.js router)
  };

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-xl animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-center">Doctor Portal Login</h1>
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
                  Not registered?{' '}
                  <a href="#" className="text-pneumo-blue hover:underline">
                    Apply for access
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-10 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Doctor Benefits</h2>
              <ul className="space-y-3">
                {[
                  "AI-assisted pneumonia detection for more accurate diagnosis",
                  "Remote consultations with patients from anywhere",
                  "Access to patient history and X-ray progression over time",
                  "Digital prescription system for efficient patient care",
                ].map((benefit, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="bg-pneumo-blue/20 p-1 rounded-full mt-0.5">
                      <svg className="w-4 h-4 text-pneumo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button className="w-full bg-pneumo-blue hover:bg-blue-600">
                  Apply for Doctor Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default DoctorLogin;
