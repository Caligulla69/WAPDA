import React, { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  User,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  X,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  Radio,
  Users,
  LogOut,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import {useNavigate} from 'react-router-dom'


const ReportCard = ({ report, onClick }) => {
  const getStatusConfig = (status) => {
    const configs = {
      Closed: {
        color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
        label: "CLOSED",
      },
      Rejected: {
        color: "bg-rose-50 text-rose-800 border-rose-200",
        icon: XCircle,
        label: "REJECTED",
      },
      Pending: {
        color: "bg-amber-50 text-amber-800 border-amber-200",
        icon: AlertCircle,
        label: "PENDING",
      },
      "Needs Revision": {
        color: "bg-orange-50 text-orange-800 border-orange-200",
        icon: RefreshCw,
        label: "NEEDS REVISION",
      },
      "Under Review": {
        color: "bg-violet-50 text-violet-800 border-violet-200",
        icon: Eye,
        label: "UNDER REVIEW",
      },
    };
    return (
      configs[status] || {
        color: "bg-blue-50 text-blue-800 border-blue-200",
        icon: FileText,
        label: status?.toUpperCase() || "OPEN",
      }
    );
  };

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="p-2 bg-stone-50 border border-stone-200 group-hover:bg-stone-100 transition-colors flex-shrink-0">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-stone-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-light text-stone-800 text-base md:text-lg tracking-wide truncate">
                {report.serialNo}
              </h3>
              <p className="text-xs text-stone-500 font-light mt-0.5 truncate">
                {report.referTo} Department
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <span
              className={`px-2 md:px-3 py-1 md:py-1.5 text-xs font-light border ${statusConfig.color} flex items-center gap-1 md:gap-1.5`}
            >
              <StatusIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="hidden sm:inline">{statusConfig.label}</span>
            </span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
        <div className="mb-4 pb-4 border-b border-stone-100">
          <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
            APPARATUS AFFECTED
          </p>
          <p className="text-stone-800 font-light text-sm md:text-base">
            {report.apparatus}
          </p>
        </div>
        <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2 text-sm md:text-base">
          {report.description}
        </p>
        {report.departmentAction && (
          <div className="mb-4 p-3 bg-stone-50 border-l-2 border-stone-400">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              DEPARTMENT ACTION
            </p>
            <p className="text-stone-700 font-light text-xs md:text-sm line-clamp-1">
              {report.departmentAction}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs text-stone-500 font-light pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{new Date(report.date).toLocaleDateString()}</span>
            {report.time && (
              <>
                <span className="text-stone-400">•</span>
                <span>{report.time}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="truncate max-w-[150px]">{report.notifiedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetailModal = ({ report, onClose, onAction, onAddRemark }) => {
  const [remarkText, setRemarkText] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;
    setIsSubmitting(true);
    await onAddRemark(report._id, remarkText);
    setRemarkText("");
    setIsSubmitting(false);
  };

  const handleAction = async (type) => {
    if (type === "revision" && !revisionReason.trim()) {
      alert("Please provide a reason for sending back for revision");
      return;
    }
    setActionType(type);
    await onAction(report._id, type, revisionReason);
    setActionType("");
    onClose();
  };

  const getMeansIcon = (means) => {
    switch (means?.toLowerCase()) {
      case "telephone":
        return Phone;
      case "email":
        return Mail;
      case "radio":
        return Radio;
      case "in person":
        return Users;
      default:
        return Phone;
    }
  };

  const MeansIcon = getMeansIcon(report.means);
  const getStatusConfig = (status) => {
    const configs = {
      Closed: {
        color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
      },
      Rejected: {
        color: "bg-rose-50 text-rose-800 border-rose-200",
        icon: XCircle,
      },
      Pending: {
        color: "bg-amber-50 text-amber-800 border-amber-200",
        icon: AlertCircle,
      },
      "Needs Revision": {
        color: "bg-orange-50 text-orange-800 border-orange-200",
        icon: RefreshCw,
      },
      "Under Review": {
        color: "bg-violet-50 text-violet-800 border-violet-200",
        icon: Eye,
      },
    };
    return (
      configs[status] || {
        color: "bg-blue-50 text-blue-800 border-blue-200",
        icon: FileText,
      }
    );
  };
  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-900 text-white p-4 md:p-6 flex justify-between items-center z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-light tracking-wide">
              {report.serialNo}
            </h3>
            <p className="text-stone-400 font-light text-xs md:text-sm mt-1">
              Resident Engineer Final Review
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex justify-center">
            <span
              className={`px-4 py-2 text-sm font-light border ${statusConfig.color} flex items-center gap-2`}
            >
              <StatusIcon className="w-4 h-4" />
              {report.status?.toUpperCase() || "OPEN"}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white border border-stone-200 p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  DATE
                </p>
              </div>
              <p className="text-sm md:text-base text-stone-800 font-light">
                {new Date(report.date).toLocaleDateString() || "N/A"}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  TIME
                </p>
              </div>
              <p className="text-sm md:text-base text-stone-800 font-light">
                {report.time || "N/A"}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  NOTIFIED BY
                </p>
              </div>
              <p className="text-sm md:text-base text-stone-800 font-light truncate">
                {report.notifiedBy || "N/A"}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <MeansIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  MEANS
                </p>
              </div>
              <p className="text-sm md:text-base text-stone-800 font-light">
                {report.means || "N/A"}
              </p>
            </div>
          </div>
          <div className="bg-white border border-stone-200 p-4 md:p-6">
            <label className="block text-xs md:text-sm font-light text-stone-600 mb-3 tracking-wide">
              REFERRED TO DEPARTMENT
            </label>
            <p className="text-base md:text-lg text-stone-800 font-light">
              {report.referTo || "N/A"}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-4 md:p-6">
            <label className="block text-xs md:text-sm font-light text-stone-600 mb-3 tracking-wide">
              APPARATUS AFFECTED
            </label>
            <p className="text-sm md:text-base text-stone-800 font-light">
              {report.apparatus || "N/A"}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-4 md:p-6">
            <label className="block text-xs md:text-sm font-light text-stone-600 mb-3 tracking-wide">
              DESCRIPTION OF TROUBLE
            </label>
            <p className="text-sm md:text-base text-stone-800 font-light leading-relaxed">
              {report.description || "No description provided"}
            </p>
          </div>
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-4 md:p-6">
              <label className="block text-xs md:text-sm font-light text-stone-600 mb-3 tracking-wide">
                RECOMMENDATION
              </label>
              <p className="text-sm md:text-base text-stone-800 font-light leading-relaxed">
                {report.recommendation}
              </p>
            </div>
          )}
          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-4 md:p-6">
              <label className="block text-xs md:text-sm font-light text-stone-600 mb-3 tracking-wide">
                OPERATION ACTION TAKEN
              </label>
              <p className="text-sm md:text-base text-stone-800 font-light leading-relaxed">
                {report.operationAction}
              </p>
            </div>
          )}
          {report.departmentAction && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 md:p-6">
              <label className="block text-xs md:text-sm font-light text-emerald-800 mb-3 tracking-wide">
                DEPARTMENT ACTION COMPLETED
              </label>
              <p className="text-sm md:text-base text-stone-800 font-light leading-relaxed">
                {report.departmentAction}
              </p>
            </div>
          )}
          <div className="bg-white border border-stone-200 p-4 md:p-6">
            <label className="block text-xs md:text-sm font-light text-stone-600 mb-4 tracking-wide">
              <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-2" />
              REMARKS & UPDATES
            </label>
            <div className="space-y-4 mb-6">
              {report.remarks && report.remarks.length > 0 ? (
                report.remarks.map((remark, idx) => (
                  <div key={idx} className="border-l-2 border-stone-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 md:w-3.5 md:h-3.5 text-stone-500" />
                      <span className="text-xs md:text-sm font-light text-stone-800">
                        {remark.user}
                      </span>
                      <span className="text-xs text-stone-400 font-light">
                        {new Date(remark.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-stone-600 font-light">
                      {remark.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-stone-400 font-light text-sm text-center py-4">
                  No remarks yet
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
                placeholder="Add a remark or update..."
                className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-sm md:text-base text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
              />
              <button
                onClick={handleAddRemark}
                disabled={isSubmitting || !remarkText.trim()}
                className="px-4 md:px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-xs md:text-sm tracking-wide transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "ADDING..." : "ADD"}
              </button>
            </div>
          </div>
          {report.status !== "Closed" && report.status !== "Rejected" && (
            <div className="bg-orange-50 border border-orange-200 p-4 md:p-6">
              <label className="block text-xs md:text-sm font-light text-orange-800 mb-3 tracking-wide">
                <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-2" />
                REVISION REASON (Optional)
              </label>
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder="Provide details if sending back for revision..."
                className="w-full px-4 py-3 border border-orange-300 text-sm md:text-base text-stone-800 bg-white focus:border-orange-500 focus:outline-none transition-colors font-light resize-none"
                rows="3"
              />
            </div>
          )}
          {report.status !== "Closed" && report.status !== "Rejected" && (
            <div className="bg-white border border-stone-200 p-4 md:p-6">
              <label className="block text-xs md:text-sm font-light text-stone-600 mb-4 tracking-wide">
                FINAL DECISION
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <button
                  onClick={() => handleAction("close")}
                  disabled={actionType !== ""}
                  className="px-4 md:px-6 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-xs md:text-sm tracking-wide transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-2"
                >
                  {actionType === "close" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span>CLOSE REPORT</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionType !== ""}
                  className="px-4 md:px-6 py-3 md:py-4 bg-rose-600 hover:bg-rose-700 text-white font-light text-xs md:text-sm tracking-wide transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-2"
                >
                  {actionType === "reject" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span>REJECT</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction("revision")}
                  disabled={actionType !== "" || !revisionReason.trim()}
                  className="px-4 md:px-6 py-3 md:py-4 bg-orange-600 hover:bg-orange-700 text-white font-light text-xs md:text-sm tracking-wide transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-2"
                >
                  {actionType === "revision" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                      <span>SEND BACK</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-stone-500 font-light mt-4 text-center">
                Close report if satisfied • Reject if inadequate • Send back for
                additional work
              </p>
            </div>
          )}
          {(report.status === "Closed" || report.status === "Rejected") && (
            <div className="bg-stone-100 border border-stone-300 p-4 md:p-6 text-center">
              <p className="text-sm md:text-base text-stone-600 font-light">
                This report has been{" "}
                <span className="font-medium">
                  {report.status.toLowerCase()}
                </span>{" "}
                and cannot be modified.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ResidentEngineerDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate =useNavigate()

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

  const handleLogout = async () => {
    try {
      logout(navigate)
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const pendingReports = useMemo(
    () =>
      reports.filter(
        (r) =>
          r.currentStage === "Resident Engineer" &&
          r.status !== "Closed" &&
          r.status !== "Rejected"
      ),
    [reports]
  );
  const closedReports = useMemo(
    () => reports.filter((r) => r.status === "Closed"),
    [reports]
  );
  const rejectedReports = useMemo(
    () => reports.filter((r) => r.status === "Rejected"),
    [reports]
  );

  const displayReports = useMemo(() => {
    const baseReports =
      filter === "pending"
        ? pendingReports
        : filter === "closed"
        ? closedReports
        : rejectedReports;
    if (!searchTerm) return baseReports;
    return baseReports.filter(
      (r) =>
        r.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filter, searchTerm, pendingReports, closedReports, rejectedReports]);

  const handleAddRemark = async (reportId, text) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}/remarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Failed to add remark");
      const updatedReport = await response.json();
      setReports(
        reports.map((r) => (r._id === reportId ? updatedReport.report : r))
      );
      if (selectedReport?._id === reportId)
        setSelectedReport(updatedReport.report);
    } catch (err) {
      console.error("Error adding remark:", err);
      alert("Failed to add remark. Please try again.");
    }
  };

  const handleAction = async (reportId, actionType, revisionReason) => {
    try {
      const response = await fetch(
        `${API_URL}/reports/${reportId}/resident-action`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: actionType,
            revisionReason:
              actionType === "revision" ? revisionReason : undefined,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to perform action");
      }
      const updatedReport = await response.json();
      setReports(
        reports.map((r) => (r._id === reportId ? updatedReport.report : r))
      );
      await fetchReports();
    } catch (err) {
      console.error("Error performing action:", err);
      alert(err.message || "Failed to perform action. Please try again.");
    }
  };

  const filterButtons = [
    {
      id: "pending",
      label: "Pending Review",
      count: pendingReports.length,
      icon: AlertCircle,
    },
    {
      id: "closed",
      label: "Closed",
      count: closedReports.length,
      icon: CheckCircle,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: rejectedReports.length,
      icon: XCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-white p-4 md:p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-light tracking-wider mb-2">
              FINAL REVIEW
            </h1>
            <p className="text-stone-400 font-light text-sm md:text-base">
              Close, reject, or send back reports for revision
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-800 font-light">{error}</p>
            <button
              onClick={fetchReports}
              className="mt-4 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-light text-sm tracking-wide transition-colors"
            >
              RETRY
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 md:mb-8 flex flex-wrap gap-2 md:gap-3">
              {filterButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id)}
                    className={`px-4 md:px-6 py-2 md:py-3 font-light text-xs md:text-sm tracking-wide transition-all duration-300 flex items-center gap-2 ${
                      filter === btn.id
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">{btn.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        filter === btn.id
                          ? "bg-white/20 text-white"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {btn.count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mb-6 md:mb-8">
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-stone-200 text-sm md:text-base text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-white border border-stone-200 p-3 md:p-6">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                  <p className="text-xs text-stone-500 font-light tracking-wide hidden sm:block">
                    PENDING REVIEW
                  </p>
                </div>
                <p className="text-xl md:text-3xl font-light text-stone-800">
                  {pendingReports.length}
                </p>
                <p className="text-xs text-stone-400 font-light mt-1 sm:hidden">
                  Pending
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-3 md:p-6">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                  <p className="text-xs text-stone-500 font-light tracking-wide hidden sm:block">
                    CLOSED
                  </p>
                </div>
                <p className="text-xl md:text-3xl font-light text-stone-800">
                  {closedReports.length}
                </p>
                <p className="text-xs text-stone-400 font-light mt-1 sm:hidden">
                  Closed
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-3 md:p-6">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                  <XCircle className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                  <p className="text-xs text-stone-500 font-light tracking-wide hidden sm:block">
                    REJECTED
                  </p>
                </div>
                <p className="text-xl md:text-3xl font-light text-stone-800">
                  {rejectedReports.length}
                </p>
                <p className="text-xs text-stone-400 font-light mt-1 sm:hidden">
                  Rejected
                </p>
              </div>
            </div>
            {displayReports.length === 0 ? (
              <div className="bg-white border border-stone-200 p-8 md:p-12 text-center">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-light text-sm md:text-base">
                  No reports found matching your criteria
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {displayReports.map((report) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                    onClick={() => setSelectedReport(report)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAction={handleAction}
          onAddRemark={handleAddRemark}
        />
      )}
    </div>
  );
}
