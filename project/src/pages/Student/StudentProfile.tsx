import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import { User, Mail, Building, Globe, Phone, BookOpen } from 'lucide-react';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.middleName} {user.lastName}
                  </h1>
                  <p className="text-blue-100 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <p className="text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Affiliation
                      </label>
                      <p className="text-gray-800">{user.affiliation}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Country
                      </label>
                      <p className="text-gray-800">{user.country}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <p className="text-gray-800">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        User ID
                      </label>
                      <p className="text-gray-800">#{user.id}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Account Type
                      </label>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;