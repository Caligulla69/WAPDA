import React, { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  User,
  ChevronRight,
  X,
  Search,
  Filter,
  MessageSquare,
  Loader2,
  LogOut,
  Building2,
  Menu,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

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
      <div className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-stone-50 border border-stone-200">
                <FileText className="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <h3 className="font-light text-stone-800 text-base">
                  {report.serialNo}
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  {report.referTo}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
          </div>

          <span
            className={`inline-flex px-2 py-1 text-xs font-light border ${statusConfig.color} items-center gap-1`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </span>

          <div className="pb-3 border-b border-stone-100">
            <p className="text-xs text-stone-500 font-light mb-1">APPARATUS</p>
            <p className="text-sm text-stone-800 font-light">
              {report.apparatus}
            </p>
          </div>

          <p className="text-sm text-stone-600 font-light leading-relaxed line-clamp-2">
            {report.description}
          </p>

          <div className="flex flex-col gap-2 text-xs text-stone-500 font-light pt-3 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="w-3. 5 h-3.5" />
              <span>{report.date}</span>
              {report.time && (
                <>
                  <span className="text-stone-400">•</span>
                  <span>{report.time}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{report.notifiedBy}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-50 border border-stone-200 group-hover:bg-stone-100 transition-colors">
                <FileText className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <h3 className="font-light text-stone-800 text-lg tracking-wide">
                  {report.serialNo}
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  {report.referTo} Department
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1. 5 text-xs font-light border ${statusConfig.color} flex items-center gap-1. 5`}
              >
                <StatusIcon className="w-3. 5 h-3.5" />
                {statusConfig.label}
              </span>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-stone-100">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              APPARATUS AFFECTED
            </p>
            <p className="text-stone-800 font-light">{report.apparatus}</p>
          </div>

          <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2">
            {report.description}
          </p>

          <div className="flex items-center gap-6 text-xs text-stone-500 font-light pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{report.date}</span>
              {report.time && <span className="text-stone-400">•</span>}
              {report.time && <span>{report.time}</span>}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{report.notifiedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetail = ({ report, onClose, onAddRemark, onSendToOE, user }) => {
  const [remarkText, setRemarkText] = useState("");
  const [departmentAction, setDepartmentAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingToOE, setIsSendingToOE] = useState(false);

  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;
    setIsSubmitting(true);
    await onAddRemark(report._id, remarkText);
    setRemarkText("");
    setIsSubmitting(false);
  };

  const handleSendToOE = async () => {
    if (!departmentAction.trim()) {
      alert("Please describe the department action taken before sending to OE");
      return;
    }

    setIsSendingToOE(true);
    await onSendToOE(report._id, departmentAction);
    setIsSendingToOE(false);
  };

  // Check if report can be sent to OE
  const canSendToOE =
    report.currentStage === "Department" &&
    report.status !== "Closed" &&
    report.status !== "Rejected";

  // Check if report was sent back for revision
  const wasSentBackForRevision =
    report.status === "Rejected" && report.currentStage === "Department";

  // Extract previous department actions from remarks
  const departmentActionHistory = report.remarks
    ?.filter(
      (r) =>
        r.text.includes("Department action submitted:") ||
        r.text.includes("Report rejected by OE")
    )
    .map((r) => ({
      ...r,
      actionText: r.text
        .replace("Department action submitted: ", "")
        .split(".  Report")[0],
      wasRejected: r.text.includes("Report rejected by OE"),
    }));

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-stone-50 w-full sm:max-w-4xl sm:max-h-[90vh] max-h-[95vh] overflow-y-auto sm:rounded-lg">
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 text-white p-4 sm:p-6 flex justify-between items-center z-10">
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-xl sm:text-2xl font-light tracking-wide truncate">
              {report.serialNo}
            </h3>
            <p className="text-stone-400 font-light text-xs sm:text-sm mt-1">
              {report.referTo} Department Report
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-stone-300 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Alert - If sent back for revision */}
          {wasSentBackForRevision && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium text-orange-900 mb-1">
                    Report Sent Back for Revision
                  </p>
                  <p className="text-xs sm:text-sm text-orange-800">
                    This report was reviewed by OE Department and requires
                    revision. Please review the feedback below, update your
                    action, and resubmit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white border border-stone-200 p-3 sm:p-4">
              <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                STATUS
              </p>
              <p className="text-sm sm:text-base text-stone-800 font-light">
                {report.status}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-3 sm:p-4">
              <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                CURRENT STAGE
              </p>
              <p className="text-sm sm:text-base text-stone-800 font-light">
                {report.currentStage}
              </p>
            </div>
            <div className="bg-white border border-stone-200 p-3 sm:p-4">
              <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                REPORTED BY
              </p>
              <p className="text-sm sm:text-base text-stone-800 font-light truncate">
                {report.notifiedBy}
              </p>
            </div>
          </div>

          {/* Apparatus */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
              APPARATUS AFFECTED
            </label>
            <p className="text-sm sm:text-base text-stone-800 font-light">
              {report.apparatus}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
              PROBLEM DESCRIPTION
            </label>
            <p className="text-sm sm:text-base text-stone-800 font-light leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Recommendation */}
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                RECOMMENDATION
              </label>
              <p className="text-sm sm:text-base text-stone-800 font-light leading-relaxed">
                {report.recommendation}
              </p>
            </div>
          )}

          {/* Operation Action */}
          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-light text-stone-600 mb-2 sm:mb-3 tracking-wide">
                OPERATION ACTION TAKEN
              </label>
              <p className="text-sm sm:text-base text-stone-800 font-light leading-relaxed">
                {report.operationAction}
              </p>
            </div>
          )}
           {/* Remarks */}
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-light text-stone-600 mb-3 sm:mb-4 tracking-wide">
              REMARKS & UPDATES
            </label>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {report.remarks && report.remarks.length > 0 ? (
                report.remarks.map((remark, idx) => {
                  const isOEFeedback =
                    remark.text.includes("Report rejected by OE") ||
                    remark.text.includes("OE Department");
                  const isDepartmentAction = remark.text.includes(
                    "Department action submitted:"
                  );

                  return (
                    <div
                      key={idx}
                      className={`border-l-2 pl-3 sm:pl-4 ${
                        isOEFeedback
                          ? "border-orange-400 bg-orange-50/30"
                          : isDepartmentAction
                          ? "border-blue-400 bg-blue-50/30"
                          : "border-stone-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <MessageSquare
                            className={`w-3. 5 h-3.5 sm:w-4 sm:h-4 ${
                              isOEFeedback
                                ? "text-orange-600"
                                : isDepartmentAction
                                ? "text-blue-600"
                                : "text-stone-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm font-light ${
                              isOEFeedback
                                ? "text-orange-900"
                                : isDepartmentAction
                                ? "text-blue-900"
                                : "text-stone-800"
                            }`}
                          >
                            {remark.user}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400 font-light">
                          {new Date(remark.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-light ${
                          isOEFeedback
                            ? "text-orange-800"
                            : isDepartmentAction
                            ? "text-blue-800"
                            : "text-stone-600"
                        }`}
                      >
                        {remark.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-stone-400 font-light text-xs sm:text-sm">
                  No remarks yet
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleAddRemark()
                }
                placeholder="Add a remark or update..."
                className="flex-1 px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-stone-300 text-sm sm:text-base text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
              />
              <button
                onClick={handleAddRemark}
                disabled={isSubmitting || !remarkText.trim()}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-xs sm:text-sm tracking-wide transition-colors disabled:opacity-50 rounded"
              >
                {isSubmitting ? "ADDING..." : "ADD REMARK"}
              </button>
            </div>
          </div>

          {/* ✅ ACTION HISTORY - Show all previous actions */}
          {departmentActionHistory && departmentActionHistory.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-light text-blue-900 mb-3 sm:mb-4 tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4" />
                PREVIOUS DEPARTMENT ACTIONS
              </label>
              <div className="space-y-4">
                {departmentActionHistory.map((action, idx) => (
                  <div
                    key={idx}
                    className={`border-l-2 pl-4 ${
                      action.wasRejected
                        ? "border-orange-400 bg-orange-50/50"
                        : "border-blue-400"
                    } p-3 rounded-r`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-900">
                        {action.user}
                      </span>
                      <span className="text-xs text-blue-700">
                        {new Date(action.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-blue-900 font-light">
                      {action.actionText}
                    </p>
                    {action.wasRejected && (
                      <div className="mt-2 flex items-center gap-1 text-orange-700">
                        <RefreshCw className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          Sent back for revision
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
         

          {/* Department Action - Current/Latest or Input */}
          {report.departmentAction && !canSendToOE ? (
            <div className="bg-emerald-50 border border-emerald-300 p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-light text-emerald-900 mb-2 sm:mb-3 tracking-wide flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                CURRENT DEPARTMENT ACTION (SUBMITTED)
              </label>
              <p className="text-sm sm:text-base text-emerald-900 font-light leading-relaxed">
                {report.departmentAction}
              </p>
            </div>
          ) : canSendToOE ? (
            <div className="bg-amber-50 border border-amber-300 p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-light text-amber-900 mb-2 sm:mb-3 tracking-wide flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {wasSentBackForRevision
                  ? "UPDATE DEPARTMENT ACTION (REQUIRED)"
                  : "DEPARTMENT ACTION REQUIRED"}
              </label>
              {wasSentBackForRevision && (
                <p className="text-xs sm:text-sm text-amber-800 mb-3 font-light">
                  Please review the OE feedback in remarks below and provide an
                  updated action.
                </p>
              )}
              <textarea
                value={departmentAction}
                onChange={(e) => setDepartmentAction(e.target.value)}
                placeholder={
                  wasSentBackForRevision
                    ? "Describe the revised action taken by your department..."
                    : "Describe the action taken by your department..."
                }
                rows={4}
                className="w-full px-3 py-2 bg-white border border-amber-200 text-sm sm:text-base text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none transition-colors font-light resize-none rounded"
              />
              <button
                onClick={handleSendToOE}
                disabled={isSendingToOE || !departmentAction.trim()}
                className="mt-3 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white font-light text-xs sm:text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded"
              >
                {isSendingToOE ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {wasSentBackForRevision
                      ? "RESUBMITTING..."
                      : "SENDING TO OE..."}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    {wasSentBackForRevision
                      ? "RESUBMIT TO OE DEPARTMENT"
                      : "SEND TO OE DEPARTMENT"}
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function DepartmentDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAndReports();
  }, []);

  const fetchUserAndReports = async () => {
    try {
      setLoading(true);

      // Fetch user info
      const userResponse = await fetch(`${API_URL}/userData`, {
        credentials: "include",
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || "Failed to fetch user info");
      }

      const userData = await userResponse.json();
      console.log("✅ User data received:", userData);
      setUser(userData.user);

      setError(null);
    } catch (err) {
      console.error("💥 Error in fetchUser", err);
      setError(err.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchReports();

    // Set up interval to fetch every 1 minute
    const intervalId = setInterval(() => {
      fetchReports(true); // Pass true for background refresh
    }, 60000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchReports = async (isBackgroundRefresh = false) => {
    try {
      if (isBackgroundRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await fetch(`${API_URL}/reports`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      console.log("📊 Reports fetched at", new Date().toLocaleTimeString());

      setReports(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error("❌ Error fetching reports:", err);
    } finally {
      if (isBackgroundRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };
  const handleSendToOE = async (reportId, departmentAction) => {
    try {
      const response = await fetch(
        `${API_URL}/reports/${reportId}/department-action`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ departmentAction }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send report to OE");
      }

      const data = await response.json();
      console.log("✅ Report sent to OE:", data.report);

      // Update reports list
      setReports(reports.map((r) => (r._id === reportId ? data.report : r)));

      // Update selected report
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport(data.report);
      }

      alert("Report successfully sent to OE Department for verification!");
    } catch (err) {
      console.error("❌ Error sending report to OE:", err);
      alert(`Failed to send report: ${err.message}`);
    }
  };
  // ✅ Filter reports by user's department
  const departmentReports = useMemo(() => {
    if (!user) return [];

    return reports.filter((r) => {
      // Filter by department
      const matchesDepartment = r.referTo === user.department;

      // Filter by search term
      const matchesSearch =
        r.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;

      return matchesDepartment && matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter, user]);

  const handleAddRemark = async (reportId, text) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}/remarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add remark");
      }

      const data = await response.json();

      setReports(reports.map((r) => (r._id === reportId ? data.report : r)));

      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport(data.report);
      }
    } catch (err) {
      console.error("Error adding remark:", err);
      alert(err.message);
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
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-stone-800 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-stone-600 font-light">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-stone-600 font-light">
            Please log in to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-stone-900 text-white p-4 sm:p-6 lg:p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider truncate">
                  {user.department}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 font-light">
                Department Dashboard - View and manage your reports
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-xs sm:text-sm font-light tracking-wide w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <p className="font-light">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-white border border-stone-200 text-sm sm:text-base text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 bg-white border border-stone-200 text-sm sm:text-base text-stone-800 font-light focus:border-stone-800 focus:outline-none transition-colors appearance-none cursor-pointer"
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              TOTAL
            </p>
            <p className="text-2xl sm:text-3xl font-light text-stone-800">
              {departmentReports.length}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              PENDING
            </p>
            <p className="text-2xl sm:text-3xl font-light text-stone-800">
              {departmentReports.filter((r) => r.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              REVIEWING
            </p>
            <p className="text-2xl sm:text-3xl font-light text-stone-800">
              {
                departmentReports.filter((r) => r.status === "Under Review")
                  .length
              }
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-4 sm:p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              CLOSED
            </p>
            <p className="text-2xl sm:text-3xl font-light text-stone-800">
              {departmentReports.filter((r) => r.status === "Closed").length}
            </p>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3 sm:space-y-4">
          {departmentReports.length === 0 ? (
            <div className="bg-white border border-stone-200 p-8 sm:p-12 text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-stone-400 font-light">
                No reports found for {user.department} department
              </p>
              <p className="text-xs sm:text-sm text-stone-400 font-light mt-2">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Reports will appear here when created"}
              </p>
            </div>
          ) : (
            departmentReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))
          )}
        </div>
      </div>

      {/* Report Detail Modal - Pass new props */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          user={user}
          onClose={() => setSelectedReport(null)}
          onAddRemark={handleAddRemark}
          onSendToOE={handleSendToOE}
        />
      )}
    </div>
  );
}
