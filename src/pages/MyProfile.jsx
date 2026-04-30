import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award,
  BookOpen,
  GraduationCap,
  Edit,
  Camera,
  Activity
} from "lucide-react";

const MyProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app, this would come from API
  const profileData = {
    firstName: user?.first_name || "John",
    lastName: user?.last_name || "Doe",
    email: user?.email || "john.doe@school.edu",
    phone: user?.phone || "+1 234 567 8900",
    address: user?.address || "123 Education Street, Learning City",
    dateOfBirth: user?.date_of_birth || "1990-05-15",
    role: user?.role || "School Admin",
    department: user?.department || "Administration",
    joinDate: user?.join_date || "2023-01-15",
    bio: user?.bio || "Dedicated education professional with over 10 years of experience in school administration and management.",
    education: [
      { degree: "Master of Education Administration", institution: "State University", year: "2015" },
      { degree: "Bachelor of Education", institution: "National College", year: "2012" }
    ],
    certifications: [
      { name: "School Management Certification", issuer: "Education Board", year: "2020" },
      { name: "Leadership Development Program", issuer: "Institute of Education", year: "2018" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#1e40af]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white border-[#1E40AF] flex items-center justify-center backdrop-blur-sm border-4">
                <User className="w-16 h-16 text-[#1E40AF]" />
              </div>
              <button className="absolute bottom-0 right-0 bg-green-500 text-primary-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <Activity className="w-4 h-4" />
              </button>
            </div>
            
            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl text-[#ffff] font-bold">{profileData.firstName} {profileData.lastName}</h1>
              <p className="text-[#fff] text-lg capitalize">{profileData.role}</p>
              <p className="text-gray-300 mt-2">{profileData.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {profileData.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{profileData.department}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{profileData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{profileData.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{profileData.dateOfBirth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-500" />
              Education
            </h2>
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-primary-600 mt-1">Class of {edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-500" />
              Certifications
            </h2>
            <div className="space-y-4">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-green-600 mt-1">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default MyProfile;