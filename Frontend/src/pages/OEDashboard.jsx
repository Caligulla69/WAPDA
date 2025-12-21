import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  ChevronDown,
  X,
  Search,
  Filter,
  MessageSquare,
  Send,
  ArrowRight,
  Loader2,
  LogOut,
  ArrowLeft,
  Building2,
  Calendar,
  Zap,
  Check,
  RotateCcw,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

// ============================================
// Constants
// ============================================
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

// ============================================
// Reusable Components (Memoized)
// ============================================
const StatusBadge = React.memo(({ status }) => {
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
        label:  "UNDER REVIEW",
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

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <span
      className={`px-3 py-1.5 text-xs font-light border ${config.color} flex items-center gap-1.5`}
    >
      <StatusIcon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
});

// ============================================
// Report Card Component (Memoized)
// ============================================
const ReportCard = React.memo(({ report, onClick }) => {
  const departments = useMemo(
    () => (Array.isArray(report.referTo) ? report.referTo : [report.referTo]),
    [report.referTo]
  );

  const statusConfig = useMemo(() => {
    const configs = {
      Closed: {
        color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
        label: "CLOSED",
      },
      Rejected: {
        color: "bg-rose-50 text-rose-800 border-rose-200",
        icon: XCircle,
        label:  "REJECTED",
      },
      Pending: {
        color: "bg-amber-50 text-amber-800 border-amber-200",
        icon:  AlertCircle,
        label: "PENDING",
      },
      "Needs Revision": {
        color: "bg-orange-50 text-orange-800 border-orange-200",
        icon: RefreshCw,
        label:  "NEEDS REVISION",
      },
      "Under Review":  {
        color:  "bg-violet-50 text-violet-800 border-violet-200",
        icon: Eye,
        label: "UNDER REVIEW",
      },
    };
    return (
      configs[report.status] || {
        color: "bg-blue-50 text-blue-800 border-blue-200",
        icon: FileText,
        label: report.status?.toUpperCase() || "OPEN",
      }
    );
  }, [report.status]);

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
              <div className="flex flex-wrap gap-1 mt-1">
                {departments.slice(0, 2).map((dept, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-stone-500 font-light"
                  >
                    {dept}
                    {idx < Math.min(departments.length, 2) - 1 && ", "}
                  </span>
                ))}
                {departments.length > 2 && (
                  <span className="text-xs text-stone-400">
                    +{departments.length - 2} more
                  </span>
                )}
              </div>
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
            <p className="text-stone-700 font-light text-sm line-clamp-2">
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
          {report.remarks?.length > 0 && (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{report.remarks.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ============================================
// Remarks Section Component (Memoized)
// ============================================
const RemarksSection = React.memo(({ remarks = [], onAddRemark, isSubmitting }) => {
  const [remarkText, setRemarkText] = useState("");

  const handleSubmit = useCallback(async () => {
    if (! remarkText.trim()) return;
    await onAddRemark(remarkText);
    setRemarkText("");
  }, [remarkText, onAddRemark]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="bg-white border border-stone-200 p-6">
      <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
        REMARKS HISTORY
      </label>
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {remarks.length === 0 ?  (
          <p className="text-stone-400 font-light text-sm">No remarks yet</p>
        ) : (
          remarks.map((remark, idx) => {
            const isOEFeedback =
              remark.text?.includes("rejected") ||
              remark.text?.includes("Rejected") ||
              remark.text?.includes("OE");
            const isDepartmentAction = remark.text?.includes("Department action");

            return (
              <div
                key={idx}
                className={`border-l-2 pl-4 ${
                  isOEFeedback
                    ? "border-orange-400 bg-orange-50/30"
                    :  isDepartmentAction
                    ? "border-blue-400 bg-blue-50/30"
                    :  "border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare
                    className={`w-4 h-4 ${
                      isOEFeedback
                        ? "text-orange-600"
                        : isDepartmentAction
                        ? "text-blue-600"
                        : "text-stone-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-light ${
                      isOEFeedback
                        ? "text-orange-900"
                        :  isDepartmentAction
                        ? "text-blue-900"
                        : "text-stone-800"
                    }`}
                  >
                    {remark.user}
                  </span>
                  <span className="text-xs text-stone-400 font-light">
                    {remark.timestamp
                      ? new Date(remark.timestamp).toLocaleString()
                      :  ""}
                  </span>
                </div>
                <p
                  className={`font-light ${
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
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a verification comment..."
          className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !remarkText.trim()}
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50"
        >
          {isSubmitting ?  "ADDING..." : "ADD"}
        </button>
      </div>
    </div>
  );
});

// ============================================
// Action Modal Component (Memoized)
// ============================================
const ActionModal = React.memo(
  ({ isOpen, onClose, action, report, onConfirm, isProcessing }) => {
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [remark, setRemark] = useState("");
    const [revisionReason, setRevisionReason] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
      if (isOpen && report) {
        const depts = Array.isArray(report.referTo)
          ? [...report.referTo]
          : [report.referTo];
        setSelectedDepartments(depts.filter(Boolean));
        setRemark("");
        setRevisionReason("");
      }
    }, [isOpen, report]);

    const toggleDept = useCallback((dept) => {
      setSelectedDepartments((prev) =>
        prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
      );
    }, []);

    const handleConfirm = useCallback(() => {
      if (action === "refer" && selectedDepartments.length === 0) {
        alert("Please select at least one department");
        return;
      }
      if (action === "revision" && ! revisionReason.trim()) {
        alert("Please provide a reason for revision");
        return;
      }
      onConfirm({ departments: selectedDepartments, remark, revisionReason });
    }, [action, selectedDepartments, remark, revisionReason, onConfirm]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white max-w-md w-full border border-stone-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-stone-800 text-white p-4">
            <h4 className="text-lg font-light tracking-wide">
              {action === "approve" && "Approve & Forward to Resident Engineer"}
              {action === "revision" && "Send Back for Revision"}
              {action === "refer" && "Refer to Another Department"}
            </h4>
          </div>

          <div className="p-6 space-y-4">
            {action === "approve" && (
              <div className="bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm text-emerald-800 font-light">
                  This report will be marked as verified and forwarded to the
                  Resident Engineer for final review.
                </p>
              </div>
            )}

            {action === "revision" && (
              <>
                <div className="bg-orange-50 border border-orange-200 p-4 mb-4">
                  <p className="text-sm text-orange-800 font-light">
                    This report will be returned to the originating department(s)
                    for revision. Please specify what needs to be corrected.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    REASON FOR REVISION (REQUIRED)
                  </label>
                  <textarea
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    placeholder="Describe what needs to be revised..."
                    rows="4"
                    className="w-full px-4 py-3 bg-white border border-stone-200 text-stone-800 placeholder-stone-400 font-light focus:border-orange-500 focus: outline-none transition-colors resize-none"
                  />
                </div>
              </>
            )}

            {action === "refer" && (
              <>
                <div className="bg-blue-50 border border-blue-200 p-4">
                  <p className="text-sm text-blue-800 font-light">
                    Select the department(s) this report should be referred to.
                    All previous remarks and actions will be preserved.
                  </p>
                </div>
                <div className="relative">
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    SELECT DEPARTMENT(S)
                  </label>
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full p-3 bg-white border border-stone-200 text-stone-800 font-light cursor-pointer hover:border-stone-300 transition-colors min-h-[48px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {selectedDepartments.length === 0 ?  (
                          <span className="text-stone-400">
                            Choose department(s)...
                          </span>
                        ) : (
                          selectedDepartments.map((dept) => (
                            <span
                              key={dept}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-700 text-xs"
                            >
                              {dept}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDept(dept);
                                }}
                                className="hover:text-stone-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 transition-transform ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white border border-stone-200 shadow-lg max-h-48 overflow-y-auto">
                        {DEPARTMENTS.map((dept) => (
                          <div
                            key={dept}
                            onClick={() => toggleDept(dept)}
                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                              selectedDepartments.includes(dept)
                                ? "bg-stone-100 text-stone-900"
                                :  "hover:bg-stone-50 text-stone-700"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 border flex items-center justify-center ${
                                selectedDepartments.includes(dept)
                                  ? "bg-stone-800 border-stone-800"
                                  : "border-stone-300"
                              }`}
                            >
                              {selectedDepartments.includes(dept) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="font-light text-sm">{dept}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {action !== "revision" && (
              <div>
                <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                  ADD REMARK (OPTIONAL)
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add a comment about this action..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white border border-stone-200 text-stone-800 placeholder-stone-400 font-light focus:border-stone-800 focus: outline-none transition-colors resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-light text-sm tracking-wide transition-colors disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
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
    );
  }
);

// ============================================
// Report Detail Modal (Memoized)
// ============================================
const ReportDetail = React.memo(({ report, onClose, onAction, onAddRemark }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionModal, setActionModal] = useState({ open: false, action: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const departments = useMemo(
    () => (Array.isArray(report.referTo) ? report.referTo : [report.referTo]),
    [report.referTo]
  );

  const handleAddRemark = useCallback(
    async (text) => {
      setIsSubmitting(true);
      await onAddRemark(report._id, text);
      setIsSubmitting(false);
    },
    [report._id, onAddRemark]
  );

  const handleConfirmAction = useCallback(
    async (options) => {
      setIsProcessing(true);
      try {
        await onAction(report._id, actionModal.action, options);
        setActionModal({ open: false, action: null });
        onClose();
      } catch {
        // Error handled in parent
      } finally {
        setIsProcessing(false);
      }
    },
    [report._id, actionModal.action, onAction, onClose]
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-stone-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-stone-900 text-white p-6 flex justify-between items-center z-10">
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
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  STATUS
                </p>
                <p className="text-stone-800 font-light">{report.status}</p>
              </div>
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  CURRENT STAGE
                </p>
                <p className="text-stone-800 font-light">{report.currentStage}</p>
              </div>
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  DATE
                </p>
                <p className="text-stone-800 font-light">{report.date}</p>
              </div>
              <div className="bg-white border border-stone-200 p-4">
                <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
                  REPORTED BY
                </p>
                <p className="text-stone-800 font-light">{report.notifiedBy}</p>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                REFERRED DEPARTMENTS
              </label>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-light"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Apparatus */}
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                APPARATUS AFFECTED
              </label>
              <p className="text-stone-800 font-light">{report.apparatus}</p>
            </div>

            {/* Description */}
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                DESCRIPTION
              </label>
              <p className="text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            {/* Recommendation */}
            {report.recommendation && (
              <div className="bg-white border border-stone-200 p-6">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                  RECOMMENDATION
                </label>
                <p className="text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                  {report.recommendation}
                </p>
              </div>
            )}

            {/* Operation Action */}
            {report.operationAction && (
              <div className="bg-white border border-stone-200 p-6">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                  OPERATION ACTION TAKEN
                </label>
                <p className="text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                  {report.operationAction}
                </p>
              </div>
            )}

            {/* Department Action */}
            {report.departmentAction && (
              <div className="bg-stone-50 border border-stone-300 p-6">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                  DEPARTMENT ACTION
                </label>
                <p className="text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                  {report.departmentAction}
                </p>
              </div>
            )}

            {/* Remarks */}
            <RemarksSection
              remarks={report.remarks || []}
              onAddRemark={handleAddRemark}
              isSubmitting={isSubmitting}
            />

            {/* Action Buttons */}
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
                OE VERIFICATION ACTIONS
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setActionModal({ open:  true, action: "approve" })}
                  className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  APPROVE & SEND TO RE
                </button>
                <button
                  onClick={() => setActionModal({ open:  true, action: "revision" })}
                  className="px-6 py-4 bg-orange-600 hover: bg-orange-700 text-white font-light text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  SEND FOR REVISION
                </button>
              </div>
              <button
                onClick={() => setActionModal({ open:  true, action: "refer" })}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-light text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                REFER TO ANOTHER DEPARTMENT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, action: null })}
        action={actionModal.action}
        report={report}
        onConfirm={handleConfirmAction}
        isProcessing={isProcessing}
      />
    </>
  );
});

// ============================================
// Main Dashboard Component
// ============================================
export default function OEDepartmentDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch only "Under Review" reports
  const fetchReports = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/reports/oe/pending`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();

      // Filter only "Under Review" status reports at OE Department stage
      const underReviewReports = (data.reports || []).filter(
        (report) =>
          report.status === "Under Review" &&
          report.currentStage === "OE Department"
      );

      setReports(underReviewReports);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchReports(true), 120000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  // Filtered reports based on search
  const filteredReports = useMemo(() => {
    if (!searchTerm.trim()) return reports;

    const term = searchTerm.toLowerCase();
    return reports.filter((r) => {
      const depts = Array.isArray(r.referTo) ? r.referTo.join(" ") : r.referTo;
      return (
        r.serialNo?.toLowerCase().includes(term) ||
        r.apparatus?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        depts?.toLowerCase().includes(term) ||
        r.notifiedBy?.toLowerCase().includes(term)
      );
    });
  }, [reports, searchTerm]);

  // Stats
  const stats = useMemo(
    () => ({
      total: reports.length,
      withAction: reports.filter((r) => r.departmentAction).length,
      pendingAction: reports.filter((r) => !r.departmentAction).length,
    }),
    [reports]
  );

  const handleAddRemark = useCallback(
    async (reportId, text) => {
      try {
        const response = await fetch(`${API_URL}/reports/${reportId}/oe-remark`, {
          method: "POST",
          headers: { "Content-Type":  "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to add remark");
        }

        const data = await response.json();

        setReports((prev) =>
          prev.map((r) => (r._id === reportId ?  data.report : r))
        );

        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(data.report);
        }
      } catch (err) {
        console.error("Error adding remark:", err);
        alert(err.message);
      }
    },
    [selectedReport]
  );

  const handleAction = useCallback(async (reportId, actionType, options = {}) => {
    try {
      const backendAction = actionType === "revision" ? "reject" : actionType;

      const payload = {
        action: backendAction,
        department: options.departments || null,
        remark: options.revisionReason || options.remark || null,
      };

      const response = await fetch(`${API_URL}/reports/${reportId}/oe-action`, {
        method: "PUT",
        headers:  { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (! response.ok) {
        throw new Error(data.message || "Failed to process action");
      }

      // Remove from list after action
      setReports((prev) => prev.filter((r) => r._id !== reportId));

      const messages = {
        approve: "Report approved and sent to Resident Engineer",
        revision: "Report sent back for revision",
        refer: "Report referred to selected department(s)",
      };

      alert(messages[actionType] || "Action completed successfully!");
    } catch (err) {
      console.error("Error processing action:", err);
      alert(err.message || "Failed to process action");
      throw err;
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout(navigate);
  }, [navigate]);

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
      {/* Header */}
      <div className="bg-stone-900 text-white p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-wider mb-2">
                OE VERIFICATION
              </h1>
              <p className="text-stone-400 font-light">
                Review and verify department actions • Reports Under Review
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchReports(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                REFRESH
              </button>
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
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-light">{error}</p>
            <button
              onClick={() => fetchReports()}
              className="ml-auto text-red-800 underline text-sm font-light"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-8 pr-4 py-3 bg-white border border-stone-200 text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              UNDER REVIEW
            </p>
            <p className="text-3xl font-light text-stone-800">{stats.total}</p>
          </div>
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              WITH DEPT. ACTION
            </p>
            <p className="text-3xl font-light text-stone-800">
              {stats.withAction}
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-xs text-stone-500 font-light tracking-wide mb-1">
              AWAITING ACTION
            </p>
            <p className="text-3xl font-light text-stone-800">
              {stats.pendingAction}
            </p>
          </div>
        </div>

        {/* Reports Count */}
        <p className="text-sm text-stone-500 font-light mb-4">
          {filteredReports.length} report
          {filteredReports.length !== 1 ?  "s" : ""} under review
        </p>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ?  (
            <div className="bg-white border border-stone-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-400 font-light">
                No reports pending OE verification
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
          onAction={handleAction}
          onAddRemark={handleAddRemark}
        />
      )}
    </div>
  );
}