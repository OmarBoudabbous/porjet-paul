import React from "react";

const WelcomeBanner = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-xl opacity-90">
            Continue your learning journey with our economics courses
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;