import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  User,
  ChevronRight,
  ChevronDown,
  Eye,
  RefreshCw,
  Search,
  X,
  MessageSquare,
  Calendar,
  Users,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Save,
  Shield,
  UserPlus,
  Lock,
  Unlock,
  Database,
  Loader2,
  Building2,
  Zap,
  Check,
  Send,
} from "lucide-react";
import API_URL from "../../utils/api";
import { useNavigate } from "react-router-dom";

// ============================================
// Reusable Components
// ============================================

const FloatingInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  rows,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value;
  const isTextarea = rows !== undefined;

  const baseClasses = `w-full px-4 py-4 pt-6 bg-white border text-stone-800 text-sm focus:outline-none transition-all duration-300 font-light rounded-sm ${
    disabled
      ? "bg-stone-50 cursor-not-allowed opacity-60"
      : isFocused
      ? "border-stone-800 shadow-sm"
      : "border-stone-200 hover:border-stone-300"
  }`;

  return (
    <div className="relative">
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          disabled={disabled}
          className={`${baseClasses} resize-none`}
          placeholder=" "
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={baseClasses}
          placeholder=" "
        />
      )}
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 pointer-events-none font-light ${
          isActive
            ? "top-2 text-xs text-stone-500"
            : "top-1/2 -translate-y-1/2 text-sm text-stone-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const FloatingSelect = ({ id, name, value, onChange, label, options, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`w-full px-4 py-4 pt-6 bg-white border text-stone-800 text-sm focus:outline-none transition-all duration-300 font-light rounded-sm appearance-none cursor-pointer ${
          disabled
            ? "bg-stone-50 cursor-not-allowed opacity-60"
            : isFocused
            ?  "border-stone-800 shadow-sm"
            : "border-stone-200 hover:border-stone-300"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label className="absolute left-4 top-2 text-xs text-stone-500 pointer-events-none font-light">
        {label}
      </label>
      <ChevronDown
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-all duration-300 ${
          isFocused ? "text-stone-800 rotate-180" :  "text-stone-400"
        }`}
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    Closed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
    Pending:  { bg: "bg-amber-50", text:  "text-amber-700", dot: "bg-amber-400" },
    "Needs Revision": { bg: "bg-orange-50", text:  "text-orange-700", dot: "bg-orange-400" },
    "Under Review": { bg: "bg-blue-50", text:  "text-blue-700", dot: "bg-blue-400" },
  };

  const style = config[status] || { bg: "bg-stone-50", text: "text-stone-700", dot: "bg-stone-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2. 5 py-1 text-xs font-medium rounded-sm ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style. dot}`} />
      {status?. toUpperCase() || "OPEN"}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`p-5 transition-all duration-300 rounded-sm text-left ${
      isActive
        ?  "bg-stone-900 text-white shadow-lg"
        : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-sm flex items-center justify-center ${
          isActive ? "bg-white/10" : "bg-stone-100"
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "text-white" :  "text-stone-600"}`} />
      </div>
      {isActive && <Check className="w-5 h-5 text-white/60" />}
    </div>
    <p className={`text-xs font-medium tracking-wider mb-1 ${isActive ? "text-stone-300" : "text-stone-500"}`}>
      {label}
    </p>
    <p className="text-3xl font-light">{count}</p>
  </button>
);

