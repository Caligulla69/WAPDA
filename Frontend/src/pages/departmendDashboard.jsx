import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  Loader2,
  LogOut,
  Building2,
  Calendar,
  Bell,
  Volume2,
  VolumeX,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

// ============================================
// Notification Sound Hook - Fixed to prevent re-renders
// ============================================
const useNotificationSound = () => {
  const audioContextRef = useRef(null);
  const isMutedRef = useRef(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("notificationMuted") === "true";
    }
    return false;
  });
  const [isMuted, setIsMutedState] = useState(isMutedRef.current);

  // Initialize muted state from localStorage only once
  useEffect(() => {
    const saved = localStorage.getItem("notificationMuted");
    const muted = saved === "true";
    isMutedRef.current = muted;
    setIsMutedState(muted);
  }, []);

  const playNotificationSound = useCallback(() => {
    if (isMutedRef.current) return;

    try {
      if (! audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef. current;

      if (audioContext.state === "suspended") {
        audioContext. resume();
      }

      const now = audioContext.currentTime;

      // First bell tone
      const osc1 = audioContext. createOscillator();
      const gain1 = audioContext. createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext. destination);
      osc1.frequency. setValueAtTime(830, now);
      osc1.type = "sine";
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain. exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Second bell tone
      setTimeout(() => {
        if (audioContextRef.current) {
          const ctx = audioContextRef. current;
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx. destination);
          osc2.frequency. setValueAtTime(1046, ctx.currentTime);
          osc2.type = "sine";
          gain2.gain.setValueAtTime(0.15, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 0.3);
        }
      }, 120);
    } catch (error) {
      console.log("Audio playback failed:", error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newValue = !isMutedRef.current;
    isMutedRef. current = newValue;
    localStorage.setItem("notificationMuted", String(newValue));
    setIsMutedState(newValue);
  }, []);

  return { playNotificationSound, isMuted, toggleMute };
};

// ============================================
// Notification Toast Component
// ============================================
const NotificationToast = React.memo(({ notifications, onDismiss, onDismissAll, onViewReport }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      {notifications. slice(0, 3).map((notification, index) => (
        <div
          key={notification.id}
          className="bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden pointer-events-auto"
          style={{
            animation: "slideIn 0.3s ease-out forwards",
            animationDelay:  `${index * 50}ms`,
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-light text-stone-800">
                      New Report Assigned
                    </p>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      {notification.report.serialNo}
                    </p>
                  </div>
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-stone-500 font-light mt-2 line-clamp-1">
                  {notification.report.apparatus}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      onViewReport(notification.report);
                      onDismiss(notification.id);
                    }}
                    className="px-3 py-1.5 bg-stone-900 text-white text-xs font-light hover:bg-stone-800 transition-colors"
                  >
                    VIEW
                  </button>
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="px-3 py-1.5 text-stone-500 text-xs font-light hover:bg-stone-100 transition-colors"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-stone-100">
            <div
              className="h-full bg-stone-400"
              style={{
                animation: "shrink 5s linear forwards",
              }}
            />
          </div>
        </div>
      ))}

      {notifications.length > 3 && (
        <div className="bg-stone-800 text-white text-xs text-center py-2 px-4 pointer-events-auto">
          +{notifications.length - 3} more notifications
        </div>
      )}

      {notifications.length > 1 && (
        <button
          onClick={onDismissAll}
          className="w-full py-2 text-xs text-stone-500 hover:text-stone-700 transition-colors pointer-events-auto"
        >
          Dismiss all
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform:  translateX(0);
          }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
});

// ============================================
// Notification Bell Component - Fixed to prevent re-renders
// ============================================
const NotificationBell = React.memo(({ count, isMuted, onToggleMute }) => {
  const [isShaking, setIsShaking] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = count;
  }, [count]);

  const handleMuteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleMute();
  }, [onToggleMute]);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleMuteClick}
        className="p-2 hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-700"
        title={isMuted ? "Unmute notifications" : "Mute notifications"}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-stone-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-stone-400" />
        )}
      </button>

      <div
        className={`relative p-2.5 border border-stone-700 ${
          count > 0 ? "bg-stone-800" :  "bg-transparent"
        }`}
        style={{
          animation: isShaking ? "bellShake 0.6s ease-in-out" : "none",
        }}
      >
        <Bell className={`w-4 h-4 ${count > 0 ?  "text-white" : "text-stone-400"}`} />

        {count > 0 && (
          <span className="absolute -top-1. 5 -right-1.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-medium flex items-center justify-center px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}

        <style>{`
          @keyframes bellShake {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-12deg); }
            30% { transform: rotate(12deg); }
            45% { transform: rotate(-8deg); }
            60% { transform:  rotate(8deg); }
            75% { transform: rotate(-4deg); }
            90% { transform: rotate(4deg); }
          }
        `}</style>
      </div>
    </div>
  );
});

