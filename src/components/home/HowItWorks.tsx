import { Upload, Search, BarChart3, MessageSquare } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FaQuestionCircle } from "react-icons/fa";

const steps = [
  {
    icon: <Upload className="w-10 h-10 text-pneumo-blue" />,
    title: "Upload Your X-ray",
    description: "Take a picture or upload your X-ray image through our secure platform",
    image: "/assets/upload-xray.jpg"
  },
  {
    icon: <Search className="w-10 h-10 text-pneumo-blue" />,
    title: "AI Analysis",
    description: "Our advanced AI analyzes your X-ray for signs of pneumonia with high accuracy",
    image: "/assets/ai-analysis.jpg"
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-pneumo-blue" />,
    title: "Get Results",
    description: "Receive a detailed report showing the analysis with highlighted areas of concern",
    image: "/assets/results.jpg"
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-pneumo-blue" />,
    title: "Doctor Consultation",
    description: "Connect with a qualified doctor to discuss your results and treatment options",
    image: "/assets/consult-doctor.jpg"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">
            Our seamless process makes pneumonia detection and monitoring simple
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="animate-fade-in relative"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="dark-card h-full p-6 flex flex-col items-center text-center">
                <div className="rounded-lg overflow-hidden w-full mb-6">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="object-cover w-full h-full" 
                    />
                  </AspectRatio>
                </div>
                <div className="bg-pneumo-blue/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-pneumo-blue"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Small FA Icon Button */}
        <div className="fixed bottom-5 right-5">
          <a 
            href="https://www.youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 hover:scale-105 transition-transform duration-200"
            title="Video"
            aria-label="Watch Video"
          >
            <FaQuestionCircle className="text-pneumo-blue w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
