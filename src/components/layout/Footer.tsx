import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pneumo-darkBlue text-white">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold">
              Pneumo<span className="text-pneumo-blue">Tack</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Advanced pneumonia detection platform powered by AI, connecting
              patients with specialists.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/doctor-portal"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Doctor Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/patient-portal"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">
                support@PneumoShield.com
              </li>
              <li className="text-sm text-gray-300">+1 (555) 123-4567</li>
            </ul>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>© 2024 PneumoShield. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
