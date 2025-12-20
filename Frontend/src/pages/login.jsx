import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  Building2,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
  Zap,
} from "lucide-react";
import API_URL from "../../utils/api";
import { useNavigate } from "react-router-dom";

// Floating label input component
const FloatingInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  icon:  Icon,
  error,
  rightElement,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value;

  return (
    <div className="relative group">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete={autoComplete}
        className={`w-full px-4 py-4 pt-6 bg-white border text-stone-800 text-base focus:outline-none transition-all duration-300 font-light rounded-sm peer ${
          error
            ? "border-red-300 focus:border-red-500"
            :  isFocused
            ? "border-stone-800 shadow-sm"
            : "border-stone-200 hover:border-stone-300"
        }`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 pointer-events-none font-light ${
          isActive
            ? "top-2 text-xs text-stone-500"
            : "top-1/2 -translate-y-1/2 text-base text-stone-400"
        } ${error ? "text-red-500" :  ""}`}
      >
        {label}
      </label>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {rightElement}
        {Icon && (
          <Icon
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ? "text-stone-800" : "text-stone-400"
            } ${error ? "text-red-400" : ""}`}
          />
        )}
      </div>
      {error && (
        <p className="absolute -bottom-5 left-0 text-red-500 text-xs font-light flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// Floating label select component
const FloatingSelect = ({
  id,
  name,
  value,
  onChange,
  label,
  icon: Icon,
  options,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-4 pt-6 bg-white border text-stone-800 text-base focus: outline-none transition-all duration-300 font-light rounded-sm appearance-none cursor-pointer ${
          isFocused
            ? "border-stone-800 shadow-sm"
            : "border-stone-200 hover: border-stone-300"
        }`}
      >
        {options.map((option) => (
          <option key={option. value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-xs text-stone-500 pointer-events-none font-light transition-all duration-300"
      >
        {label}
      </label>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        <ChevronDown
          className={`w-4 h-4 transition-all duration-300 ${
            isFocused ? "text-stone-800 rotate-180" :  "text-stone-400"
          }`}
        />
        {Icon && (
          <Icon
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ?  "text-stone-800" : "text-stone-400"
            }`}
          />
        )}
      </div>
    </div>
  );
};

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
    role: "shift_engineer",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [actionSuccess, setActionSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Calculate password strength
  useEffect(() => {
    if (! formData.password) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/. test(formData. password)) strength++;
    setPasswordStrength(strength);
  }, [formData. password]);

  const handleInputChange = (e) => {
    const { name, value } = e. target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
    // Clear specific validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]:  "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData. password) {
      errors.password = "Password is required";
    } else if (! isLogin && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        errors.name = "Name is required";
      }
      if (!formData.phoneNumber) {
        errors. phoneNumber = "Phone number is required";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e. preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = isLogin
        ? `${API_URL}/engineer/login`
        : `${API_URL}/engineer/register`;

      const payload = isLogin
        ? {
            email: formData.email,
            password:  formData.password,
          }
        : {
            name: formData.name,
            phoneNumber: formData. phoneNumber,
            department: formData. department,
            email: formData.email,
            password:  formData.password,
            role: formData.role,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON. stringify(payload),
      });

      const data = await response. json();

      if (! response.ok) throw new Error(data. message || "Something went wrong");

      setActionSuccess(true);

      if (data?. user?.role) {
        const role = data.user. role;
        const roleRoutes = {
          admin: "/adminDashboard",
          shift_engineer: "/shiftDashboard",
          resident_engineer: "/reDashboard",
          oe: "/oeDashboard",
          department: "/departmentDashboard",
        };

        setTimeout(() => {
          navigate(roleRoutes[role] || "/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name:  "",
      email:  "",
      password:  "",
      confirmPassword: "",
      phoneNumber: "",
      department: "EME (P)",
      role: "shift_engineer",
    });
    setValidationErrors({});
    setErrorMessage("");
    setActionSuccess(false);
  };

  const departmentOptions = [
    { value: "EME (P)", label: "EME (P)" },
    { value:  "EME (SY)", label: "EME (SY)" },
    { value: "P&IE", label: "P&IE" },
    { value: "MME (P)", label: "MME (P)" },
    { value: "MME (A)", label: "MME (A)" },
    { value:  "XEN (BARAL)", label: "XEN (BARAL)" },
    { value: "SOS", label: "SOS" },
    { value: "OE", label: "OE" },
    { value: "ITRE", label: "ITRE" },
  ];

  const roleOptions = [
    { value: "shift_engineer", label:  "Shift Engineer" },
    { value: "department", label: "Department User" },
    { value: "oe", label: "OE (Operations Engineer)" },
    { value: "resident_engineer", label:  "Resident Engineer" },
  ];

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-orange-400";
      case 3:
        return "bg-yellow-400";
      case 4:
        return "bg-emerald-400";
      default:
        return "bg-stone-200";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default: 
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Left side - Brand/Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-stone-900" />
              </div>
              <span className="text-white font-light text-xl tracking-wider">
                WAPDA
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-6 tracking-wide leading-tight">
              Trouble Reporting
              <br />
              <span className="text-stone-400">& Management</span>
            </h1>
            <p className="text-stone-400 text-lg font-light leading-relaxed max-w-md">
              Streamlined system for reporting, tracking, and resolving
              operational issues across all departments.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-light text-white mb-1">24/7</p>
              <p className="text-stone-500 text-sm font-light">Support</p>
            </div>
            <div className="w-px h-12 bg-stone-700" />
            <div>
              <p className="text-3xl font-light text-white mb-1">100%</p>
              <p className="text-stone-500 text-sm font-light">Secure</p>
            </div>
            <div className="w-px h-12 bg-stone-700" />
            <div>
              <p className="text-3xl font-light text-white mb-1">Real-time</p>
              <p className="text-stone-500 text-sm font-light">Updates</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-stone-800/50 to-transparent rounded-tl-full" />
        <div className="absolute top-20 right-20 w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute top-40 right-40 w-1 h-1 bg-white/10 rounded-full" />
        <div className="absolute bottom-40 right-32 w-1.5 h-1.5 bg-white/15 rounded-full" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-stone-900 rounded-sm flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-stone-900 font-light text-lg tracking-wider">
              WAPDA
            </span>
          </div>

          {/* Form header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-light text-stone-800 mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-stone-500 font-light text-sm">
              {isLogin
                ? "Enter your credentials to access the portal"
                : "Fill in your details to get started"}
            </p>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-0. 5">Error</p>
                <p className="font-light">{errorMessage}</p>
              </div>
            </div>
          )}

          {actionSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-sm flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-0.5">Success! </p>
                <p className="font-light">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex mb-8 bg-stone-200/50 p-1 rounded-sm">
            <button
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
              className={`flex-1 py-2. 5 text-center transition-all duration-300 text-sm font-light tracking-wide rounded-sm ${
                isLogin
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
              className={`flex-1 py-2.5 text-center transition-all duration-300 text-sm font-light tracking-wide rounded-sm ${
                ! isLogin
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            {! isLogin && (
              <FloatingInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                label="Full Name"
                icon={User}
                error={validationErrors.name}
                autoComplete="name"
              />
            )}

            {/* Email field */}
            <FloatingInput
              id="email"
              name="email"
              type="email"
              value={formData. email}
              onChange={handleInputChange}
              label="Email Address"
              icon={Mail}
              error={validationErrors. email}
              autoComplete="email"
            />

            {/* Phone field */}
            {!isLogin && (
              <FloatingInput
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData. phoneNumber}
                onChange={handleInputChange}
                label="Phone Number"
                icon={Phone}
                error={validationErrors.phoneNumber}
                autoComplete="tel"
              />
            )}

            {/* Department & Role - Two columns on register */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingSelect
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  label="Department"
                  icon={Building2}
                  options={departmentOptions}
                />
                <FloatingSelect
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                  icon={Shield}
                  options={roleOptions}
                />
              </div>
            )}

            {/* Password field */}
            <div className="space-y-2">
              <FloatingInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                label="Password"
                icon={Lock}
                error={validationErrors.password}
                autoComplete={isLogin ? "current-password" : "new-password"}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-600 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
              {/* Password strength indicator */}
              {! isLogin && formData.password && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4]. map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength >= level
                            ?  getPasswordStrengthColor()
                            : "bg-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-light ${
                      passwordStrength >= 3
                        ? "text-emerald-600"
                        : passwordStrength >= 2
                        ? "text-yellow-600"
                        :  "text-red-500"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            {!isLogin && (
              <FloatingInput
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" :  "password"}
                value={formData. confirmPassword}
                onChange={handleInputChange}
                label="Confirm Password"
                icon={Lock}
                error={validationErrors.confirmPassword}
                autoComplete="new-password"
              />
            )}

            {/* Forgot password */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-stone-500 hover:text-stone-700 text-sm font-light transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || actionSuccess}
              className="w-full group bg-stone-900 hover:bg-stone-800 text-white py-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-sm relative overflow-hidden mt-6"
            >
              <span className="relative z-10 flex items-center justify-center font-light text-sm tracking-wide">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : actionSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    SUCCESS
                  </>
                ) : (
                  <>
                    {isLogin ? "SIGN IN" :  "CREATE ACCOUNT"}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-stone-100 text-stone-400 font-light">
                SECURE PORTAL
              </span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-stone-400 text-xs font-light leading-relaxed">
            By continuing, you acknowledge that you have read and agree to our{" "}
            <button
              type="button"
              className="text-stone-600 hover:text-stone-800 underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-stone-600 hover:text-stone-800 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}