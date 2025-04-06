
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  "Early detection for better outcomes",
  "Secure storage for all your X-rays",
  "Connect with specialized doctors"
];

const CallToAction = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="dark-card p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold">Ready to get started?</h2>
              <p className="text-gray-300">
                Join thousands of patients and doctors using our platform for advanced pneumonia detection and monitoring.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-pneumo-blue" size={20} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col md:items-end space-y-4 animate-fade-in animate-delay-200">
              <Link to="/patient-portal" className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto bg-pneumo-blue hover:bg-blue-600 flex gap-2">
                  Get Started
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/how-it-works" className="w-full md:w-auto">
                <Button variant="outline" size="lg" className="w-full md:w-auto border-gray-500 text-black hover:bg-white/10">
                  Learn More
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
