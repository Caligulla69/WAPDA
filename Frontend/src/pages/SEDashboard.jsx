import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  X,
  Clock,
  FileText,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  LogOut,
  Check,
  Building2,
  ChevronDown,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

// Available departments list
const DEPARTMENTS = [
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

// Generate next serial number based on existing reports
const generateNextSerialNo = (reports) => {
  const currentYear = new Date().getFullYear();
  const prefix = `TR-${currentYear}-`;
  
  // Filter reports from current year and extract numbers
  const currentYearNumbers = reports
    .filter((report) => report.serialNo && report.serialNo.startsWith(prefix))
    .map((report) => {
      const numPart = report.serialNo.replace(prefix, "");
      return parseInt(numPart, 10);
    })
    .filter((num) => !isNaN(num));

  // Find the highest number and increment
  const maxNumber = currentYearNumbers.length > 0 ?  Math.max(...currentYearNumbers) : 0;
  const nextNumber = maxNumber + 1;
  
  // Pad with zeros (e.g., 001, 012, 123)
  const paddedNumber = String(nextNumber).padStart(3, "0");
  
  return `${prefix}${paddedNumber}`;
};

// Multi-select dropdown component
const MultiSelectDropdown = ({ selected, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-stone-200 bg-stone-50 text-stone-800 text-sm font-light cursor-pointer hover:border-stone-300 transition-all duration-200 rounded-sm min-h-[48px]"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selected.length === 0 ?  (
              <span className="text-stone-400">Select departments...</span>
            ) : (
              selected.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-200 text-stone-700 text-xs rounded-sm"
                >
                  {dept}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(dept);
                    }}
                    className="hover:text-stone-900 transition-colors ml-0.5"
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
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-stone-200 shadow-lg max-h-60 overflow-y-auto rounded-sm">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => toggleOption(option)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-150 ${
                  selected.includes(option)
                    ?  "bg-stone-100 text-stone-900"
                    : "hover:bg-stone-50 text-stone-700"
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-150 ${
                    selected.includes(option)
                      ?  "bg-stone-800 border-stone-800"
                      :  "border-stone-300"
                  }`}
                >
                  {selected.includes(option) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="font-light text-sm">{option}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ReportCard = ({ report, onClick }) => {
  const statusConfig = {
    Pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dotColor: "bg-amber-400",
    },
    "Under Review": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      dotColor:  "bg-blue-400",
    },
    "Needs Revision":  {
      color:  "bg-orange-50 text-orange-700 border-orange-200",
      dotColor:  "bg-orange-400",
    },
    Closed:  {
      color:  "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-400",
    },
    Rejected: {
      color: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-400",
    },
  };

  const config = statusConfig[report.status] || statusConfig.Pending;
  const departments = Array.isArray(report.referTo)
    ? report.referTo
    :  [report.referTo];

  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-300 cursor-pointer group rounded-sm overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-medium text-stone-800 text-base sm:text-lg tracking-wide">
                {report.serialNo}
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-medium border ${config.color} flex items-center gap-1.5 whitespace-nowrap rounded-sm`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                {report.status.toUpperCase()}
              </span>
            </div>
            <p className="text-stone-500 text-sm font-light truncate">
              {report.apparatus}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-3" />
        </div>

        <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2 text-sm sm:text-base">
          {report.description}
        </p>

        {/* Departments Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {departments.map((dept, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-light rounded-sm"
            >
              <Building2 className="w-3 h-3" />
              {dept}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-500 font-light border-t border-stone-100 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
            <span className="whitespace-nowrap">{report.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
            <span className="whitespace-nowrap">{report.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
            <span className="truncate">{report.notifiedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetail = ({ report, onClose, onAddRemark, onUpdateStatus }) => {
  const [remarkText, setRemarkText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRemark = async () => {
    if (! remarkText.trim()) return;
    setIsSubmitting(true);
    await onAddRemark(report._id, remarkText);
    setRemarkText("");
    setIsSubmitting(false);
  };

  const departments = Array.isArray(report.referTo)
    ? report.referTo
    : [report.referTo];

  return (
    <div 
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex justify-between items-center">
          <h3 className="text-lg sm:text-2xl font-light tracking-wide truncate pr-3">
            {report.serialNo}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-sm"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* Status */}
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Status
            </label>
            <select
              value={report.status}
              onChange={(e) => onUpdateStatus(report._id, e.target.value)}
              className="w-full p-3 border border-stone-200 bg-stone-50 text-stone-800 text-sm font-light focus:border-stone-400 focus: outline-none transition-colors rounded-sm"
              disabled
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Date", value: report.date },
              { label: "Time", value: report.time },
              { label: "Notified By", value:  report.notifiedBy },
              { label: "Current Stage", value: report.currentStage },
              { label: "Priority", value: report.priority || "Medium" },
              { label: "Means", value: report.means },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 p-4 rounded-sm"
              >
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  {item.label}
                </label>
                <p className="text-stone-800 font-light text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Departments */}
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Referred Departments
            </label>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-light rounded-sm border border-stone-200"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Apparatus */}
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Apparatus Affected
            </label>
            <p className="text-stone-800 font-light text-sm break-words">
              {report.apparatus}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Description
            </label>
            <p className="text-stone-800 font-light leading-relaxed text-sm break-words">
              {report.description}
            </p>
          </div>

          {/* Recommendation */}
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-5 rounded-sm">
              <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
                Recommendation
              </label>
              <p className="text-stone-800 font-light leading-relaxed text-sm break-words">
                {report.recommendation}
              </p>
            </div>
          )}

          {/* Operation Action */}
          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-5 rounded-sm">
              <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
                Action Taken
              </label>
              <p className="text-stone-800 font-light leading-relaxed text-sm break-words">
                {report.operationAction}
              </p>
            </div>
          )}

          {/* Remarks */}
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <label className="block text-xs font-medium text-stone-500 mb-4 tracking-wider uppercase">
              Remarks
            </label>
            <div className="space-y-4 mb-5">
              {report.remarks && report.remarks.length > 0 ?  (
                report.remarks.map((remark, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-stone-300 pl-4 py-1"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-sm font-medium text-stone-700">
                        {remark.user}
                      </span>
                      <span className="text-xs text-stone-400">
                        {remark.timestamp}
                      </span>
                    </div>
                    <p className="text-stone-600 font-light text-sm break-words">
                      {remark.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-stone-400 font-light text-sm italic">
                  No remarks yet
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
              <input
                type="text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
                placeholder="Add a remark..."
                className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus:border-stone-400 focus: outline-none transition-colors font-light rounded-sm"
              />
              <button
                onClick={handleAddRemark}
                disabled={isSubmitting || !remarkText.trim()}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-sm"
              >
                {isSubmitting ?  "ADDING..." : "ADD REMARK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ShiftEngineerDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serialNo: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
    apparatus: "",
    description: "",
    recommendation: "",
    operationAction: "",
    referTo: [],
    means: "Telephone",
  });
  const navigate = useNavigate();

  // Generate serial number when reports are loaded or form is opened
  useEffect(() => {
    if (showForm && reports.length >= 0) {
      const nextSerialNo = generateNextSerialNo(reports);
      setFormData((prev) => ({
        ...prev,
        serialNo: nextSerialNo,
      }));
    }
  }, [showForm, reports]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/reports`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const departments = Array.isArray(report.referTo)
        ? report.referTo.join(" ")
        : report.referTo;
      const matchesSearch =
        report.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        departments.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const handleSubmit = async () => {
    if (! formData.serialNo || !formData.description || !formData.apparatus) {
      alert("Please fill all required fields (Serial No, Apparatus, Description)");
      return;
    }

    if (formData.referTo.length === 0) {
      alert("Please select at least one department");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/createReport`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serialNo: formData.serialNo.toUpperCase(),
          date: formData.date,
          time: formData.time,
          apparatus:  formData.apparatus,
          description: formData.description,
          recommendation: formData.recommendation,
          operationAction: formData.operationAction,
          referTo: formData.referTo,
          means: formData.means,
        }),
      });

      const data = await response.json();

      if (! response.ok) {
        throw new Error(data.message || "Failed to create report");
      }

      setReports([data.report, ...reports]);

      // Reset form with new serial number
      const nextSerialNo = generateNextSerialNo([data.report, ...reports]);
      setFormData({
        serialNo:  nextSerialNo,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0].substring(0, 5),
        apparatus: "",
        description: "",
        recommendation: "",
        operationAction: "",
        referTo: [],
        means: "Telephone",
      });

      setShowForm(false);
      alert("Report created successfully!");
    } catch (error) {
      console.error("Error creating report:", error);
      alert(`Failed to create report:  ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRemark = async (reportId, text) => {
    const newRemark = {
      user: "Current User",
      timestamp: new Date().toLocaleString(),
      text,
    };

    setReports(
      reports.map((r) =>
        r._id === reportId
          ? { ...r, remarks: [...(r.remarks || []), newRemark] }
          : r
      )
    );

    if (selectedReport && selectedReport._id === reportId) {
      setSelectedReport({
        ...selectedReport,
        remarks:  [...(selectedReport.remarks || []), newRemark],
      });
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    setReports(
      reports.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
    );

    if (selectedReport && selectedReport._id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  const handleLogout = async () => {
    try {
      logout(navigate);
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Failed to logout.Please try again.");
    }
  };

  const handleOpenForm = () => {
    if (! showForm) {
      // Generate new serial number when opening form
      const nextSerialNo = generateNextSerialNo(reports);
      setFormData({
        serialNo:  nextSerialNo,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0].substring(0, 5),
        apparatus: "",
        description: "",
        recommendation: "",
        operationAction: "",
        referTo: [],
        means: "Telephone",
      });
    }
    setShowForm(! showForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-stone-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-light text-sm">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <div className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider mb-1">
                TROUBLESHOOTING REPORTS
              </h1>
              <p className="text-stone-400 font-light text-sm">
                Shift Engineer Dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenForm}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 font-light text-sm tracking-wide transition-all duration-200 rounded-sm ${
                  showForm
                    ? "bg-stone-700 text-white hover:bg-stone-600 border border-stone-600"
                    :  "bg-white text-stone-900 hover:bg-stone-100"
                }`}
              >
                {showForm ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>CANCEL</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">NEW REPORT</span>
                    <span className="sm:hidden">NEW</span>
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent hover:bg-stone-800 transition-all duration-200 border border-stone-700 text-sm font-light tracking-wide rounded-sm text-stone-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 flex items-start gap-3 rounded-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-light text-sm">{error}</p>
          </div>
        )}

        {/* New Report Form */}
        {showForm && (
          <div className="bg-white border border-stone-200 rounded-sm p-5 sm:p-8 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-light text-stone-800 tracking-wide">
                GENERATE NEW REPORT
              </h3>
              <span className="text-xs text-stone-400 font-light">
                * Required fields
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Serial Number - Auto-generated but editable */}
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Serial No *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.serialNo}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNo: e.target.value.toUpperCase() })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:border-stone-400 focus:outline-none transition-colors font-medium rounded-sm uppercase"
                    placeholder="TR-2025-001"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
                    Auto-generated
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Apparatus Affected *
                </label>
                <input
                  type="text"
                  value={formData.apparatus}
                  onChange={(e) =>
                    setFormData({ ...formData, apparatus: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:border-stone-400 focus: outline-none transition-colors font-light rounded-sm"
                  placeholder="e.g., Transformer T1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description:  e.target.value })
                  }
                  className="w-full px-4 py-3 border border-stone-200 bg-stone-50 text-stone-800 text-sm focus: border-stone-400 focus:outline-none transition-colors font-light resize-none rounded-sm"
                  rows="4"
                  placeholder="Describe the trouble in detail..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Recommendation
                </label>
                <textarea
                  value={formData.recommendation}
                  onChange={(e) =>
                    setFormData({ ...formData, recommendation: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:border-stone-400 focus:outline-none transition-colors font-light resize-none rounded-sm"
                  rows="3"
                  placeholder="Recommended actions..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Action Taken
                </label>
                <input
                  type="text"
                  value={formData.operationAction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operationAction: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
                  placeholder="Actions taken by operation staff..."
                />
              </div>

              {/* Multi-select Department */}
              <div className="sm: col-span-2">
                <MultiSelectDropdown
                  selected={formData.referTo}
                  onChange={(selected) =>
                    setFormData({ ...formData, referTo: selected })
                  }
                  options={DEPARTMENTS}
                  label="Refer to Departments *"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  Means
                </label>
                <select
                  value={formData.means}
                  onChange={(e) =>
                    setFormData({ ...formData, means: e.target.value })
                  }
                  className="w-full p-3 border border-stone-200 bg-stone-50 text-stone-800 text-sm font-light focus:border-stone-400 focus:outline-none transition-colors rounded-sm"
                >
                  <option value="Telephone">Telephone</option>
                  <option value="Email">Email</option>
                  <option value="Radio">Radio</option>
                  <option value="In Person">In Person</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-stone-900 hover: bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ?  (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  "SUBMIT REPORT"
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-8 py-3.5 bg-transparent hover:bg-stone-100 text-stone-600 font-light text-sm tracking-wide transition-all duration-200 border border-stone-300 rounded-sm"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm: flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by serial no, apparatus, description, or department..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus:border-stone-400 focus:outline-none transition-colors font-light rounded-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 pl-11 pr-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm font-light focus:border-stone-400 focus:outline-none transition-colors appearance-none rounded-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Reports Count */}
        <div className="mb-4">
          <p className="text-sm text-stone-500 font-light">
            Showing <span className="font-medium text-stone-700">{filteredReports.length}</span> of{" "}
            <span className="font-medium text-stone-700">{reports.length}</span> reports
          </p>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ?  (
            <div className="bg-white rounded-sm border border-stone-200 p-12 text-center">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 font-light mb-2">No reports found</p>
              <p className="text-stone-400 text-sm font-light">
                {reports.length === 0
                  ? "Create your first report to get started"
                  : "Try adjusting your search or filter"}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAddRemark={handleAddRemark}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}