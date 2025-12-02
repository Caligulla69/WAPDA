import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Clock,
  FileText,
  User,
  Calendar,
  Wrench,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Plus,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  LogOut,
  Menu,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

const ReportCard = ({ report, onClick }) => {
  const statusConfig = {
    Pending: {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: AlertCircle,
    },
    "Under Review": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
    },
    "Needs Revision": {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: AlertCircle,
    },
    Closed: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: CheckCircle,
    },
    Rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: X },
  };

  const config = statusConfig[report.status] || statusConfig.Pending;
  const StatusIcon = config.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="font-light text-stone-800 text-base sm:text-lg tracking-wide">
                {report.serialNo}
              </span>
              <span
                className={`px-2 sm:px-3 py-1 text-xs font-light border ${config.color} flex items-center gap-1 whitespace-nowrap`}
              >
                <StatusIcon className="w-3 h-3" />
                {report.status.toUpperCase()}
              </span>
            </div>
            <p className="text-stone-500 text-sm font-light truncate">
              {report.apparatus}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
        </div>

        <p className="text-stone-600 font-light leading-relaxed mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
          {report.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-stone-500 font-light border-t border-stone-100 pt-3 sm:pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{report.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{report.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 flex-shrink-0" />
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
    if (!remarkText.trim()) return;
    setIsSubmitting(true);
    await onAddRemark(report._id, remarkText);
    setRemarkText("");
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-stone-50 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-900 text-white p-4 sm:p-6 flex justify-between items-center z-10">
          <h3 className="text-lg sm:text-2xl font-light tracking-wide truncate pr-2">
            {report.serialNo}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-stone-300 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Update */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
              STATUS
            </label>
            <select
              value={report.status}
              onChange={(e) => onUpdateStatus(report._id, e.target.value)}
              className="w-full p-2 sm:p-3 border border-stone-300 bg-white text-stone-800 text-sm sm:text-base font-light focus:border-stone-800 focus:outline-none transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                DATE
              </label>
              <p className="text-stone-800 font-light text-sm sm:text-base">
                {report.date}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                TIME
              </label>
              <p className="text-stone-800 font-light text-sm sm:text-base">
                {report.time}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                NOTIFIED BY
              </label>
              <p className="text-stone-800 font-light text-sm sm:text-base">
                {report.notifiedBy}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                DEPARTMENT
              </label>
              <p className="text-stone-800 font-light text-sm sm:text-base">
                {report.referTo}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                CURRENT STAGE
              </label>
              <p className="text-stone-800 font-light text-sm sm:text-base">
                {report.currentStage}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                PRIORITY
              </label>
              <p className="text-stone-800 font-light text-sm sm:text-base">
                {report.priority || "Medium"}
              </p>
            </div>
          </div>

          {/* Apparatus */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
              APPARATUS AFFECTED
            </label>
            <p className="text-stone-800 font-light text-sm sm:text-base break-words">
              {report.apparatus}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
              DESCRIPTION
            </label>
            <p className="text-stone-800 font-light leading-relaxed text-sm sm:text-base break-words">
              {report.description}
            </p>
          </div>

          {/* Recommendation */}
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                RECOMMENDATION
              </label>
              <p className="text-stone-800 font-light leading-relaxed text-sm sm:text-base break-words">
                {report.recommendation}
              </p>
            </div>
          )}

          {/* Operation Action */}
          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                ACTION TAKEN
              </label>
              <p className="text-stone-800 font-light leading-relaxed text-sm sm:text-base break-words">
                {report.operationAction}
              </p>
            </div>
          )}

          {/* Remarks */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
              REMARKS
            </label>
            <div className="space-y-4 mb-6">
              {report.remarks && report.remarks.length > 0 ? (
                report.remarks.map((remark, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-stone-300 pl-3 sm:pl-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-stone-500 flex-shrink-0" />
                      <span className="text-sm font-light text-stone-800">
                        {remark.user}
                      </span>
                      <span className="text-xs text-stone-400 font-light">
                        {remark.timestamp}
                      </span>
                    </div>
                    <p className="text-stone-600 font-light text-sm sm:text-base break-words">
                      {remark.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-stone-400 font-light text-sm">
                  No remarks yet
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
                placeholder="Add a remark..."
                className="flex-1 px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 text-sm sm:text-base placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
              />
              <button
                onClick={handleAddRemark}
                disabled={isSubmitting || !remarkText.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? "ADDING..." : "ADD"}
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
  const [formData, setFormData] = useState({
    serialNo: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
    apparatus: "",
    description: "",
    recommendation: "",
    operationAction: "",
    referTo: "EME (P)",
    means: "Telephone",
  });
  const navigate=useNavigate()

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
      console.log(data);

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
      const matchesSearch =
        report.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const handleSubmit = async () => {
    if (!formData.serialNo || !formData.description || !formData.apparatus) {
      alert(
        "Please fill all required fields (Serial No, Apparatus, Description)"
      );
      return;
    }

    const newReport = {
      _id: Date.now().toString(),
      ...formData,
      status: "Pending",
      notifiedBy: "Current User",
      currentStage: "Initial Review",
      priority: "Medium",
      remarks: [],
    };

    setReports([newReport, ...reports]);
    setFormData({
      serialNo: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      apparatus: "",
      description: "",
      recommendation: "",
      operationAction: "",
      referTo: "EME (P)",
      means: "Telephone",
    });
    setShowForm(false);
    alert("Report created successfully!");
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
        remarks: [...(selectedReport.remarks || []), newRemark],
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
       alert("Failed to logout. Please try again.");
     }
   };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-stone-800 animate-spin mx-auto mb-4" />
          <p className="text-stone-600 font-light">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-stone-900 text-white p-4 sm:p-6 lg:p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider mb-1 sm:mb-2 break-words">
                TROUBLESHOOTING REPORTS
              </h1>
              <p className="text-stone-400 font-light text-sm sm:text-base">
                Shift Engineer Dashboard
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-stone-900 hover:bg-stone-100 font-light text-xs sm:text-sm tracking-wide transition-colors whitespace-nowrap"
              >
                {showForm ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="hidden xs:inline">
                  {showForm ? "CANCEL" : "NEW REPORT"}
                </span>
                <span className="xs:hidden">{showForm ? "CANCEL" : "NEW"}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-xs sm:text-sm font-light tracking-wide whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-light text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* New Report Form */}
        {showForm && (
          <div className="bg-white border border-stone-200 rounded-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-light text-stone-800 mb-4 sm:mb-6 tracking-wide">
              GENERATE REPORT
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  SERIAL NO *
                </label>
                <input
                  type="text"
                  value={formData.serialNo}
                  onChange={(e) =>
                    setFormData({ ...formData, serialNo: e.target.value })
                  }
                  className="w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light"
                  placeholder="TR-2025-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  DATE
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  TIME
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  APPARATUS AFFECTED *
                </label>
                <input
                  type="text"
                  value={formData.apparatus}
                  onChange={(e) =>
                    setFormData({ ...formData, apparatus: e.target.value })
                  }
                  className="w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light"
                  placeholder="e.g., Transformer T1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  DESCRIPTION *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light resize-none"
                  rows="4"
                  placeholder="Describe the trouble..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  RECOMMENDATION
                </label>
                <textarea
                  value={formData.recommendation}
                  onChange={(e) =>
                    setFormData({ ...formData, recommendation: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light resize-none"
                  rows="3"
                  placeholder="Recommended actions..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  ACTION TAKEN
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
                  className="w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 text-sm sm:text-base focus:border-stone-800 focus:outline-none transition-colors font-light"
                  placeholder="Actions taken by operation staff..."
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  DEPARTMENT
                </label>
                <select
                  value={formData.referTo}
                  onChange={(e) =>
                    setFormData({ ...formData, referTo: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-stone-300 bg-white text-stone-800 text-sm sm:text-base font-light focus:border-stone-800 focus:outline-none transition-colors"
                >
                  <option value=" EME (P)"> EME (P)</option>
                  <option value="EME (SY)">EME (SY)</option>
                  <option value="P&IE">P&IE</option>
                  <option value=" MME (P)"> MME (P)</option>
                  <option value="MME (A)">MME (A)</option>
                  <option value="XEN (BARAL)">XEN (BARAL)</option>
                  <option value="SOS">SOS</option>
                  <option value="ITRE">ITRE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                  MEANS
                </label>
                <select
                  value={formData.means}
                  onChange={(e) =>
                    setFormData({ ...formData, means: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-stone-300 bg-white text-stone-800 text-sm sm:text-base font-light focus:border-stone-800 focus:outline-none transition-colors"
                >
                  <option value="Telephone">Telephone</option>
                  <option value="Email">Email</option>
                  <option value="Radio">Radio</option>
                  <option value="In Person">In Person</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors w-full sm:w-auto"
            >
              SUBMIT REPORT
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-stone-200 text-stone-800 text-sm sm:text-base placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-8 sm:pl-10 pr-8 py-2 sm:py-3 bg-white border border-stone-200 text-stone-800 text-sm sm:text-base font-light focus:border-stone-800 focus:outline-none transition-colors appearance-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-md border border-stone-200 p-8 sm:p-12 text-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-400 font-light text-sm sm:text-base">
                No reports found
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
