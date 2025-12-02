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
  Send,
  ArrowRight,
  Loader2,
  LogOut,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS = [
  "EME (P)",
  "EME (SY)",
  "P&IE",
  "MME (P)",
  "MME (A)",
  "XEN (BARAL)",
  "SOS",
  "ITRE",
];

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
      <div className="p-6">
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
              className={`px-3 py-1.5 text-xs font-light border ${statusConfig.color} flex items-center gap-1.5`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
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

        {report.departmentAction && (
          <div className="mb-4 p-3 bg-stone-50 border-l-2 border-stone-400">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              DEPARTMENT ACTION
            </p>
            <p className="text-stone-700 font-light text-sm">
              {report.departmentAction}
            </p>
          </div>
        )}

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
  );
};

const ReportDetail = ({ report, onClose, onAction, onAddRemark }) => {
  const [remarkText, setRemarkText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [actionRemark, setActionRemark] = useState("");

  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;
    setIsSubmitting(true);
    await onAddRemark(report._id, remarkText);
    setRemarkText("");
    setIsSubmitting(false);
  };

  const openActionModal = (action) => {
    setSelectedAction(action);
    setShowActionModal(true);
    setSelectedDepartment(report.referTo || "");
    setActionRemark("");
  };

  const handleConfirmAction = async () => {
    if (selectedAction === "refer" && !selectedDepartment) {
      alert("Please select a department");
      return;
    }

    setActionType(selectedAction);

    try {
      await onAction(report._id, selectedAction, {
        department: selectedDepartment,
        remark: actionRemark,
      });

      setActionType("");
      setShowActionModal(false);
      onClose();
    } catch (err) {
      setActionType("");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-stone-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-stone-900 text-white p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-light tracking-wide">
                {report.serialNo}
              </h3>
              <p className="text-stone-400 font-light text-sm mt-1">
                OE Department Verification
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-stone-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  STATUS
                </p>
                <p className="text-stone-800 font-light">{report.status}</p>
              </div>
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  CURRENT DEPARTMENT
                </p>
                <p className="text-stone-800 font-light">{report.referTo}</p>
              </div>
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  REPORTED BY
                </p>
                <p className="text-stone-800 font-light">{report.notifiedBy}</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                APPARATUS AFFECTED
              </label>
              <p className="text-stone-800 font-light">{report.apparatus}</p>
            </div>

            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                DESCRIPTION
              </label>
              <p className="text-stone-800 font-light leading-relaxed">
                {report.description}
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                RECOMMENDATION
              </label>
              <p className="text-stone-800 font-light leading-relaxed">
                {report.recommendation}
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                OPERATION ACTION TAKEN
              </label>
              <p className="text-stone-800 font-light leading-relaxed">
                {report.operationAction}
              </p>
            </div>

            {report.departmentAction && (
              <div className="bg-stone-50 border border-stone-300 p-6">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                  DEPARTMENT ACTION
                </label>
                <p className="text-stone-800 font-light leading-relaxed">
                  {report.departmentAction}
                </p>
              </div>
            )}

            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
                REMARKS HISTORY
              </label>
              <div className="space-y-4 mb-6">
                {report.remarks && report.remarks.length > 0 ? (
                  report.remarks.map((remark, idx) => (
                    <div key={idx} className="border-l-2 border-stone-300 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-stone-500" />
                        <span className="text-sm font-light text-stone-800">
                          {remark.user}
                        </span>
                        <span className="text-xs text-stone-400 font-light">
                          {remark.timestamp}
                        </span>
                      </div>
                      <p className="text-stone-600 font-light">{remark.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-400 font-light text-sm">
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
                  placeholder="Add a verification comment..."
                  className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
                <button
                  onClick={handleAddRemark}
                  disabled={isSubmitting || !remarkText.trim()}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "ADDING..." : "ADD"}
                </button>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
                OE VERIFICATION ACTIONS
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => openActionModal("approve")}
                  disabled={actionType !== ""}
                  className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  APPROVE & SEND TO RE
                </button>
                <button
                  onClick={() => openActionModal("reject")}
                  disabled={actionType !== ""}
                  className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  REJECT & RETURN
                </button>
              </div>
              <button
                onClick={() => openActionModal("refer")}
                disabled={actionType !== ""}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                REFER TO ANOTHER DEPARTMENT
              </button>
            </div>
          </div>
        </div>
      </div>

      {showActionModal && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-stone-300">
            <div className="bg-stone-800 text-white p-4">
              <h4 className="text-lg font-light tracking-wide">
                {selectedAction === "approve" &&
                  "Approve & Forward to Resident Engineer"}
                {selectedAction === "reject" && "Reject & Return to Department"}
                {selectedAction === "refer" && "Refer to Another Department"}
              </h4>
            </div>

            <div className="p-6 space-y-4">
              {selectedAction === "approve" && (
                <div className="bg-emerald-50 border border-emerald-200 p-4">
                  <p className="text-sm text-emerald-800 font-light">
                    This report will be marked as verified and forwarded to the
                    Resident Engineer for final review.
                  </p>
                </div>
              )}

              {selectedAction === "reject" && (
                <div className="bg-rose-50 border border-rose-200 p-4">
                  <p className="text-sm text-rose-800 font-light">
                    This report will be returned to{" "}
                    <strong>{report.referTo}</strong> department for revision.
                    All remarks will be preserved.
                  </p>
                </div>
              )}

              {selectedAction === "refer" && (
                <div>
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    SELECT DEPARTMENT
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 text-stone-800 font-light focus:border-stone-800 focus:outline-none transition-colors"
                  >
                    <option value="">Choose department...</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-stone-500 font-light mt-2">
                    All previous remarks and actions will be preserved. The
                    selected department will receive this report with full
                    history.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                  ADD REMARK (OPTIONAL)
                </label>
                <textarea
                  value={actionRemark}
                  onChange={(e) => setActionRemark(e.target.value)}
                  placeholder="Add a comment about this action..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white border border-stone-200 text-stone-800 placeholder-stone-400 font-light focus:border-stone-800 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-light text-sm tracking-wide transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={actionType !== ""}
                  className="flex-1 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionType !== "" ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      CONFIRM
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function OEDepartmentDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOEReports();
  }, []);

  const fetchOEReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reports/oe/pending`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data.reports || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const myReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const handleAddRemark = async (reportId, text) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}/oe-remark`, {
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

  const handleAction = async (reportId, actionType, options = {}) => {
    try {
      if (actionType === "refer" && !options.department) {
        alert("Please select a department to refer to");
        throw new Error("Department not selected");
      }

      const payload = {
        action: actionType,
        department: options.department || null,
        remark: options.remark || null,
      };

      console.log("Sending payload:", payload);

      const response = await fetch(`${API_URL}/reports/${reportId}/oe-action`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to process action");
      }

      setReports(reports.filter((r) => r._id !== reportId));

      alert(`Report ${actionType}ed successfully!`);
    } catch (err) {
      console.error("Error processing action:", err);
      alert(err.message || "Failed to process action. Please try again.");
      throw err;
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-stone-800 animate-spin mx-auto mb-4" />
          <p className="text-stone-600 font-light">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-white p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-wider mb-2">
                OE VERIFICATION
              </h1>
              <p className="text-stone-400 font-light">
                Review, verify, and route reports for department actions
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-light">{error}</p>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-8 pr-4 py-3 bg-white border border-stone-200 text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border border-stone-200 text-stone-800 font-light focus:border-stone-800 focus:outline-none transition-colors appearance-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Needs Revision">Needs Revision</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              TOTAL PENDING
            </p>
            <p className="text-3xl font-light text-stone-800">
              {myReports.length}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              UNDER REVIEW
            </p>
            <p className="text-3xl font-light text-stone-800">
              {myReports.filter((r) => r.status === "Under Review").length}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              NEEDS REVISION
            </p>
            <p className="text-3xl font-light text-stone-800">
              {myReports.filter((r) => r.status === "Needs Revision").length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {myReports.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-400 font-light">
                No reports pending for OE verification
              </p>
            </div>
          ) : (
            myReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))
          )}
        </div>
      </div>

      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAction={handleAction}
          onAddRemark={handleAddRemark}
        />
      )}
    </div>
  );
}
