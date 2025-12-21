import React, { useState } from "react";
import {
  Shield,
  Building2,
  ArrowRight,
  Users,
  Briefcase,
  Zap,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
  Wrench,
  Settings,
  HardHat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Role card component
const RoleCard = ({ 
  isHovered, 
  onHover, 
  onLeave, 
  onClick, 
  icon:  Icon, 
  title, 
  description, 
  features,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative bg-white border border-stone-200 p-8 sm:p-10 transition-all duration-500 hover:border-stone-400 hover:shadow-xl transform hover:-translate-y-1 text-left rounded-sm overflow-hidden"
    >
      {/* Animated background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-stone-900 to-stone-800 transition-transform duration-500 ease-out origin-left ${
          isHovered ? "scale-x-100" : "scale-x-0"
        }`}
      />
      
      {/* Subtle pattern overlay */}
      <div 
        className={`absolute inset-0 opacity-5 transition-opacity duration-500 ${
          isHovered ?  "opacity-10" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Badge */}
        {badge && (
          <div 
            className={`absolute -top-2 -right-2 px-3 py-1 text-xs font-medium rounded-sm transition-colors duration-500 ${
              isHovered 
                ? "bg-white text-stone-900" 
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {badge}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-sm flex items-center justify-center transition-all duration-500 ${
              isHovered
                ? "bg-white shadow-lg"
                : "bg-stone-100"
            }`}
          >
            <Icon
              className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-500 ${
                isHovered
                  ? "text-stone-900 scale-110"
                  : "text-stone-700"
              }`}
            />
          </div>
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isHovered 
                ? "bg-white/20" 
                : "bg-stone-100"
            }`}
          >
            <ArrowRight
              className={`w-5 h-5 transition-all duration-500 ${
                isHovered
                  ? "text-white translate-x-1"
                  : "text-stone-400"
              }`}
            />
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-xl sm:text-2xl font-light mb-3 tracking-wide transition-colors duration-500 ${
            isHovered ?  "text-white" : "text-stone-800"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm sm:text-base font-light leading-relaxed mb-6 transition-colors duration-500 ${
            isHovered ? "text-stone-300" : "text-stone-500"
          }`}
        >
          {description}
        </p>

        {/* Divider */}
        <div 
          className={`w-12 h-px mb-6 transition-all duration-500 ${
            isHovered ? "bg-stone-600 w-20" : "bg-stone-200"
          }`}
        />

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3"
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              <div 
                className={`w-6 h-6 rounded-sm flex items-center justify-center transition-all duration-500 ${
                  isHovered ?  "bg-white/10" : "bg-stone-50"
                }`}
              >
                <feature.icon
                  className={`w-3.5 h-3.5 transition-colors duration-500 ${
                    isHovered ?  "text-stone-400" : "text-stone-500"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-light transition-colors duration-500 ${
                  isHovered ? "text-stone-300" : "text-stone-600"
                }`}
              >
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          className={`mt-8 flex items-center gap-2 text-sm font-light transition-all duration-500 ${
            isHovered ? "text-white" : "text-stone-400"
          }`}
        >
          <span>Access Portal</span>
          <ChevronRight 
            className={`w-4 h-4 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </div>
      </div>
    </button>
  );
};

// Stats card component
const StatCard = ({ icon:  Icon, value, label }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-stone-800/50 rounded-sm">
    <Icon className="w-5 h-5 text-stone-400" />
    <div>
      <p className="text-white font-light text-lg">{value}</p>
      <p className="text-stone-500 text-xs font-light">{label}</p>
    </div>
  </div>
);

export default function RoleSelectionPortal() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "engineer") {
      navigate("/login");
    } else if (role === "department") {
      navigate("/depLogin");
    }
  };

  const engineerFeatures = [
    { icon: Briefcase, label: "Shift Engineer" },
    { icon: Users, label: "Resident Engineer" },
    { icon: Settings, label: "OE & Admin Access" },
  ];

  const departmentFeatures = [
    { icon:  Wrench, label:  "EME & MME Departments" },
    { icon: HardHat, label: "Civil & XEN Departments" },
    { icon: Building2, label: "All Other Departments" },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-stone-900 py-4 sm:py-5 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-light text-white tracking-wider">
                WAPDA
              </h1>
              <p className="text-stone-500 text-xs font-light hidden sm:block">
                Trouble Reporting System
              </p>
            </div>
          </div>
          
          {/* Quick stats - Desktop only */}
          <div className="hidden lg:flex items-center gap-4">
            <StatCard icon={FileText} value="24/7" label="Reporting" />
            <StatCard icon={Clock} value="Real-time" label="Tracking" />
            <StatCard icon={CheckCircle} value="100%" label="Secure" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm: p-8 lg:p-12">
        <div className="w-full max-w-5xl">
          {/* Title Section */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 rounded-sm mb-6">
              <Shield className="w-4 h-4 text-stone-600" />
              <span className="text-stone-600 text-xs font-medium tracking-wide">
                SECURE PORTAL ACCESS
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-stone-800 mb-4 tracking-wide">
              Welcome to WAPDA
            </h2>
            <p className="text-stone-500 text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed">
              Select your role to access the trouble reporting and management system
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Engineer/Admin Card */}
            <RoleCard
              isHovered={hoveredCard === "engineer"}
              onHover={() => setHoveredCard("engineer")}
              onLeave={() => setHoveredCard(null)}
              onClick={() => handleRoleSelection("engineer")}
              icon={Shield}
              title="Engineer Portal"
              description="For Shift Engineers, Resident Engineers, OE staff, and system administrators"
              features={engineerFeatures}
              
            />

            {/* Department Employee Card */}
            <RoleCard
              isHovered={hoveredCard === "department"}
              onHover={() => setHoveredCard("department")}
              onLeave={() => setHoveredCard(null)}
              onClick={() => handleRoleSelection("department")}
              icon={Building2}
              title="Department Portal"
              description="For department employees to view and respond to assigned trouble reports"
              features={departmentFeatures}
            />
          </div>

          {/* Help Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 py-4 bg-white border border-stone-200 rounded-sm">
              <div className="flex items-center gap-2 text-stone-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-light">Need help choosing? </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-stone-200" />
              <p className="text-stone-600 text-sm font-light">
                Contact your supervisor or{" "}
                <button className="text-stone-800 underline underline-offset-2 hover:text-stone-900 transition-colors">
                  system administrator
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-stone-900 rounded-sm flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <p className="text-stone-500 text-xs font-light">
                © {new Date().getFullYear()} WAPDA.All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="text-stone-500 hover: text-stone-700 text-sm font-light transition-colors flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Documentation
              </button>
              <button className="text-stone-500 hover:text-stone-700 text-sm font-light transition-colors flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Support
              </button>
              <button className="text-stone-500 hover:text-stone-700 text-sm font-light transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Privacy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Missing import - add at top if needed
const AlertCircle = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);