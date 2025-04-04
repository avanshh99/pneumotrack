import Layout from "@/components/layout/Layout";
import { HelpCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload Your X-ray",
      description:
        "Easily upload a picture or scan of your chest X-ray via our secure platform. Our system ensures complete data privacy and security.",
      image: "/assets/upload-xray.jpg",
    },
    {
      title: "AI Analysis",
      description:
        "Our state-of-the-art AI quickly analyzes your X-ray, detecting potential signs of pneumonia with high precision and reliability.",
      image: "/assets/ai-analysis.jpg",
    },
    {
      title: "Get Results",
      description:
        "Receive a detailed diagnostic report highlighting critical findings and providing a confidence score for the AI's analysis.",
      image: "/assets/results.jpg",
    },
    {
      title: "Doctor Consultation",
      description:
        "Get expert medical advice by connecting with a certified doctor. Discuss your results and explore personalized treatment options.",
      image: "/assets/consult-doctor.jpg",
    },
  ];

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          {/* Header with Video Link */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-center">How It Works</h1>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline text-sm"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Video</span>
              </a>
            </div>
            <p className="text-xl text-gray-600 text-center max-w-2xl">
              Our seamless process ensures accurate pneumonia detection and provides expert guidance for better health outcomes.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center relative`}
              >
                {/* Step Pill */}
                <div className="absolute -top-6 bg-blue-500 text-white text-sm font-bold py-1 px-4 rounded-full">
                  Step {index + 1}
                </div>

                {/* Description */}
                <div className="md:w-1/2 space-y-4">
                  <h2 className="text-2xl font-bold text-pneumo-dark">{step.title}</h2>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Image (OG size) */}
                <div className="md:w-1/2">
                  <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={step.image}
                        alt={`Step ${index + 1}: ${step.title}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
