import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  Briefcase,
  Building2,
  AlertCircle,
  Clock,
} from "lucide-react";
import API_URL from "../../utils/api";
import { Navigate, useNavigate } from "react-router-dom";

export default function DepartmentEmployeeAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    department: "EME (P)",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [actionSuccess, setActionSuccess] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
    setPendingApproval(false);
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setValidationErrors({});

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setValidationErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin
        ? `${API_URL}/department/login`
        : `${API_URL}/department/register`;

      const payload = isLogin
        ? {
            employeeId: formData.employeeId, // ✅ Employee ID for departmental users
            password: formData.password,
          }
        : {
            name: formData.name,
            employeeId: formData.employeeId, // ✅ Required
            phoneNumber: formData.phoneNumber,
            department: formData.department,
            email: formData.email, // Optional
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setActionSuccess(true);
      console.log(data.user);

      // Departmental users go to depDashboard
      setTimeout(() => {
        navigate("/depDashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left side - Brand/Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white rounded-sm mb-6"></div>
            <h1 className="text-5xl font-light mb-4 tracking-wider">WAPDA</h1>
            <p className="text-stone-400 text-lg font-light leading-relaxed max-w-md">
              Department Employee Portal for Trouble Reporting & Management
              System
            </p>
          </div>
          <div className="mt-16">
            <div className="w-24 h-px bg-stone-700 mb-4"></div>
            <p className="text-stone-500 text-sm font-light">Secure Access</p>
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Form header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="lg:hidden w-8 h-8 bg-stone-900 rounded-sm mx-auto mb-6"></div>
            <h2 className="text-2xl sm:text-3xl font-light text-stone-800 mb-2">
              {isLogin ? "Welcome back" : "Join us"}
            </h2>
            <p className="text-stone-500 font-light text-sm sm:text-base">
              {isLogin
                ? "Department Employee Login"
                : "Register as Department Employee"}
            </p>
          </div>

          {/* Error/Success/Pending Messages */}
          {pendingApproval && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded flex items-start space-x-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium text-sm">
                  Application Under Review
                </p>
                <p className="text-amber-700 text-xs sm:text-sm mt-1">
                  Your registration is pending admin approval. Please contact
                  the administrator or check back later.
                </p>
              </div>
            </div>
          )}

          {errorMessage && !pendingApproval && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
              {isLogin
                ? "Success! Redirecting..."
                : "Registration submitted! Please wait for admin approval."}
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMessage("");
                setPendingApproval(false);
                setActionSuccess(false);
              }}
              className={`flex-1 pb-3 text-center transition-all duration-500 border-b-2 ${
                isLogin
                  ? "text-stone-800 border-stone-800"
                  : "text-stone-400 border-transparent hover:text-stone-600"
              }`}
            >
              <span className="font-light text-xs sm:text-sm tracking-wide">
                SIGN IN
              </span>
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMessage("");
                setPendingApproval(false);
                setActionSuccess(false);
              }}
              className={`flex-1 pb-3 text-center transition-all duration-500 border-b-2 ${
                !isLogin
                  ? "text-stone-800 border-stone-800"
                  : "text-stone-400 border-transparent hover:text-stone-600"
              }`}
            >
              <span className="font-light text-xs sm:text-sm tracking-wide">
                REGISTER
              </span>
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Department field */}
            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("department")}
                onBlur={() => setFocusedField("")}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-base sm:text-lg appearance-none cursor-pointer"
                id="department"
              >
                <option value=" EME (P)"> EME (P)</option>
                <option value="EME (SY)">EME (SY)</option>
                <option value="P&IE">P&IE</option>
                <option value=" MME (P)"> MME (P)</option>
                <option value="MME (A)">MME (A)</option>
                <option value="XEN (BARAL)">XEN (BARAL)</option>
                <option value="SOS">SOS</option>
                <option value="OE">OE</option>
                <option value="ITRE">ITRE</option>
              </select>
              <label
                htmlFor="department"
                className="absolute left-0 -top-5 text-xs text-stone-600 pointer-events-none font-light"
              >
                Department
              </label>
              <Building2
                className={`absolute right-0 top-3 sm:top-4 w-5 h-5 transition-colors duration-300 pointer-events-none ${
                  focusedField === "department"
                    ? "text-stone-800"
                    : "text-stone-400"
                }`}
              />
            </div>

            {/* Name field */}
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  className="w-full px-0 py-3 sm:py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-base sm:text-lg"
                  placeholder="Full name"
                  id="name"
                />
                <label
                  htmlFor="name"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                    focusedField === "name" || formData.name
                      ? "-top-5 text-xs text-stone-600"
                      : "top-3 sm:top-4 text-sm sm:text-base text-stone-400"
                  }`}
                >
                  Full name
                </label>
                <User
                  className={`absolute right-0 top-3 sm:top-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "name"
                      ? "text-stone-800"
                      : "text-stone-400"
                  }`}
                />
              </div>
            )}

            {/* Employee ID field */}
            <div className="relative">
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("employeeId")}
                onBlur={() => setFocusedField("")}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-base sm:text-lg"
                placeholder="Employee ID"
                id="employeeId"
              />
              <label
                htmlFor="employeeId"
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                  focusedField === "employeeId" || formData.employeeId
                    ? "-top-5 text-xs text-stone-600"
                    : "top-3 sm:top-4 text-sm sm:text-base text-stone-400"
                }`}
              >
                Employee ID
              </label>
              <Mail
                className={`absolute right-0 top-3 sm:top-4 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "employeeId"
                    ? "text-stone-800"
                    : "text-stone-400"
                }`}
              />
            </div>

            {/* Phone field */}
            {!isLogin && (
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("phoneNumber")}
                  onBlur={() => setFocusedField("")}
                  className="w-full px-0 py-3 sm:py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-base sm:text-lg"
                  placeholder="Phone number"
                  id="phoneNumber"
                />
                <label
                  htmlFor="phoneNumber"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                    focusedField === "phoneNumber" || formData.phoneNumber
                      ? "-top-5 text-xs text-stone-600"
                      : "top-3 sm:top-4 text-sm sm:text-base text-stone-400"
                  }`}
                >
                  Phone Number
                </label>
                <Phone
                  className={`absolute right-0 top-3 sm:top-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "phoneNumber"
                      ? "text-stone-800"
                      : "text-stone-400"
                  }`}
                />
              </div>
            )}

            {/* Password field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-base sm:text-lg pr-12"
                placeholder="Password"
                id="password"
              />
              <label
                htmlFor="password"
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                  focusedField === "password" || formData.password
                    ? "-top-5 text-xs text-stone-600"
                    : "top-3 sm:top-4 text-sm sm:text-base text-stone-400"
                }`}
              >
                Password
              </label>
              <div className="absolute right-0 top-3 sm:top-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <Lock
                  className={`w-5 h-5 transition-colors duration-300 ${
                    focusedField === "password"
                      ? "text-stone-800"
                      : "text-stone-400"
                  }`}
                />
              </div>
            </div>

            {/* Confirm Password field */}
            {!isLogin && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-0 py-3 sm:py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-base sm:text-lg pr-12 ${
                    validationErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm Password"
                  id="confirmPassword"
                />
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                    focusedField === "confirmPassword" ||
                    formData.confirmPassword
                      ? "-top-5 text-xs text-stone-600"
                      : "top-3 sm:top-4 text-sm sm:text-base text-stone-400"
                  }`}
                >
                  Confirm Password
                </label>
                <Lock
                  className={`absolute right-0 top-3 sm:top-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "confirmPassword"
                      ? "text-stone-800"
                      : "text-stone-400"
                  }`}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-light">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full group bg-stone-900 hover:bg-stone-800 text-white py-3 sm:py-4 transition-all duration-300 disabled:opacity-70 mt-8 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center font-light text-xs sm:text-sm tracking-wide">
                {isLoading ? (
                  <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Note for registration */}
            {!isLogin && (
              <div className="mt-6 p-3 bg-stone-100 border border-stone-200 rounded">
                <p className="text-stone-700 text-xs font-light leading-relaxed">
                  <strong>Note:</strong> Your account requires admin approval.
                  You will be able to login once approved.
                </p>
              </div>
            )}

            {/* Terms */}
            <p className="text-center text-stone-400 text-xs font-light mt-8 leading-relaxed">
              By continuing, you acknowledge that you have read and agree to our{" "}
              <button className="text-stone-600 hover:text-stone-800 underline underline-offset-2">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-stone-600 hover:text-stone-800 underline underline-offset-2">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
