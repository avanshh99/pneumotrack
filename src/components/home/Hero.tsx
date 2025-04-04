import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-pneumo-darkBlue text-white py-12 px-4 flex justify-center items-center ">
      <div className="container mx-auto flex flex-col items-center text-center">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold leading-snug">
            Pneumonia Detection
            <span className="block text-pneumo-blue">Simplified</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-lg">
            Our AI-powered platform helps detect pneumonia early and enables patients to track their recovery journey with precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link to="/patient-portal">
              <Button size="lg" className="bg-pneumo-blue hover:bg-blue-600 flex gap-2">
                Patient Portal
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/doctor-portal">
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/30">
                Doctor Portal
              </Button>
            </Link>
          </div>
        </div>
        {/* Uncomment if needed */}
        {/* <div className="rounded-lg overflow-hidden shadow-xl animate-fade-in animate-delay-200 mt-6">
          <img 
            src="/lovable-uploads/9639773c-a9f2-45e1-b26e-8eb6f4101beb.png" 
            alt="X-ray scan of lungs" 
            className="w-full h-auto object-cover"
          />
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
