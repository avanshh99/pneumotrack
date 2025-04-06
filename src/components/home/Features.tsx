import { Upload, Stethoscope, LineChart, Clock } from 'lucide-react';

const featureItems = [
  {
    icon: <Upload className="w-8 h-8 text-pneumo-blue" />,
    title: 'Easy X-ray Upload',
    description:
      'Securely upload and store your X-ray images in just a few clicks',
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-pneumo-blue" />,
    title: 'Doctor Consultations',
    description:
      'Connect with qualified doctors for personalized pneumonia assessment',
  },
  {
    icon: <LineChart className="w-8 h-8 text-pneumo-blue" />,
    title: 'Track Recovery',
    description:
      'Monitor your recovery with detailed analytics and progress reports',
  },
  {
    icon: <Clock className="w-8 h-8 text-pneumo-blue" />,
    title: 'Quick Results',
    description: 'Receive AI-powered analysis within minutes',
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">
            Comprehensive Pneumonia Management
          </h2>
          <p className="text-gray-600">
            Our platform offers a complete solution for pneumonia detection,
            monitoring, and treatment consultation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureItems.map((item, index) => (
            <div
            key={index}
              className="bg-blue-50 rounded-lg p-8 border border-blue-100 shadow-sm hover:shadow-md transition-all animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