// ============================================
// Remarks Component
// ============================================
const RemarksSection = ({ remarks = [], reportId, onAddRemark }) => {
  const [newRemark, setNewRemark] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddRemark = async () => {
    if (! newRemark.trim()) return;
    setIsAdding(true);
    await onAddRemark(reportId, newRemark);
    setNewRemark("");
    setIsAdding(false);
  };

  const getRemarkStyle = (text) => {
    if (text?.includes("rejected") || text?.includes("Rejected")) {
      return {
        border: "border-red-300",
        bg: "bg-red-50/50",
        icon: "text-red-500",
      };
    }
    if (text?.includes("approved") || text?.includes("Approved") || text?.includes("Closed")) {
      return {
        border:  "border-emerald-300",
        bg: "bg-emerald-50/50",
        icon: "text-emerald-500",
      };
    }
    if (text?.includes("Department action") || text?.includes("OE")) {
      return {
        border:  "border-blue-300",
        bg: "bg-blue-50/50",
        icon: "text-blue-500",
      };
    }
    return {
      border: "border-stone-200",
      bg:  "bg-white",
      icon: "text-stone-400",
    };
  };

  return (
    <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
      <div className="p-4 border-b border-stone-200 bg-stone-50">
        <h4 className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Remarks & History
          <span className="ml-auto text-xs font-normal text-stone-500">
            {remarks.length} {remarks.length === 1 ? "entry" : "entries"}
          </span>
        </h4>
      </div>

      {/* Remarks List */}
      <div className="max-h-80 overflow-y-auto">
        {remarks.length === 0 ?  (
          <div className="p-8 text-center">
            <MessageSquare className="w-10 h-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-400 font-light text-sm">No remarks yet</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {remarks.map((remark, idx) => {
              const style = getRemarkStyle(remark. text);
              return (
                <div
                  key={idx}
                  className={`p-4 ${style.bg} border-l-2 ${style.border} transition-colors hover:bg-stone-50/50`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0`}>
                      <User className={`w-4 h-4 ${style.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-stone-800">
                          {remark.user || "Unknown User"}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-400 font-light">
                          {remark.timestamp
                            ? new Date(remark.timestamp).toLocaleString()
                            :  "Unknown time"}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 font-light break-words whitespace-pre-wrap">
                        {remark.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Remark Input */}
      <div className="p-4 border-t border-stone-200 bg-stone-50">
        <div className="flex gap-3">
          <input
            type="text"
            value={newRemark}
            onChange={(e) => setNewRemark(e.target. value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
            placeholder="Add an admin remark..."
            className="flex-1 px-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
          />
          <button
            onClick={handleAddRemark}
            disabled={isAdding || !newRemark. trim()}
            className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Multi-Select Departments Component
// ============================================
const MultiSelectDepartments = ({ selected = [], onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const departments = [
    "EME (P)",
    "EME (SY)",
    "P&IE",
    "MME (P)",
    "MME (A)",
    "XEN (BARAL)",
    "SOS",
    "ITRE",
    "OE",
    "XEN (EW)",
  ];

  const toggleDepartment = (dept) => {
    if (selected.includes(dept)) {
      onChange(selected.filter((d) => d !== dept));
    } else {
      onChange([...selected, dept]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-xs text-stone-500 mb-2 font-light">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-white border border-stone-200 text-stone-800 text-sm font-light cursor-pointer hover:border-stone-300 transition-all duration-200 rounded-sm min-h-[48px]"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1. 5 flex-1">
            {selected.length === 0 ?  (
              <span className="text-stone-400">Select departments... </span>
            ) : (
              selected.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-700 text-xs rounded-sm"
                >
                  {dept}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDepartment(dept);
                    }}
                    className="hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-stone-200 shadow-lg max-h-60 overflow-y-auto rounded-sm">
            {departments.map((dept) => (
              <div
                key={dept}
                onClick={() => toggleDepartment(dept)}
                className={`flex items-center gap-3 px-4 py-2. 5 cursor-pointer transition-all duration-150 ${
                  selected.includes(dept)
                    ?  "bg-stone-100 text-stone-900"
                    : "hover:bg-stone-50 text-stone-700"
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-150 ${
                    selected.includes(dept)
                      ?  "bg-stone-800 border-stone-800"
                      :  "border-stone-300"
                  }`}
                >
                  {selected.includes(dept) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-light text-sm">{dept}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// Report Edit Modal
// ============================================
const ReportEditModal = ({ report, onClose, onSave, onAddRemark }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    serialNo: report?. serialNo || "",
    date: report?.date ?  new Date(report. date).toISOString().split("T")[0] : "",
    time: report?.time || "",
    notifiedBy: report?.notifiedBy || "",
    means: report?.means || "Telephone",
    referTo: Array.isArray(report?.referTo) ? report. referTo : [report?.referTo || "EME (P)"],
    apparatus: report?.apparatus || "",
    description: report?.description || "",
    recommendation: report?.recommendation || "",
    operationAction: report?.operationAction || "",
    departmentAction: report?. departmentAction || "",
    status: report?.status || "Pending",
    currentStage: report?. currentStage || "Department",
    priority: report?.priority || "Medium",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(report._id, formData);
    setSaving(false);
  };

  const meansOptions = [
    { value: "Telephone", label: "Telephone" },
    { value: "Email", label: "Email" },
    { value: "Radio", label: "Radio" },
    { value: "In Person", label: "In Person" },
  ];

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Under Review", label: "Under Review" },
    { value: "Needs Revision", label:  "Needs Revision" },
    { value: "Closed", label: "Closed" },
    { value: "Rejected", label: "Rejected" },
  ];

  const stageOptions = [
    { value: "Department", label: "Department" },
    { value: "OE Department", label: "OE Department" },
    { value: "Resident Engineer", label: "Resident Engineer" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ];

  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-light tracking-wide flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Report
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-stone-400 font-light text-sm">{report. serialNo}</p>
              <StatusBadge status={report.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 px-6 py-3 text-sm font-light tracking-wide transition-all ${
              activeTab === "details"
                ? "text-stone-900 border-b-2 border-stone-900"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Details
            </span>
          </button>
          <button
            onClick={() => setActiveTab("remarks")}
            className={`flex-1 px-6 py-3 text-sm font-light tracking-wide transition-all ${
              activeTab === "remarks"
                ? "text-stone-900 border-b-2 border-stone-900"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Remarks
              {report.remarks?. length > 0 && (
                <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-xs rounded-full">
                  {report.remarks.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5">
          {activeTab === "details" ? (
            <div className="space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FloatingInput
                  id="serialNo"
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                  label="Serial No"
                />
                <FloatingInput
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  label="Date"
                />
                <FloatingInput
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  label="Time"
                />
                <FloatingInput
                  id="notifiedBy"
                  name="notifiedBy"
                  value={formData.notifiedBy}
                  onChange={handleChange}
                  label="Notified By"
                />
              </div>

              {/* Dropdowns Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FloatingSelect
                  id="means"
                  name="means"
                  value={formData.means}
                  onChange={handleChange}
                  label="Means"
                  options={meansOptions}
                />
                <FloatingSelect
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  options={statusOptions}
                />
                <FloatingSelect
                  id="currentStage"
                  name="currentStage"
                  value={formData.currentStage}
                  onChange={handleChange}
                  label="Current Stage"
                  options={stageOptions}
                />
                <FloatingSelect
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                  options={priorityOptions}
                />
              </div>

              {/* Multi-select Departments */}
              <MultiSelectDepartments
                selected={formData.referTo}
                onChange={(selected) => setFormData((prev) => ({ ...prev, referTo:  selected }))}
                label="Refer To Departments"
              />

              {/* Text Fields */}
              <FloatingInput
                id="apparatus"
                name="apparatus"
                value={formData.apparatus}
                onChange={handleChange}
                label="Apparatus Affected"
              />

              <FloatingInput
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                label="Description"
                rows={3}
              />

              <FloatingInput
                id="recommendation"
                name="recommendation"
                value={formData.recommendation}
                onChange={handleChange}
                label="Recommendation"
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  id="operationAction"
                  name="operationAction"
                  value={formData. operationAction}
                  onChange={handleChange}
                  label="Operation Action"
                  rows={3}
                />
                <FloatingInput
                  id="departmentAction"
                  name="departmentAction"
                  value={formData.departmentAction}
                  onChange={handleChange}
                  label="Department Action"
                  rows={3}
                />
              </div>

              {/* Created Info */}
              {report.createdBy && (
                <div className="bg-stone-100 p-4 rounded-sm">
                  <p className="text-xs text-stone-500 font-light">
                    Created by:{" "}
                    <span className="text-stone-700">
                      {report.createdBy?. name || report.createdBy?. email || "Unknown"}
                    </span>
                    {report.createdAt && (
                      <>
                        {" "}
                        on{" "}
                        <span className="text-stone-700">
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <RemarksSection
              remarks={report.remarks || []}
              reportId={report._id}
              onAddRemark={onAddRemark}
            />
          )}
        </div>

        {/* Footer */}
        {activeTab === "details" && (
          <div className="p-5 border-t border-stone-200 bg-white flex-shrink-0 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  SAVE CHANGES
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border border-stone-300 hover:border-stone-400 text-stone-700 font-light text-sm tracking-wide transition-all duration-200 rounded-sm"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// Report View Modal (Read-only with all details)
// ============================================
const ReportViewModal = ({ report, onClose }) => {
  const departments = Array.isArray(report?. referTo) ? report.referTo : [report?.referTo];

  const getRemarkStyle = (text) => {
    if (text?. includes("rejected") || text?.includes("Rejected")) {
      return { border: "border-red-300", bg: "bg-red-50/50", icon: "text-red-500" };
    }
    if (text?.includes("approved") || text?.includes("Approved") || text?.includes("Closed")) {
      return { border:  "border-emerald-300", bg: "bg-emerald-50/50", icon: "text-emerald-500" };
    }
    if (text?.includes("Department action") || text?.includes("OE")) {
      return { border: "border-blue-300", bg: "bg-blue-50/50", icon: "text-blue-500" };
    }
    return { border: "border-stone-200", bg: "bg-white", icon: "text-stone-400" };
  };

  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-light tracking-wide flex items-center gap-2">
              <Eye className="w-5 h-5" />
              View Report
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-stone-400 font-light text-sm">{report.serialNo}</p>
              <StatusBadge status={report.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-1">Date</p>
              <p className="text-sm text-stone-800 font-light">{report.date}</p>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-1">Time</p>
              <p className="text-sm text-stone-800 font-light">{report.time}</p>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-1">Current Stage</p>
              <p className="text-sm text-stone-800 font-light">{report.currentStage}</p>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-1">Priority</p>
              <p className="text-sm text-stone-800 font-light">{report.priority || "Medium"}</p>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white border border-stone-200 p-4 rounded-sm">
            <p className="text-xs text-stone-500 font-light mb-2">Referred Departments</p>
            <div className="flex flex-wrap gap-2">
              {departments. map((dept, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-light rounded-sm"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Apparatus & Description */}
          <div className="bg-white border border-stone-200 p-4 rounded-sm">
            <p className="text-xs text-stone-500 font-light mb-2">Apparatus Affected</p>
            <p className="text-sm text-stone-800 font-light">{report.apparatus}</p>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-sm">
            <p className="text-xs text-stone-500 font-light mb-2">Description</p>
            <p className="text-sm text-stone-800 font-light whitespace-pre-wrap">{report.description}</p>
          </div>

          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-2">Recommendation</p>
              <p className="text-sm text-stone-800 font-light whitespace-pre-wrap">{report.recommendation}</p>
            </div>
          )}

          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-2">Operation Action</p>
              <p className="text-sm text-stone-800 font-light whitespace-pre-wrap">{report. operationAction}</p>
            </div>
          )}

          {report.departmentAction && (
            <div className="bg-white border border-stone-200 p-4 rounded-sm">
              <p className="text-xs text-stone-500 font-light mb-2">Department Action</p>
              <p className="text-sm text-stone-800 font-light whitespace-pre-wrap">{report.departmentAction}</p>
            </div>
          )}

          {/* All Remarks */}
          <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50">
              <h4 className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                All Remarks ({report.remarks?.length || 0})
              </h4>
            </div>
            {report.remarks && report.remarks.length > 0 ?  (
              <div className="divide-y divide-stone-100">
                {report.remarks.map((remark, idx) => {
                  const style = getRemarkStyle(remark. text);
                  return (
                    <div
                      key={idx}
                      className={`p-4 ${style.bg} border-l-2 ${style.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                          <User className={`w-4 h-4 ${style.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-stone-800">
                              {remark.user || "Unknown User"}
                            </span>
                            <span className="text-xs text-stone-400">•</span>
                            <span className="text-xs text-stone-400 font-light">
                              {remark.timestamp
                                ? new Date(remark.timestamp).toLocaleString()
                                :  "Unknown time"}
                            </span>
                          </div>
                          <p className="text-sm text-stone-600 font-light break-words whitespace-pre-wrap">
                            {remark.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                <p className="text-stone-400 font-light text-sm">No remarks on this report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// User Management Modal
// ============================================
const UserManagementModal = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    department: "EME (P)",
    designation: "",
    role: "shift_engineer",
  });
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        credentials: "include",
      });
      if (! response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Error fetching users:  " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (! newUser.username || !newUser.password) {
      alert("Username and password are required");
      return;
    }
    try {
      setAdding(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: { "Content-Type":  "application/json" },
        credentials: "include",
        body: JSON. stringify(newUser),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add user");
      }
      await fetchUsers();
      setNewUser({
        username: "",
        password: "",
        name: "",
        email: "",
        department: "EME (P)",
        designation: "",
        role: "shift_engineer",
      });
      setShowAddForm(false);
      alert("User created successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (! confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response. ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type":  "application/json" },
        credentials:  "include",
        body: JSON.stringify({ active: ! isActive }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update user status");
      }
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = useMemo(() => {
    if (! searchTerm) return users;
    const term = searchTerm. toLowerCase();
    return users.filter(
      (u) =>
        u.name?. toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.department?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const departmentOptions = [
    { value: "EME (P)", label: "EME (P)" },
    { value: "EME (SY)", label: "EME (SY)" },
    { value: "P&IE", label: "P&IE" },
    { value: "MME (P)", label: "MME (P)" },
    { value: "MME (A)", label: "MME (A)" },
    { value:  "XEN (BARAL)", label: "XEN (BARAL)" },
    { value: "SOS", label: "SOS" },
    { value: "ITRE", label: "ITRE" },
  ];

  const roleOptions = [
    { value: "shift_engineer", label:  "Shift Engineer" },
    { value: "department", label: "Department" },
    { value: "oe", label: "OE Department" },
    { value: "resident_engineer", label: "Resident Engineer" },
    { value:  "admin", label: "Admin" },
  ];

  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-light tracking-wide flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </h3>
            <p className="text-stone-400 font-light text-sm mt-1">
              {users.length} users registered
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
              />
            </div>
            <button
              onClick={() => setShowAddForm(! showAddForm)}
              className={`px-5 py-3 font-light text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 rounded-sm ${
                showAddForm
                  ? "bg-stone-200 text-stone-700"
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4" />
                  CANCEL
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  ADD USER
                </>
              )}
            </button>
          </div>

          {/* Add User Form */}
          {showAddForm && (
            <div className="bg-white border border-stone-200 p-5 rounded-sm space-y-4">
              <h4 className="text-sm font-medium text-stone-800 tracking-wide flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                New User Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FloatingInput
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  label="Username *"
                />
                <FloatingInput
                  id="password"
                  name="password"
                  type="password"
                  value={newUser. password}
                  onChange={(e) => setNewUser({ ... newUser, password:  e.target.value })}
                  label="Password *"
                />
                <FloatingInput
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target. value })}
                  label="Full Name"
                />
                <FloatingInput
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target. value })}
                  label="Email"
                />
                <FloatingSelect
                  id="department"
                  name="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  label="Department"
                  options={departmentOptions}
                />
                <FloatingSelect
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target. value })}
                  label="Role"
                  options={roleOptions}
                />
              </div>
              <button
                onClick={handleAddUser}
                disabled={adding}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 flex items-center gap-2 rounded-sm"
              >
                {adding ?  (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                CREATE USER
              </button>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-light">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase">
                        User
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase">
                        Department
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase">
                        Role
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase">
                        Status
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-medium text-stone-500 tracking-wider uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-stone-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-stone-800">{user.name || "—"}</p>
                              <p className="text-xs text-stone-500 font-light">{user.email || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-stone-600 font-light">
                            <Building2 className="w-3. 5 h-3.5" />
                            {user. department || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-sm">
                            {user.role?. replace("_", " ").toUpperCase() || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm ${
                              user.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.status === "active" ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                            {user. status === "active" ? "ACTIVE" : "DISABLED"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleToggleStatus(user._id, user.status === "active")}
                              className="p-2 hover:bg-stone-100 rounded-sm transition-colors"
                              title={user.status === "active" ? "Disable" : "Enable"}
                            >
                              {user.status === "active" ? (
                                <Lock className="w-4 h-4 text-stone-500" />
                              ) : (
                                <Unlock className="w-4 h-4 text-emerald-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 hover:bg-red-50 rounded-sm transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Admin Dashboard
// ============================================
export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const navigate = useNavigate();

  const stats = useMemo(
    () => ({
      total: reports.length,
      pending: reports.filter(
        (r) => r.status === "Pending" || r.status === "Under Review" || r.status === "Needs Revision"
      ).length,
      closed: reports.filter((r) => r.status === "Closed").length,
      rejected: reports.filter((r) => r.status === "Rejected").length,
    }),
    [reports]
  );

  const fetchReports = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await fetch(`${API_URL}/admin/reports`, {
        credentials: "include",
      });
      if (!response. ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { credentials: "include" });
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSaveReport = async (reportId, formData) => {
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response. ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update report");
      }
      await fetchReports();
      setSelectedReport(null);
      alert("Report updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

const handleAddRemark = async (reportId, text) => {
  try {
    const response = await fetch(`${API_URL}/reports/${reportId}/remarks`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body:  JSON.stringify({ text }),
    });
    
    if (!response. ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add remark");
    }
    
    const data = await response.json();
    
    // Update the report in state
    setReports((prev) =>
      prev. map((r) => (r._id === reportId ? data. report : r))
    );
    
    // Update selected report if open
    if (selectedReport && selectedReport._id === reportId) {
      setSelectedReport(data.report);
    }
    
    // Also update viewing report if open
    if (viewingReport && viewingReport._id === reportId) {
      setViewingReport(data.report);
    }
    
  } catch (err) {
    console.error("Error adding remark:", err);
    alert(err.message);
  }
};

  const handleDeleteReport = async (reportId) => {
    if (! confirm("Are you sure you want to delete this report?  This action cannot be undone."))
      return;
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete report");
      }
      await fetchReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayReports = useMemo(() => {
    let filtered = reports;

    if (filter === "pending") {
      filtered = reports.filter(
        (r) => r.status === "Pending" || r.status === "Under Review" || r.status === "Needs Revision"
      );
    } else if (filter === "closed") {
      filtered = reports. filter((r) => r.status === "Closed");
    } else if (filter === "rejected") {
      filtered = reports.filter((r) => r.status === "Rejected");
    }

    if (searchTerm) {
      const term = searchTerm. toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r. serialNo?. toLowerCase().includes(term) ||
          r.apparatus?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          (Array.isArray(r.referTo) ? r.referTo. join(" ") : r.referTo)?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [filter, searchTerm, reports]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-stone-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-light tracking-wider">Admin Dashboard</h1>
                <p className="text-stone-400 font-light text-sm mt-0.5">
                  System management & oversight
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUserManagement(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 transition-all duration-200 border border-stone-700 text-sm font-light tracking-wide rounded-sm"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">USERS</span>
              </button>
              <button
                onClick={() => fetchReports(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 transition-all duration-200 border border-stone-700 text-sm font-light tracking-wide rounded-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">REFRESH</span>
              </button>
              <button
                                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-transparent hover:bg-stone-800 transition-all duration-200 border border-stone-700 text-sm font-light tracking-wide rounded-sm text-stone-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm: inline">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error ?  (
          <div className="bg-red-50 border border-red-200 p-8 text-center rounded-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-700 font-light mb-4">{error}</p>
            <button
              onClick={() => fetchReports()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-light text-sm tracking-wide transition-colors rounded-sm"
            >
              TRY AGAIN
            </button>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={Database}
                label="ALL REPORTS"
                count={stats.total}
                isActive={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <StatCard
                icon={AlertCircle}
                label="PENDING"
                count={stats.pending}
                isActive={filter === "pending"}
                onClick={() => setFilter("pending")}
              />
              <StatCard
                icon={CheckCircle}
                label="CLOSED"
                count={stats.closed}
                isActive={filter === "closed"}
                onClick={() => setFilter("closed")}
              />
              <StatCard
                icon={XCircle}
                label="REJECTED"
                count={stats.rejected}
                isActive={filter === "rejected"}
                onClick={() => setFilter("rejected")}
              />
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e. target.value)}
                  placeholder="Search by serial no, apparatus, description, or department..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover: text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Reports Count */}
            <div className="mb-4">
              <p className="text-sm text-stone-500 font-light">
                Showing <span className="font-medium text-stone-700">{displayReports. length}</span> of{" "}
                <span className="font-medium text-stone-700">{reports.length}</span> reports
              </p>
            </div>

            {/* Reports Table */}
            {displayReports.length === 0 ? (
              <div className="bg-white border border-stone-200 p-12 text-center rounded-sm">
                <Database className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-light mb-2">No reports found</p>
                <p className="text-stone-400 text-sm font-light">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase">
                          Report
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase hidden md:table-cell">
                          Department
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase">
                          Status
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase hidden lg:table-cell">
                          Stage
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase hidden sm:table-cell">
                          Remarks
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-medium text-stone-500 tracking-wider uppercase hidden sm:table-cell">
                          Date
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-medium text-stone-500 tracking-wider uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {displayReports.map((report) => {
                        const departments = Array.isArray(report.referTo)
                          ? report.referTo
                          : [report. referTo];

                        return (
                          <tr key={report._id} className="hover:bg-stone-50 transition-colors">
                            <td className="px-5 py-4">
                              <div>
                                <p className="text-sm font-medium text-stone-800">{report.serialNo}</p>
                                <p className="text-xs text-stone-500 font-light truncate max-w-[200px]">
                                  {report.apparatus}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {departments.slice(0, 2).map((dept, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-light rounded-sm"
                                  >
                                    <Building2 className="w-3 h-3" />
                                    {dept}
                                  </span>
                                ))}
                                {departments.length > 2 && (
                                  <span className="text-xs text-stone-400">+{departments.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={report.status} />
                            </td>
                            <td className="px-5 py-4 hidden lg:table-cell">
                              <span className="text-sm text-stone-600 font-light">
                                {report.currentStage}
                              </span>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell">
                              <button
                                onClick={() => setViewingReport(report)}
                                className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 font-light transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span>{report.remarks?. length || 0}</span>
                              </button>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell">
                              <span className="text-sm text-stone-500 font-light">
                                {new Date(report.date).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => setViewingReport(report)}
                                  className="p-2 hover:bg-stone-100 rounded-sm transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4 text-stone-500" />
                                </button>
                                <button
                                  onClick={() => setSelectedReport(report)}
                                  className="p-2 hover: bg-blue-50 rounded-sm transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReport(report._id)}
                                  className="p-2 hover:bg-red-50 rounded-sm transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {selectedReport && (
        <ReportEditModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSave={handleSaveReport}
          onAddRemark={handleAddRemark}
        />
      )}
      
      {viewingReport && (
        <ReportViewModal
          report={viewingReport}
          onClose={() => setViewingReport(null)}
        />
      )}
      
      {showUserManagement && (
        <UserManagementModal onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
}