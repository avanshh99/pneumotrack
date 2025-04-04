
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stethoscope, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="py-4 backdrop-blur-md bg-white/80 border-b border-gray-100 sticky top-0 z-50 w-full">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-pneumo-dark">
            Pneumo<span className="text-pneumo-blue">Tack</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-pneumo-dark hover:text-pneumo-blue transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-pneumo-dark hover:text-pneumo-blue transition-colors">
            About
          </Link>
          <Link to="/how-it-works" className="text-pneumo-dark hover:text-pneumo-blue transition-colors">
            How It Works
          </Link>
          <Link to="/contact" className="text-pneumo-dark hover:text-pneumo-blue transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doctor-portal">
            <Button variant="outline" className="flex items-center gap-2">
              <Stethoscope size={16} />
              <span className="hidden sm:inline">Doctor</span>
            </Button>
          </Link>
          <Link to="/patient-portal">
            <Button className="bg-pneumo-blue hover:bg-blue-600 flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Patient</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
