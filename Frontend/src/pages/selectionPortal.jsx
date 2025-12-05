import React, { useState } from "react";
import {
  Shield,
  Building2,
  ArrowRight,
  Users,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelectionPortal() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "engineer") {
      navigate("/login"); // Your engineer/admin login page
    } else if (role === "department") {
      navigate("/depLogin"); // Your department employee login page
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <div className="w-full bg-stone-900 py-4 sm:py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-sm"></div>
            <div>
              <h1 className="text-xl sm:text-2xl font-light text-white tracking-wider">
                WAPDA
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm font-light">
                Trouble Reporting System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl">
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-stone-800 mb-3 sm:mb-4 tracking-wide">
              Welcome
            </h2>
            <p className="text-stone-500 text-base sm:text-lg font-light max-w-2xl mx-auto px-4">
              Select your role to access the appropriate portal
            </p>
            <div className="w-24 h-px bg-stone-300 mx-auto mt-6 sm:mt-8"></div>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Engineer/Admin Card */}
            <button
              onClick={() => handleRoleSelection("engineer")}
              onMouseEnter={() => setHoveredCard("engineer")}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-white rounded-none border border-stone-200 p-8 sm:p-10 transition-all duration-500 hover:border-stone-800 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-sm flex items-center justify-center transition-all duration-500 ${
                      hoveredCard === "engineer"
                        ? "bg-white"
                        : "bg-stone-100"
                    }`}
                  >
                    <Shield
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-900"
                          : "text-stone-700"
                      }`}
                    />
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ${
                      hoveredCard === "engineer"
                        ? "text-white translate-x-2"
                        : "text-stone-400 translate-x-0"
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl sm:text-2xl font-light mb-3 sm:mb-4 tracking-wide transition-colors duration-500 ${
                    hoveredCard === "engineer"
                      ? "text-white"
                      : "text-stone-800"
                  }`}
                >
                  Engineer / OE
                </h3>

                <p
                  className={`text-sm sm:text-base font-light leading-relaxed mb-6 transition-colors duration-500 ${
                    hoveredCard === "engineer"
                      ? "text-stone-300"
                      : "text-stone-600"
                  }`}
                >
                  Access for Shift Engineers, Resident Engineers, Operational Excellence, and Administrators
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start space-x-3">
                    <Briefcase
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-400"
                          : "text-stone-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      Shift Engineer
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-400"
                          : "text-stone-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      Resident Engineer
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-400"
                          : "text-stone-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                        hoveredCard === "engineer"
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      Admin & OE
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Department Employee Card */}
            <button
              onClick={() => handleRoleSelection("department")}
              onMouseEnter={() => setHoveredCard("department")}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-white rounded-none border border-stone-200 p-8 sm:p-10 transition-all duration-500 hover:border-stone-800 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-sm flex items-center justify-center transition-all duration-500 ${
                      hoveredCard === "department"
                        ? "bg-white"
                        : "bg-stone-100"
                    }`}
                  >
                    <Building2
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-900"
                          : "text-stone-700"
                      }`}
                    />
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ${
                      hoveredCard === "department"
                        ? "text-white translate-x-2"
                        : "text-stone-400 translate-x-0"
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl sm:text-2xl font-light mb-3 sm:mb-4 tracking-wide transition-colors duration-500 ${
                    hoveredCard === "department"
                      ? "text-white"
                      : "text-stone-800"
                  }`}
                >
                  Department Employee
                </h3>

                <p
                  className={`text-sm sm:text-base font-light leading-relaxed mb-6 transition-colors duration-500 ${
                    hoveredCard === "department"
                      ? "text-stone-300"
                      : "text-stone-600"
                  }`}
                >
                  Access for department staff members from Electrical, Mechanical, Civil, and other departments
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start space-x-3">
                    <Building2
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-400"
                          : "text-stone-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      Electrical Department
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-400"
                          : "text-stone-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      Mechanical Department
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-400"
                          : "text-stone-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                        hoveredCard === "department"
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      Civil & Other Departments
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto px-4">
              If you're unsure which portal to use, please contact your supervisor or the system administrator
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-white border-t border-stone-200 py-4 sm:py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-stone-500 text-xs font-light text-center sm:text-left">
            © 2024 WAPDA. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button className="text-stone-500 hover:text-stone-700 text-xs font-light transition-colors">
              Help
            </button>
            <button className="text-stone-500 hover:text-stone-700 text-xs font-light transition-colors">
              Contact
            </button>
            <button className="text-stone-500 hover:text-stone-700 text-xs font-light transition-colors">
              Privacy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}