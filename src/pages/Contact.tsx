
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageSquare, Phone } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">Contact Us</h1>
          <p className="text-xl text-gray-600 mb-16 text-center max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Have questions about PneumoTack? Get in touch with our team.
          </p>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="animate-fade-in animate-delay-200">
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-pneumo-blue/10 p-3 rounded-full">
                    <Mail className="text-pneumo-blue" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">support@pneumotack.com</p>
                    <p className="text-gray-600">info@pneumotack.com</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-pneumo-blue/10 p-3 rounded-full">
                    <Phone className="text-pneumo-blue" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-pneumo-blue/10 p-3 rounded-full">
                    <MessageSquare className="text-pneumo-blue" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-600">Available Monday - Friday</p>
                    <p className="text-gray-600">9:00 AM - 5:00 PM ET</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in animate-delay-300">
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[120px]"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-pneumo-blue hover:bg-blue-600">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
