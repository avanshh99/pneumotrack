import Layout from "@/components/layout/Layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload Your X-ray",
      description:
        "Just upload a clear photo or scanned image of your chest X-ray. It’s quick and totally secure. We make sure your data stays safe and private.",
      image: "/assets/upload-xray.jpg",
    },
    {
      title: "AI Analysis",
      description:
        "Our smart AI will study your X-ray and look for signs of pneumonia. It does this fast and accurately, just like a trained doctor.",
      image: "/assets/ai-analysis.jpg",
    },
    {
      title: "Get Results",
      description:
        "You’ll get a simple report that shows what the AI found. It includes a confidence score that tells you how sure the AI is about its result.",
      image: "/assets/results.jpg",
    },
    {
      title: "Doctor Consultation",
      description:
        "Need help understanding the results? You can easily talk to a certified doctor who will explain everything and guide you on what to do next.",
      image: "/assets/consult-doctor.jpg",
    },
  ];

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="flex items-center gap-3 mb-2 relative">
              <h1 className="text-4xl font-bold text-center">How It Works</h1>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="text-blue-500 hover:text-blue-700 w-5 h-5 cursor-pointer"
                />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Video
                </span>
              </a>
            </div>
            <p className="text-xl text-gray-600 text-center max-w-2xl">
              Just follow 4 simple steps to check your chest X-ray and talk to a doctor if needed.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16"> {/* reduced gap from 24 to 16 */}
            {steps.map((step, index) => (
              <div
                key={index}
                 className="bg-sky-100 border border-gray-200 rounded-2xl shadow-md p-6 md:p-10 transition hover:shadow-lg"
              >
                {/* Pill Above Title */}
                <div className="text-center mb-4">
                  <div className="inline-block bg-blue-500 text-white text-sm font-bold py-1 px-4 rounded-full shadow">
                    Step {index + 1}
                  </div>
                </div>

                {/* Content Row */}
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } md:items-center gap-6 md:gap-10`}
                >
                  {/* Description */}
                  <div className="md:w-1/2 space-y-3">
                    <h2 className="text-2xl font-bold text-pneumo-dark text-center md:text-left">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 text-center md:text-left">
                      {step.description}
                    </p>
                  </div>

                  {/* Image - smaller and closer */}
                  <div className="md:w-1/2 flex justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 max-w-sm w-full">
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