// ============================================
// Report Card Component
// ============================================
const ReportCard = React.memo(({ report, onClick, userDepartment, isNew }) => {
  const statusConfig = {
    Pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dotColor: "bg-amber-400",
    },
    "Under Review": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      dotColor: "bg-blue-400",
    },
    "Needs Revision": {
      color: "bg-orange-50 text-orange-700 border-orange-200",
      dotColor:  "bg-orange-400",
    },
    Closed: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-400",
    },
    Rejected: {
      color: "bg-red-50 text-red-700 border-red-200",
      dotColor:  "bg-red-400",
    },
  };

  const config = statusConfig[report.status] || statusConfig. Pending;

  const departments = Array.isArray(report.referTo)
    ? report. referTo
    : [report. referTo];

  return (
    <div
      onClick={onClick}
      className={`bg-white border hover:border-stone-300 hover:shadow-sm transition-all duration-300 cursor-pointer group overflow-hidden ${
        isNew ? "border-amber-300 shadow-sm" : "border-stone-200"
      }`}
    >
      {isNew && (
        <div className="bg-amber-500 text-white text-xs font-light tracking-wider px-3 py-1 text-center">
          NEW REPORT ASSIGNED
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-medium text-stone-800 text-base sm:text-lg tracking-wide">
                {report.serialNo}
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-medium border ${config.color} flex items-center gap-1.5 whitespace-nowrap`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config. dotColor}`} />
                {report. status. toUpperCase()}
              </span>
            </div>
            <p className="text-stone-500 text-sm font-light truncate">
              {report.apparatus}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-3" />
        </div>

        <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2 text-sm sm:text-base">
          {report. description}
        </p>

        <div className="flex flex-wrap gap-1. 5 mb-4">
          {departments. map((dept, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-light ${
                dept === userDepartment
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              <Building2 className="w-3 h-3" />
              {dept}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-500 font-light border-t border-stone-100 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3. 5 h-3.5 flex-shrink-0 text-stone-400" />
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
});

// ============================================
// Report Detail Component
// ============================================
const ReportDetail = React.memo(({ report, onClose, onAddRemark, onSendToOE, user }) => {
  const [remarkText, setRemarkText] = useState("");
  const [departmentAction, setDepartmentAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingToOE, setIsSendingToOE] = useState(false);

  const departments = Array.isArray(report.referTo)
    ? report.referTo
    : [report.referTo];

  const handleAddRemark = async () => {
    if (! remarkText.trim()) return;
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

  const canSendToOE =
    report.currentStage === "Department" &&
    report.status !== "Closed" &&
    report.status !== "Rejected";

  const wasSentBackForRevision =
    report.status === "Rejected" && report.currentStage === "Department";

  const departmentActionHistory = report.remarks
    ?.filter(
      (r) =>
        r. text.includes("Department action submitted:  ") ||
        r.text.includes("Report rejected by OE")
    )
    .map((r) => ({
      ...r,
      actionText: r.text
        .replace("Department action submitted:  ", "")
        .split(".  Report")[0],
      wasRejected: r.text.includes("Report rejected by OE"),
    }));

  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex justify-between items-center">
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-lg sm:text-2xl font-light tracking-wide truncate">
              {report.serialNo}
            </h3>
            <p className="text-stone-400 font-light text-xs sm:text-sm mt-1">
              Stage: {report.currentStage}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* Status Alert */}
          {wasSentBackForRevision && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900 mb-1">
                    Report Sent Back for Revision
                  </p>
                  <p className="text-xs sm:text-sm text-orange-800 font-light">
                    Please review the feedback below, update your action, and resubmit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Status", value: report. status },
              { label: "Current Stage", value: report.currentStage },
              { label:  "Reported By", value: report.notifiedBy },
              { label: "Date", value: report. date },
              { label: "Time", value: report.time },
              { label: "Means", value: report. means },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-4">
                <label className="block text-xs font-medium text-stone-500 mb-2 tracking-wider uppercase">
                  {item.label}
                </label>
                <p className="text-stone-800 font-light text-sm truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Referred Departments */}
          <div className="bg-white border border-stone-200 p-5">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Referred Departments
            </label>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1. 5 px-3 py-1.5 text-sm font-light border ${
                    dept === user?. department
                      ?  "bg-stone-800 text-white border-stone-800"
                      :  "bg-stone-100 text-stone-700 border-stone-200"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {dept}
                  {dept === user?. department && (
                    <span className="text-xs opacity-75">(You)</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Apparatus */}
          <div className="bg-white border border-stone-200 p-5">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Apparatus Affected
            </label>
            <p className="text-stone-800 font-light text-sm break-words">
              {report.apparatus}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 p-5">
            <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              Problem Description
            </label>
            <p className="text-stone-800 font-light leading-relaxed text-sm break-words">
              {report.description}
            </p>
          </div>

          {/* Recommendation */}
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-5">
              <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
                Recommendation
              </label>
              <p className="text-stone-800 font-light leading-relaxed text-sm break-words">
                {report. recommendation}
              </p>
            </div>
          )}

          {/* Operation Action */}
          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-5">
              <label className="block text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
                Operation Action Taken
              </label>
              <p className="text-stone-800 font-light leading-relaxed text-sm break-words">
                {report.operationAction}
              </p>
            </div>
          )}

          {/* Action History */}
          {departmentActionHistory && departmentActionHistory.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-5">
              <label className="block text-xs font-medium text-blue-900 mb-4 tracking-wider uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Previous Department Actions
              </label>
              <div className="space-y-4">
                {departmentActionHistory.map((action, idx) => (
                  <div
                    key={idx}
                    className={`border-l-2 pl-4 py-2 ${
                      action.wasRejected
                        ? "border-orange-400 bg-orange-50/50"
                        :  "border-blue-400"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
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

          {/* Department Action Section */}
          {report.departmentAction && ! canSendToOE ?  (
            <div className="bg-emerald-50 border border-emerald-200 p-5">
              <label className="block text-xs font-medium text-emerald-900 mb-3 tracking-wider uppercase flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Current Department Action (Submitted)
              </label>
              <p className="text-sm text-emerald-900 font-light leading-relaxed break-words">
                {report.departmentAction}
              </p>
            </div>
          ) : canSendToOE ?  (
            <div className="bg-amber-50 border border-amber-200 p-5">
              <label className="block text-xs font-medium text-amber-900 mb-3 tracking-wider uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {wasSentBackForRevision
                  ? "Update Department Action (Required)"
                  :  "Department Action Required"}
              </label>
              {wasSentBackForRevision && (
                <p className="text-xs text-amber-800 mb-3 font-light">
                  Please review the OE feedback and provide an updated action. 
                </p>
              )}
              <textarea
                value={departmentAction}
                onChange={(e) => setDepartmentAction(e.target. value)}
                placeholder={
                  wasSentBackForRevision
                    ? "Describe the revised action taken by your department..."
                    : "Describe the action taken by your department..."
                }
                rows={4}
                className="w-full px-4 py-3 bg-white border border-amber-200 text-sm text-stone-800 placeholder-stone-400 focus:border-amber-400 focus: outline-none transition-colors font-light resize-none"
              />
              <button
                onClick={handleSendToOE}
                disabled={isSendingToOE || ! departmentAction. trim()}
                className="mt-4 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSendingToOE ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {wasSentBackForRevision ? "RESUBMITTING..." : "SENDING... "}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    {wasSentBackForRevision
                      ? "RESUBMIT TO OE DEPARTMENT"
                      : "SUBMIT DEPARTMENT ACTION"}
                  </>
                )}
              </button>
            </div>
          ) : null}

          {/* Remarks */}
          <div className="bg-white border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 bg-stone-50">
              <label className="text-xs font-medium text-stone-500 tracking-wider uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Remarks & Updates
                <span className="ml-auto text-stone-400 font-normal">
                  {report.remarks?. length || 0} entries
                </span>
              </label>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-stone-100">
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
                      className={`p-4 border-l-2 ${
                        isOEFeedback
                          ? "border-l-orange-400 bg-orange-50/50"
                          : isDepartmentAction
                          ?  "border-l-blue-400 bg-blue-50/50"
                          : "border-l-stone-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1. 5">
                        <MessageSquare
                          className={`w-3.5 h-3.5 ${
                            isOEFeedback
                              ? "text-orange-600"
                              :  isDepartmentAction
                              ? "text-blue-600"
                              : "text-stone-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isOEFeedback
                              ? "text-orange-900"
                              : isDepartmentAction
                              ?  "text-blue-900"
                              : "text-stone-700"
                          }`}
                        >
                          {remark. user}
                        </span>
                        <span className="text-xs text-stone-400">
                          {new Date(remark.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-light break-words pl-5 ${
                          isOEFeedback
                            ?  "text-orange-800"
                            : isDepartmentAction
                            ? "text-blue-800"
                            :  "text-stone-600"
                        }`}
                      >
                        {remark.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                  <p className="text-stone-400 font-light text-sm">No remarks yet</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={remarkText}
                  onChange={(e) => setRemarkText(e. target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
                  placeholder="Add a remark or update..."
                  className="flex-1 px-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus: border-stone-400 focus:outline-none transition-colors font-light"
                />
                <button
                  onClick={handleAddRemark}
                  disabled={isSubmitting || !remarkText.trim()}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? "ADDING..." : "ADD REMARK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================
// Main Dashboard Component
// ============================================
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

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [newReportIds, setNewReportIds] = useState(new Set());
  const previousReportIdsRef = useRef(new Set());

  const navigate = useNavigate();
  const { playNotificationSound, isMuted, toggleMute } = useNotificationSound();

  // Check for new reports - stable reference
  const checkForNewReports = useCallback(
    (newReports, userDepartment) => {
      if (! userDepartment) return;

      const currentReportIds = new Set(newReports.map((r) => r._id));
      const previousIds = previousReportIdsRef.current;

      const newlyAddedReports = newReports.filter((report) => {
        const departments = Array.isArray(report.referTo)
          ? report. referTo
          :  [report.referTo];
        const isForDepartment = departments. includes(userDepartment);
        const isNew = !previousIds. has(report._id);

        return isForDepartment && isNew && previousIds.size > 0;
      });

      if (newlyAddedReports.length > 0) {
        playNotificationSound();

        const newNotifications = newlyAddedReports. map((report) => ({
          id: `${report._id}-${Date.now()}`,
          report,
          timestamp: new Date(),
        }));

        setNotifications((prev) => [...newNotifications, ...prev]);

        setNewReportIds((prev) => {
          const updated = new Set(prev);
          newlyAddedReports. forEach((r) => updated.add(r._id));
          return updated;
        });

        // Auto-dismiss after 5 seconds
        newNotifications.forEach((notification) => {
          setTimeout(() => {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            );
          }, 5000);
        });

        // Clear highlighting after 30 seconds
        setTimeout(() => {
          setNewReportIds((prev) => {
            const updated = new Set(prev);
            newlyAddedReports.forEach((r) => updated.delete(r._id));
            return updated;
          });
        }, 30000);
      }

      previousReportIdsRef.current = currentReportIds;
    },
    [playNotificationSound]
  );

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleViewReportFromNotification = useCallback((report) => {
    setSelectedReport(report);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch(`${API_URL}/userData`, {
          credentials: "include",
        });

        if (! userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || "Failed to fetch user info");
        }

        const userData = await userResponse.json();
        setUser(userData. user);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load data.  Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch reports - stable reference
  const fetchReports = useCallback(
    async (isBackgroundRefresh = false) => {
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

        if (isBackgroundRefresh && user) {
          checkForNewReports(data, user.department);
        } else if (!isBackgroundRefresh) {
          previousReportIdsRef.current = new Set(data.map((r) => r._id));
        }

        setReports(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        if (isBackgroundRefresh) {
          setIsRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [user, checkForNewReports]
  );

  // Initial fetch and polling
  useEffect(() => {
    if (user) {
      fetchReports();

      const intervalId = setInterval(() => {
        fetchReports(true);
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [user, fetchReports]);

  const handleSendToOE = useCallback(
    async (reportId, departmentAction) => {
      try {
        const response = await fetch(
          `${API_URL}/reports/${reportId}/department-action`,
          {
            method: "PUT",
            headers:  { "Content-Type":  "application/json" },
            credentials: "include",
            body: JSON. stringify({ departmentAction }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to send report to OE");
        }

        const data = await response.json();

        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? data. report : r))
        );

        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(data.report);
        }

        alert("Report successfully sent to OE Department for verification!");
      } catch (err) {
        alert(`Failed to send report:  ${err.message}`);
      }
    },
    [selectedReport]
  );

  const departmentReports = useMemo(() => {
    if (!user) return [];

    return reports.filter((r) => {
      const departments = Array.isArray(r.referTo) ? r.referTo : [r.referTo];
      const matchesDepartment = departments.includes(user. department);

      const departmentsStr = departments.join(" ");
      const matchesSearch =
        r.serialNo.toLowerCase().includes(searchTerm. toLowerCase()) ||
        r.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        departmentsStr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || r. status === statusFilter;

      return matchesDepartment && matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter, user]);

  const handleAddRemark = useCallback(
    async (reportId, text) => {
      try {
        const response = await fetch(`${API_URL}/reports/${reportId}/remarks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to add remark");
        }

        const data = await response.json();

        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? data.report :  r))
        );

        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(data.report);
        }
      } catch (err) {
        alert(err.message);
      }
    },
    [selectedReport]
  );

  const handleLogout = useCallback(() => {
    logout(navigate);
  }, [navigate]);

  const handleManualRefresh = useCallback(() => {
    fetchReports(true);
  }, [fetchReports]);

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

  if (! user) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-stone-600 font-light mb-4">
            Please log in to continue
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
        onDismissAll={dismissAllNotifications}
        onViewReport={handleViewReportFromNotification}
      />

      {/* Header */}
      <div className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider truncate">
                  {user.department}
                </h1>
              </div>
              <p className="text-stone-400 font-light text-sm">
                Department Dashboard
                {lastUpdated && (
                  <span className="ml-2 text-stone-500">
                    • Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <NotificationBell
                count={notifications.length}
                isMuted={isMuted}
                onToggleMute={toggleMute}
              />

              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 transition-all duration-200 border border-stone-700 text-sm font-light tracking-wide disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" :  ""}`}
                />
                <span className="hidden sm:inline">REFRESH</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent hover:bg-stone-800 transition-all duration-200 border border-stone-700 text-sm font-light tracking-wide text-stone-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm: inline">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-light text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: departmentReports.length },
            {
              label: "Pending",
              value: departmentReports.filter((r) => r.status === "Pending")
                .length,
            },
            {
              label:  "Under Review",
              value: departmentReports.filter((r) => r.status === "Under Review")
                .length,
            },
            {
              label: "Closed",
              value:  departmentReports. filter((r) => r.status === "Closed")
                .length,
            },
          ]. map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 p-5"
            >
              <p className="text-xs text-stone-500 font-medium tracking-wider uppercase mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-light text-stone-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by serial no, apparatus, description..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 focus:border-stone-400 focus:outline-none transition-colors font-light"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 pl-11 pr-4 py-3 bg-white border border-stone-200 text-stone-800 text-sm font-light focus:border-stone-400 focus:outline-none transition-colors appearance-none cursor-pointer"
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
            Showing{" "}
            <span className="font-medium text-stone-700">
              {departmentReports.length}
            </span>{" "}
            reports for{" "}
            <span className="font-medium text-stone-700">{user.department}</span>
          </p>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {departmentReports.length === 0 ?  (
            <div className="bg-white border border-stone-200 p-12 text-center">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 font-light mb-2">No reports found</p>
              <p className="text-stone-400 text-sm font-light">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : `Reports assigned to ${user.department} will appear here`}
              </p>
            </div>
          ) : (
            departmentReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                userDepartment={user.department}
                isNew={newReportIds.has(report._id)}
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
          user={user}
          onClose={() => setSelectedReport(null)}
          onAddRemark={handleAddRemark}
          onSendToOE={handleSendToOE}
        />
      )}
    </div>
  );
}