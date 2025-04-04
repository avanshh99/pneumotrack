
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in">About PneumoTack</h1>
            
            <div className="prose prose-lg mx-auto animate-fade-in animate-delay-100">
              <p className="mb-6 text-gray-700">
                PneumoTack is an innovative AI-powered platform designed to revolutionize pneumonia detection and monitoring. Our mission is to provide accessible, accurate, and timely pneumonia diagnosis through advanced machine learning technology.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-pneumo-dark mt-10">Our Approach</h2>
              <p className="mb-6 text-gray-700">
                We utilize a publicly available chest X-ray dataset containing labeled images of Normal and Pneumonia-infected cases. Our VGG19 deep learning model has been trained to identify pneumonia patterns with high accuracy. The data undergoes rigorous cleaning and augmentation to ensure reliable results.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-pneumo-dark mt-10">The Technology</h2>
              <p className="mb-6 text-gray-700">
                At the core of PneumoTack is a sophisticated Convolutional Neural Network (CNN) architecture, specifically VGG19. This model has been extensively trained on preprocessed datasets to extract patterns from X-ray images and classify them as Normal or Pneumonia-infected.
              </p>
              
              <div className="my-12 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/lovable-uploads/310a3d24-b673-42ee-9f51-22fc9905838a.png" 
                  alt="AI model architecture" 
                  className="w-full h-auto"
                />
              </div>
              
              <h2 className="text-2xl font-semibold mb-4 text-pneumo-dark mt-10">Data Augmentation</h2>
              <p className="mb-6 text-gray-700">
                To improve the model's generalization, we apply various augmentation techniques such as rotation & flipping, zoom & cropping, and brightness & contrast adjustments. This ensures the AI can recognize pneumonia patterns regardless of image variations.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-pneumo-dark mt-10">For Doctors</h2>
              <p className="mb-6 text-gray-700">
                Our platform provides healthcare professionals with an additional diagnostic tool that offers quick, consistent analysis of chest X-rays. This helps in prioritizing cases and identifying pneumonia patterns that might be difficult to detect visually.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-pneumo-dark mt-10">For Patients</h2>
              <p className="mb-6 text-gray-700">
                PneumoTack empowers patients by providing them with accessible preliminary screening and connecting them with specialists when necessary. Our user-friendly interface is designed to be navigable even by those with language barriers.
              </p>
              
              <p className="mt-12 text-gray-700">
                Join us in our mission to make pneumonia detection more accessible and efficient through the power of artificial intelligence and human expertise.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
