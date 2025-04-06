import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const ApplyForAccess = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    years_of_experience: "",
    age_groups: [] as string[],
    location: { area: "", latitude: "", longitude: "" },
    contact: { phone: "", email: "" },
    hospital: "",
    consultation_fee: "",
    availability: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes("contact.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [key]: value },
      }));
    } else if (name.includes("location.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (field: "age_groups" | "availability", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const fetchCoordinates = async (area: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(area)}`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: lat,
            longitude: lon,
          },
        }));
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  };

  const handleAreaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const area = e.target.value;
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, area },
    }));

    if (area.length > 3) {
      await fetchCoordinates(area);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      specialty,
      years_of_experience,
      hospital,
      consultation_fee,
      location: { area, latitude, longitude },
      contact: { phone, email },
      age_groups,
      availability,
    } = form;

    if (
      !name || !specialty || !years_of_experience || !hospital || !consultation_fee ||
      !area || !latitude || !longitude || !phone || !email ||
      age_groups.length === 0 || availability.length === 0
    ) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    try {
      const payload = {
        ...form,
        years_of_experience: Number(form.years_of_experience),
        consultation_fee: Number(form.consultation_fee),
        location: {
          ...form.location,
          latitude: parseFloat(form.location.latitude),
          longitude: parseFloat(form.location.longitude),
        },
      };

      const res = await axios.post("http://localhost:5000/api/doctor/apply", payload);
      toast.success(res.data.message || "Application submitted!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error applying.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
      <input name="specialty" placeholder="Specialty" onChange={handleChange} className="border p-2 w-full" />
      <input name="years_of_experience" type="number" placeholder="Years of Experience" onChange={handleChange} className="border p-2 w-full" />
      <input name="hospital" placeholder="Hospital" onChange={handleChange} className="border p-2 w-full" />
      <input name="consultation_fee" type="number" placeholder="Consultation Fee" onChange={handleChange} className="border p-2 w-full" />

      {/* Age Groups */}
      <div>
        <label className="block font-medium mb-1">Age Groups</label>
        <div className="flex gap-4">
          {["Child", "Adult", "Senior"].map((group) => (
            <label key={group} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={group}
                checked={form.age_groups.includes(group)}
                onChange={() => handleCheckboxChange("age_groups", group)}
              />
              {group}
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block font-medium mb-1">Available Days</label>
        <div className="flex flex-wrap gap-4">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <label key={day} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={day}
                checked={form.availability.includes(day)}
                onChange={() => handleCheckboxChange("availability", day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      <input name="location.area" placeholder="Area" onChange={handleAreaChange} className="border p-2 w-full" />
      <input name="location.latitude" placeholder="Latitude" value={form.location.latitude} readOnly className="border p-2 w-full bg-gray-100" />
      <input name="location.longitude" placeholder="Longitude" value={form.location.longitude} readOnly className="border p-2 w-full bg-gray-100" />

      <input name="contact.phone" placeholder="Phone" onChange={handleChange} className="border p-2 w-full" />
      <input name="contact.email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Apply
      </button>
    </form>
  );
};

export default ApplyForAccess;
