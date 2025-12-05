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
} from "lucide-react";
import API_URL from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ModernWhiteAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        ? `${API_URL}/engineer/login`
        : `${API_URL}/engineer/register`;

      const payload = isLogin
        ? {
            email: formData.email, // ✅ Email for engineers
            password: formData.password,
          }
        : {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            department: formData.department,
            email: formData.email,
            password: formData.password,
            role: formData.role || "shift_engineer",
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

      if (data?.user?.role) {
        const role = data.user.role;

        setTimeout(() => {
          switch (role) {
            case "admin":
              navigate("/adminDashboard");
              break;
            case "shift_engineer":
              navigate("/shiftDashboard");
              break;
            case "resident_engineer":
              navigate("/reDashboard");
              break;
            case "oe":
              navigate("/oeDashboard");
              break;
            default:
              console.error("Unknown role:", role);
              navigate("/");
          }
        }, 1500);
      }
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Form header */}
          <div className="text-center mb-12">
            <div className="lg:hidden w-8 h-8 bg-stone-900 rounded-sm mx-auto mb-6"></div>
            <h2 className="text-3xl font-light text-stone-800 mb-2">
              {isLogin ? "Welcome back" : "Join us"}
            </h2>
            <p className="text-stone-500 font-light">
              {isLogin
                ? "Enter your credentials to continue"
                : "Create your exclusive account"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {errorMessage}
            </div>
          )}
          {actionSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
              Success! Redirecting...
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-center transition-all duration-500 border-b-2 ${
                isLogin
                  ? "text-stone-800 border-stone-800"
                  : "text-stone-400 border-transparent hover:text-stone-600"
              }`}
            >
              <span className="font-light text-sm tracking-wide">SIGN IN</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-center transition-all duration-500 border-b-2 ${
                !isLogin
                  ? "text-stone-800 border-stone-800"
                  : "text-stone-400 border-transparent hover:text-stone-600"
              }`}
            >
              <span className="font-light text-sm tracking-wide">REGISTER</span>
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
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
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-lg"
                  placeholder="Full name"
                  id="name"
                />
                <label
                  htmlFor="name"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                    focusedField === "name" || formData.name
                      ? "-top-5 text-xs text-stone-600"
                      : "top-4 text-stone-400"
                  }`}
                >
                  Full name
                </label>
                <User
                  className={`absolute right-0 top-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "name"
                      ? "text-stone-800"
                      : "text-stone-400"
                  }`}
                />
              </div>
            )}

            {/* Email field */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className="w-full px-0 py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-lg"
                placeholder="Email address"
                id="email"
              />
              <label
                htmlFor="email"
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                  focusedField === "email" || formData.email
                    ? "-top-5 text-xs text-stone-600"
                    : "top-4 text-stone-400"
                }`}
              >
                Email address
              </label>
              <Mail
                className={`absolute right-0 top-4 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "email" ? "text-stone-800" : "text-stone-400"
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
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-lg"
                  placeholder="Phone number"
                  id="phoneNumber"
                />
                <label
                  htmlFor="phoneNumber"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                    focusedField === "phoneNumber" || formData.phoneNumber
                      ? "-top-5 text-xs text-stone-600"
                      : "top-4 text-stone-400"
                  }`}
                >
                  Phone Number
                </label>
                <Phone
                  className={`absolute right-0 top-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "phoneNumber"
                      ? "text-stone-800"
                      : "text-stone-400"
                  }`}
                />
              </div>
            )}

         
            {/* Department field */}
            {!isLogin && (
              <div className="relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("department")}
                  onBlur={() => setFocusedField("")}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-lg appearance-none cursor-pointer"
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
                  className={`absolute right-0 top-4 w-5 h-5 transition-colors duration-300 pointer-events-none ${
                    focusedField === "department"
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
                className="w-full px-0 py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-lg pr-12"
                placeholder="Password"
                id="password"
              />
              <label
                htmlFor="password"
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-light ${
                  focusedField === "password" || formData.password
                    ? "-top-5 text-xs text-stone-600"
                    : "top-4 text-stone-400"
                }`}
              >
                Password
              </label>
              <div className="absolute right-0 top-4 flex items-center space-x-3">
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
                  className={`w-full px-0 py-4 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-transparent focus:border-stone-800 focus:outline-none transition-colors duration-300 font-light text-lg pr-12 ${
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
                      : "top-4 text-stone-400"
                  }`}
                >
                  Confirm Password
                </label>
                <Lock
                  className={`absolute right-0 top-4 w-5 h-5 transition-colors duration-300 ${
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

            {/* Forgot password */}
            {isLogin && (
              <div className="text-right pt-2">
                <button className="text-stone-500 hover:text-stone-700 text-sm font-light transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full group bg-stone-900 hover:bg-stone-800 text-white py-4 transition-all duration-300 disabled:opacity-70 mt-8 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center font-light text-sm tracking-wide">
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

            {/* Divider */}
            <div className="relative my-8 py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
            </div>

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
