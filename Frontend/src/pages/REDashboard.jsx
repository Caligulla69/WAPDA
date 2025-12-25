import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  Send,
  Building2,
  Loader2,
  Check,
  RotateCcw,
  Bell,
  Volume2,
  VolumeX,
  ArrowRight,
} from "lucide-react";
import API_URL from "../../utils/api";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

// ============================================
// Constants
// ============================================
const STATUS_CONFIGS = {
  Closed: {
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle,
    label: "CLOSED",
    dot: "bg-emerald-500",
  },
  Rejected: {
    color: "bg-rose-50 text-rose-800 border-rose-200",
    icon: XCircle,
    label: "REJECTED",
    dot: "bg-rose-500",
  },
  Pending: {
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: AlertCircle,
    label: "PENDING",
    dot: "bg-amber-500",
  },
  "Needs Revision": {
    color: "bg-orange-50 text-orange-800 border-orange-200",
    icon: RefreshCw,
    label: "NEEDS REVISION",
    dot: "bg-orange-500",
  },
  "Under Review": {
    color: "bg-violet-50 text-violet-800 border-violet-200",
    icon: Eye,
    label: "UNDER REVIEW",
    dot: "bg-violet-500",
  },
};

const getStatusConfig = (status) =>
  STATUS_CONFIGS[status] || {
    color: "bg-blue-50 text-blue-800 border-blue-200",
    icon: FileText,
    label: status?.toUpperCase() || "OPEN",
    dot: "bg-blue-500",
  };

const MEANS_ICONS = {
  telephone: Phone,
  email: Mail,
  radio: Radio,
  "in person": Users,
};

// ============================================
// Notification Sound Hook
// ============================================
const useNotificationSound = () => {
  const audioContextRef = useRef(null);
  const isMutedRef = useRef(false);
  const [isMuted, setIsMutedState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reNotificationMuted");
    const muted = saved === "true";
    isMutedRef.current = muted;
    setIsMutedState(muted);
  }, []);

  const playNotificationSound = useCallback(() => {
    if (isMutedRef.current) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const now = audioContext.currentTime;

      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.frequency.setValueAtTime(880, now);
      osc1.type = "sine";
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.start(now);
      osc1.stop(now + 0.4);

      setTimeout(() => {
        if (audioContextRef.current) {
          const ctx = audioContextRef.current;
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(1100, ctx.currentTime);
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
    isMutedRef.current = newValue;
    localStorage.setItem("reNotificationMuted", String(newValue));
    setIsMutedState(newValue);
  }, []);

  return { playNotificationSound, isMuted, toggleMute };
};

// ============================================
// Notification Toast Component
// ============================================
const NotificationToast = React.memo(
  ({ notifications, onDismiss, onDismissAll, onViewReport }) => {
    if (notifications.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
        {notifications.slice(0, 3).map((notification, index) => (
          <div
            key={notification.id}
            className="bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden pointer-events-auto"
            style={{
              animation: "slideIn 0.3s ease-out forwards",
              animationDelay: `${index * 50}ms`,
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
                        {notification.type === "pending"
                          ? "Report Ready for Review"
                          : "New Report Activity"}
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
                style={{ animation: "shrink 5s linear forwards" }}
              />
            </div>
          </div>
        ))}

        {notifications.length > 3 && (
          <div className="bg-stone-800 text-white text-xs text-center py-2 px-4 rounded-lg pointer-events-auto">
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
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      </div>
    );
  }
);

// ============================================
// Notification Bell Component
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

  const handleMuteClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleMute();
    },
    [onToggleMute]
  );

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
          count > 0 ? "bg-stone-800" : "bg-transparent"
        }`}
        style={{ animation: isShaking ? "bellShake 0.6s ease-in-out" : "none" }}
      >
        <Bell
          className={`w-4 h-4 ${count > 0 ? "text-white" : "text-stone-400"}`}
        />

        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-medium flex items-center justify-center px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}

        <style>{`
          @keyframes bellShake {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-12deg); }
            30% { transform:  rotate(12deg); }
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
// Stat Card Component
// ============================================
const StatCard = React.memo(
  ({ icon: Icon, count, label, color, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`p-4 transition-all duration-200 text-left w-full ${
        isActive
          ? "bg-stone-900 text-white shadow-lg scale-[1.02]"
          : "bg-white border border-stone-200 hover:border-stone-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-9 h-9 flex items-center justify-center ${
            isActive ? "bg-white/10" : "bg-stone-100"
          }`}
        >
          <Icon className={`w-5 h-5 ${isActive ? "text-white" : color}`} />
        </div>
        {isActive && <Check className="w-4 h-4 text-white/60" />}
      </div>
      <p className="text-2xl font-light">{count}</p>
      <p
        className={`text-xs font-light mt-1 ${
          isActive ? "text-stone-400" : "text-stone-500"
        }`}
      >
        {label}
      </p>
    </button>
  )
);

// ============================================
// Status Badge Component
// ============================================
const StatusBadge = React.memo(({ status, size = "default" }) => {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  const sizeClasses =
    size === "small"
      ? "px-2 py-1 text-xs gap-1"
      : "px-3 py-1.5 text-xs gap-1.5";

  return (
    <span
      className={`font-light border ${config.color} flex items-center ${sizeClasses}`}
    >
      <StatusIcon className={size === "small" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
});

// ============================================
// Report Card Component - Updated with Forward Button
// ============================================
const ReportCard = React.memo(({ report, onClick, isNew, onQuickForward }) => {
  const departments = useMemo(
    () => (Array.isArray(report.referTo) ? report.referTo : [report.referTo]),
    [report.referTo]
  );

  // Check if report can be forwarded to OE
  const canForwardToOE = useMemo(() => {
    const hasDeptAction = Boolean(report.departmentAction);
    const isAtDepartment = report.currentStage === "Resident Engineer";
    const isNotClosed = report.status !== "Closed";
    const isNotRejected = report.status !== "Rejected";

    return hasDeptAction && isAtDepartment && isNotClosed && isNotRejected;
  }, [report.departmentAction, report.currentStage, report.status]);

  const statusConfig = getStatusConfig(report.status);

  const handleForwardClick = (e) => {
    e.stopPropagation();
    onQuickForward(report);
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border hover:border-stone-300 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden ${
        isNew ? "border-amber-300 shadow-sm" : "border-stone-200"
      }`}
    >
      {isNew && (
        <div className="bg-amber-500 text-white text-xs font-light tracking-wider px-3 py-1 text-center">
          NEW - READY FOR REVIEW
        </div>
      )}
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-stone-100 flex items-center justify-center flex-shrink-0 group-hover:bg-stone-200 transition-colors">
              <FileText className="w-5 h-5 text-stone-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-stone-800 text-base md:text-lg tracking-wide truncate">
                {report.serialNo}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                <span className="text-xs text-stone-500 font-light">
                  {report.currentStage}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={report.status} size="small" />
            <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>

        {/* Departments */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {departments.slice(0, 3).map((dept, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-light"
            >
              <Building2 className="w-3 h-3" />
              {dept}
            </span>
          ))}
          {departments.length > 3 && (
            <span className="text-xs text-stone-400 py-1 px-1">
              +{departments.length - 3} more
            </span>
          )}
        </div>

        {/* Apparatus */}
        <div className="mb-3 pb-3 border-b border-stone-100">
          <p className="text-xs text-stone-400 font-light tracking-wide mb-1">
            APPARATUS
          </p>
          <p className="text-stone-800 font-light text-sm">
            {report.apparatus}
          </p>
        </div>

        {/* Description */}
        <p className="text-stone-600 font-light leading-relaxed text-sm line-clamp-2 mb-4">
          {report.description}
        </p>

        {/* Department Action Badge */}
        {report.departmentAction && (
          <div className="mb-4 p-3 bg-emerald-50/70 border-l-4 border-emerald-400">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <p className="text-xs text-emerald-700 font-medium tracking-wide">
                DEPARTMENT ACTION COMPLETED
              </p>
            </div>
            <p className="text-stone-700 font-light text-xs line-clamp-1 pl-5">
              {report.departmentAction}
            </p>
          </div>
        )}

        {/* Forward to OE Button - Shows directly on card */}
        {canForwardToOE && (
          <div className="mb-4">
            <button
              onClick={handleForwardClick}
              className="w-full px-4 py-3 bg-stone-900 hover: bg-stone-700 rounded-md text-white font-light text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              FORWARD TO OE DEPARTMENT
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 font-light pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(report.date).toLocaleDateString()}</span>
          </div>
          {report.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{report.time}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{report.notifiedBy}</span>
          </div>
          {report.remarks?.length > 0 && (
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{report.remarks.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ============================================
// Remarks Section Component
// ============================================
const RemarksSection = React.memo(
  ({ remarks = [], onAddRemark, isSubmitting }) => {
    const [remarkText, setRemarkText] = useState("");

    const handleSubmit = useCallback(async () => {
      if (!remarkText.trim()) return;
      await onAddRemark(remarkText);
      setRemarkText("");
    }, [remarkText, onAddRemark]);

    const getRemarkStyle = useCallback((text) => {
      const lowerText = text?.toLowerCase() || "";
      if (
        lowerText.includes("rejected") ||
        lowerText.includes("revision") ||
        lowerText.includes("sent back")
      ) {
        return {
          border: "border-l-orange-400",
          bg: "bg-orange-50/50",
          accent: "text-orange-600",
        };
      }
      if (
        lowerText.includes("closed") ||
        lowerText.includes("approved") ||
        lowerText.includes("verified")
      ) {
        return {
          border: "border-l-emerald-400",
          bg: "bg-emerald-50/50",
          accent: "text-emerald-600",
        };
      }
      if (lowerText.includes("forwarded") || lowerText.includes("oe")) {
        return {
          border: "border-l-blue-400",
          bg: "bg-blue-50/50",
          accent: "text-blue-600",
        };
      }
      return {
        border: "border-l-stone-300",
        bg: "bg-stone-50/50",
        accent: "text-stone-500",
      };
    }, []);

    return (
      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center justify-between">
            <label className="text-sm font-light text-stone-700 tracking-wide flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              REMARKS & UPDATES
            </label>
            <span className="text-xs text-stone-400 font-light px-2 py-0.5 bg-white">
              {remarks.length} {remarks.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
          {remarks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-stone-300" />
              </div>
              <p className="text-stone-400 font-light text-sm">
                No remarks yet
              </p>
            </div>
          ) : (
            remarks.map((remark, idx) => {
              const style = getRemarkStyle(remark.text);
              return (
                <div
                  key={idx}
                  className={`p-4 border-l-4 ${style.border} ${style.bg}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-stone-200 flex items-center justify-center">
                      <User className={`w-3.5 h-3.5 ${style.accent}`} />
                    </div>
                    <span className="text-sm font-medium text-stone-800">
                      {remark.user}
                    </span>
                    <span className="text-xs text-stone-400 font-light">
                      {remark.timestamp
                        ? new Date(remark.timestamp).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 font-light pl-9 whitespace-pre-wrap">
                    {remark.text}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Add a remark..."
              className="flex-1 px-4 py-2.5 bg-white border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus: outline-none transition-colors font-light"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !remarkText.trim()}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// ============================================
// Forward to OE Modal Component
// ============================================
const ForwardToOEModal = React.memo(
  ({ isOpen, onClose, onConfirm, isProcessing, report }) => {
    const [remark, setRemark] = useState("");

    useEffect(() => {
      if (isOpen) setRemark("");
    }, [isOpen]);

    if (!isOpen || !report) return null;

    return (
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-stone-900 text-white p-5 flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-500/20 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-light tracking-wide">
                Forward to OE Department
              </h4>
              <p className="text-stone-400 text-sm font-light">
                {report.serialNo}
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Forward for OE Verification
                  </p>
                  <p className="text-sm text-blue-700 font-light">
                    This report will be sent to the OE Department for
                    verification.The current stage will be updated to "OE
                    Department" and status will be set to "Under Review".
                  </p>
                </div>
              </div>
            </div>

            {/* Department Action Summary */}
            {report.departmentAction && (
              <div className="bg-emerald-50 border border-emerald-200 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-emerald-900 mb-1 tracking-wide">
                      DEPARTMENT ACTION COMPLETED
                    </p>
                    <p className="text-sm text-emerald-800 font-light">
                      {report.departmentAction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Stage Info */}
            <div className="bg-stone-50 border border-stone-200 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-stone-500 font-light mb-1">
                    CURRENT STAGE
                  </p>
                  <p className="text-stone-800 font-medium">
                    {report.currentStage}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-light mb-1">
                    WILL CHANGE TO
                  </p>
                  <p className="text-blue-700 font-medium">OE Department</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-500 font-light mb-2 tracking-wide">
                ADD REMARK (OPTIONAL)
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add any comments or instructions for OE Department..."
                rows="3"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 text-sm placeholder-stone-400 font-light focus:border-stone-400 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="p-5 border-t border-stone-100 flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-light text-sm tracking-wide transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={() => onConfirm(remark)}
              disabled={isProcessing}
              className="flex-1 px-5 py-3 bg-stone-900 hover: bg-stone-700  text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  FORWARD TO OE
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// ============================================
// Action Confirmation Modal
// ============================================
const ActionConfirmModal = React.memo(
  ({ isOpen, onClose, onConfirm, action, isProcessing }) => {
    if (!isOpen) return null;

    const configs = {
      close: {
        title: "Close Report",
        message: "This report will be marked as closed and completed.",
        icon: CheckCircle,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      },
      reject: {
        title: "Reject Report",
        message: "This report will be marked as rejected.",
        icon: XCircle,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        buttonColor: "bg-rose-600 hover:bg-rose-700",
      },
    };

    const config = configs[action];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white max-w-sm w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <div
              className={`w-16 h-16 ${config.iconBg} flex items-center justify-center mx-auto mb-4`}
            >
              <Icon className={`w-8 h-8 ${config.iconColor}`} />
            </div>
            <h4 className="text-lg font-medium text-stone-800 mb-2">
              {config.title}
            </h4>
            <p className="text-sm text-stone-500 font-light">
              {config.message}
            </p>
          </div>

          <div className="p-4 border-t border-stone-100 flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 bg-stone-100 hover: bg-stone-200 text-stone-700 font-light text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`flex-1 px-4 py-2.5 text-white font-light text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${config.buttonColor}`}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// ============================================
// Report Detail Modal
// ============================================
const ReportDetailModal = React.memo(
  ({ report, onClose, onAction, onAddRemark, onForwardToOE }) => {
    const [revisionReason, setRevisionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionType, setActionType] = useState("");
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState({
      open: false,
      action: null,
    });
    const [isForwarding, setIsForwarding] = useState(false);

    const departments = useMemo(
      () => (Array.isArray(report.referTo) ? report.referTo : [report.referTo]),
      [report.referTo]
    );

    // Check if report can be forwarded to OE
    const canForwardToOE = useMemo(() => {
      const hasDeptAction = Boolean(report.departmentAction);
      const isAtDepartment = report.currentStage === "Department";
      const isNotClosed = report.status !== "Closed";
      const isNotRejected = report.status !== "Rejected";

      console.log("Forward to OE Check:", {
        hasDeptAction,
        isAtDepartment,
        currentStage: report.currentStage,
        isNotClosed,
        isNotRejected,
        canForward:
          hasDeptAction && isAtDepartment && isNotClosed && isNotRejected,
      });

      return hasDeptAction && isAtDepartment && isNotClosed && isNotRejected;
    }, [report.departmentAction, report.currentStage, report.status]);

    // Check if RE can take final action (only when report is at RE stage)
    const canTakeFinalAction = useMemo(
      () =>
        report.currentStage === "Resident Engineer" &&
        report.status !== "Closed" &&
        report.status !== "Rejected",
      [report.currentStage, report.status]
    );

    const handleAddRemark = useCallback(
      async (text) => {
        setIsSubmitting(true);
        await onAddRemark(report._id, text);
        setIsSubmitting(false);
      },
      [report._id, onAddRemark]
    );

    const handleAction = useCallback(
      async (type) => {
        if (type === "revision" && !revisionReason.trim()) {
          alert("Please provide a reason for sending back for revision");
          return;
        }
        setActionType(type);
        try {
          await onAction(report._id, type, revisionReason);
          onClose();
        } catch {
          // Error handled in parent
        } finally {
          setActionType("");
          setShowActionModal({ open: false, action: null });
        }
      },
      [report._id, revisionReason, onAction, onClose]
    );

    const handleForwardToOE = useCallback(
      async (remark) => {
        setIsForwarding(true);
        try {
          await onForwardToOE(report._id, remark);
          setShowForwardModal(false);
          onClose();
        } catch {
          // Error handled in parent
        } finally {
          setIsForwarding(false);
        }
      },
      [report._id, onForwardToOE, onClose]
    );

    const statusConfig = getStatusConfig(report.status);
    const StatusIcon = statusConfig.icon;
    const MeansIcon = MEANS_ICONS[report.means?.toLowerCase()] || Phone;

    return (
      <>
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="bg-stone-50 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-stone-900 text-white p-5 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-light tracking-wide">
                    {report.serialNo}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                    />
                    <span className="text-stone-400 text-sm font-light">
                      {report.currentStage}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`px-4 py-2 text-sm font-light border ${statusConfig.color} flex items-center gap-2`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {report.status?.toUpperCase()}
                </span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    icon: Calendar,
                    label: "DATE",
                    value: new Date(report.date).toLocaleDateString(),
                  },
                  { icon: Clock, label: "TIME", value: report.time || "N/A" },
                  {
                    icon: User,
                    label: "NOTIFIED BY",
                    value: report.notifiedBy,
                  },
                  {
                    icon: MeansIcon,
                    label: "MEANS",
                    value: report.means || "N/A",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-stone-200 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4 text-stone-400" />
                      <p className="text-xs text-stone-400 font-light tracking-wide">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm text-stone-800 font-light truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Departments */}
              <div className="bg-white border border-stone-200 p-5">
                <label className="block text-xs text-stone-400 font-light mb-3 tracking-wide">
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
              <div className="bg-white border border-stone-200 p-5">
                <label className="block text-xs text-stone-400 font-light mb-2 tracking-wide">
                  APPARATUS
                </label>
                <p className="text-sm text-stone-800 font-light">
                  {report.apparatus}
                </p>
              </div>

              {/* Description */}
              <div className="bg-white border border-stone-200 p-5">
                <label className="block text-xs text-stone-400 font-light mb-2 tracking-wide">
                  DESCRIPTION
                </label>
                <p className="text-sm text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              {/* Recommendation */}
              {report.recommendation && (
                <div className="bg-white border border-stone-200 p-5">
                  <label className="block text-xs text-stone-400 font-light mb-2 tracking-wide">
                    RECOMMENDATION
                  </label>
                  <p className="text-sm text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                    {report.recommendation}
                  </p>
                </div>
              )}

              {/* Operation Action */}
              {report.operationAction && (
                <div className="bg-white border border-stone-200 p-5">
                  <label className="block text-xs text-stone-400 font-light mb-2 tracking-wide">
                    OPERATION ACTION
                  </label>
                  <p className="text-sm text-stone-800 font-light leading-relaxed whitespace-pre-wrap">
                    {report.operationAction}
                  </p>
                </div>
              )}

              {/* Department Action */}
              {report.departmentAction && (
                <div className="bg-emerald-50 border border-emerald-200 p-5">
                  <label className="text-xs text-emerald-700 font-light mb-2 tracking-wide flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    DEPARTMENT ACTION COMPLETED
                  </label>
                  <p className="text-sm text-stone-800 font-light leading-relaxed whitespace-pre-wrap mt-2">
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

              {/* Forward to OE Section - Shows when department action is complete and stage is Department */}
              {canForwardToOE && (
                <div className="bg-blue-50 border border-blue-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Send className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Forward to OE Department
                      </h4>
                      <p className="text-sm text-blue-700 font-light mb-4">
                        The department has completed their action.You can now
                        forward this report to the OE Department for
                        verification before final review.
                      </p>
                      <button
                        onClick={() => setShowForwardModal(true)}
                        className="px-5 py-2.5 bg-blue-600 hover: bg-blue-700 text-white font-light text-sm tracking-wide transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        FORWARD TO OE DEPARTMENT
                      </button>
                    </div>
                  </div>
                </div>
              )}

              
              {/* Revision Section - Only for final review stage */}
              {canTakeFinalAction && (
                <div className="bg-orange-50 border border-orange-200 p-5">
                  <label className="text-xs text-orange-700 font-light mb-3 tracking-wide flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    REVISION REASON (Required for sending back)
                  </label>
                  <textarea
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    placeholder="Describe what needs to be revised..."
                    className="w-full px-4 py-3 border border-orange-200 bg-white text-sm text-stone-800 placeholder-stone-400 font-light focus:border-orange-400 focus: outline-none transition-colors resize-none"
                    rows="3"
                  />
                </div>
              )}

              {/* Final Actions - Only when report is at RE stage for final decision */}
              {canTakeFinalAction && (
                <div className="bg-white border border-stone-200 p-5">
                  <label className="block text-xs text-stone-400 font-light mb-4 tracking-wide">
                    FINAL DECISION
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        setShowActionModal({ open: true, action: "close" })
                      }
                      disabled={actionType !== ""}
                      className="px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-sm tracking-wide transition-colors disabled: opacity-50 flex flex-col items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>CLOSE</span>
                    </button>
                    <button
                      onClick={() =>
                        setShowActionModal({ open: true, action: "reject" })
                      }
                      disabled={actionType !== ""}
                      className="px-4 py-4 bg-rose-600 hover: bg-rose-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>REJECT</span>
                    </button>
                    <button
                      onClick={() => handleAction("revision")}
                      disabled={actionType !== "" || !revisionReason.trim()}
                      className="px-4 py-4 bg-orange-600 hover: bg-orange-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-2"
                    >
                      {actionType === "revision" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <RotateCcw className="w-5 h-5" />
                          <span>SEND BACK</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Completed Message */}
              {(report.status === "Closed" || report.status === "Rejected") && (
                <div className="bg-stone-100 border border-stone-200 p-5 text-center">
                  <p className="text-sm text-stone-600 font-light">
                    This report has been{" "}
                    <span className="font-medium">
                      {report.status.toLowerCase()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Forward to OE Modal */}
        <ForwardToOEModal
          isOpen={showForwardModal}
          onClose={() => setShowForwardModal(false)}
          onConfirm={handleForwardToOE}
          isProcessing={isForwarding}
          report={report}
        />

        {/* Action Confirmation Modal */}
        <ActionConfirmModal
          isOpen={showActionModal.open}
          onClose={() => setShowActionModal({ open: false, action: null })}
          onConfirm={() => handleAction(showActionModal.action)}
          action={showActionModal.action}
          isProcessing={actionType !== ""}
        />
      </>
    );
  }
);

// ============================================
// Main Dashboard Component
// ============================================
export default function ResidentEngineerDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Forward modal state for quick forward from card
  const [forwardModalReport, setForwardModalReport] = useState(null);
  const [isForwarding, setIsForwarding] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [newReportIds, setNewReportIds] = useState(new Set());
  const previousReportIdsRef = useRef(new Set());
  const previousPendingIdsRef = useRef(new Set());

  const navigate = useNavigate();
  const { playNotificationSound, isMuted, toggleMute } = useNotificationSound();

  // Check for new reports
  const checkForNewReports = useCallback(
    (newReports) => {
      const pendingReports = newReports.filter(
        (r) =>
          r.currentStage === "Resident Engineer" &&
          r.status !== "Closed" &&
          r.status !== "Rejected"
      );

      const currentPendingIds = new Set(pendingReports.map((r) => r._id));
      const previousPendingIds = previousPendingIdsRef.current;

      const newlyArrivedReports = pendingReports.filter((report) => {
        const isNew = !previousPendingIds.has(report._id);
        return isNew && previousPendingIds.size > 0;
      });

      if (newlyArrivedReports.length > 0) {
        playNotificationSound();

        const newNotifications = newlyArrivedReports.map((report) => ({
          id: `${report._id}-${Date.now()}`,
          report,
          type: "pending",
          timestamp: new Date(),
        }));

        setNotifications((prev) => [...newNotifications, ...prev]);

        setNewReportIds((prev) => {
          const updated = new Set(prev);
          newlyArrivedReports.forEach((r) => updated.add(r._id));
          return updated;
        });

        newNotifications.forEach((notification) => {
          setTimeout(() => {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            );
          }, 5000);
        });

        setTimeout(() => {
          setNewReportIds((prev) => {
            const updated = new Set(prev);
            newlyArrivedReports.forEach((r) => updated.delete(r._id));
            return updated;
          });
        }, 30000);
      }

      previousPendingIdsRef.current = currentPendingIds;
      previousReportIdsRef.current = new Set(newReports.map((r) => r._id));
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

  const fetchReports = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const response = await fetch(`${API_URL}/reports`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();

        console.log("Fetched reports:", data);

        if (isRefresh) {
          checkForNewReports(data);
        } else {
          const pendingReports = data.filter(
            (r) =>
              r.currentStage === "Resident Engineer" &&
              r.status !== "Closed" &&
              r.status !== "Rejected"
          );
          previousPendingIdsRef.current = new Set(
            pendingReports.map((r) => r._id)
          );
          previousReportIdsRef.current = new Set(data.map((r) => r._id));
        }

        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [checkForNewReports]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const interval = setInterval(() => fetchReports(true), 30000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  const handleLogout = useCallback(() => {
    logout(navigate);
  }, [navigate]);

  const categorizedReports = useMemo(
    () => ({
      all: reports,
      pendingReview: reports.filter(
        (r) =>
          r.currentStage === "Resident Engineer" &&
          r.status !== "Closed" &&
          r.status !== "Rejected"
      ),
      readyForOE: reports.filter(
        (r) =>
          r.departmentAction &&
          r.currentStage === "Department" &&
          r.status !== "Closed" &&
          r.status !== "Rejected"
      ),
      atOE: reports.filter(
        (r) =>
          r.currentStage === "OE Department" &&
          r.status !== "Closed" &&
          r.status !== "Rejected"
      ),
      closed: reports.filter((r) => r.status === "Closed"),
      rejected: reports.filter((r) => r.status === "Rejected"),
    }),
    [reports]
  );

  const displayReports = useMemo(() => {
    const baseReports = categorizedReports[filter] || categorizedReports.all;
    if (!searchTerm.trim()) return baseReports;

    const term = searchTerm.toLowerCase();
    return baseReports.filter(
      (r) =>
        r.serialNo?.toLowerCase().includes(term) ||
        r.apparatus?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        (Array.isArray(r.referTo) ? r.referTo.join(" ") : r.referTo)
          ?.toLowerCase()
          .includes(term)
    );
  }, [filter, searchTerm, categorizedReports]);

  const handleAddRemark = useCallback(
    async (reportId, text) => {
      try {
        const response = await fetch(`${API_URL}/reports/${reportId}/remarks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("Failed to add remark");
        const data = await response.json();
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? data.report : r))
        );
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(data.report);
        }
      } catch (err) {
        alert("Failed to add remark");
      }
    },
    [selectedReport]
  );

  const handleAction = useCallback(
    async (reportId, actionType, revisionReason) => {
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
        const data = await response.json();
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? data.report : r))
        );

        const messages = {
          close: "closed",
          reject: "rejected",
          revision: "sent back",
        };
        alert(`Report ${messages[actionType]} successfully! `);
      } catch (err) {
        alert(err.message);
        throw err;
      }
    },
    []
  );

  // Forward report to OE Department
  const handleForwardToOE = useCallback(async (reportId, remark) => {
    try {
      const response = await fetch(
        `${API_URL}/reports/${reportId}/forward-to-oe`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ remark }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to forward report to OE");
      }

      const data = await response.json();

      // Update reports list
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? data.report : r))
      );

      alert("Report forwarded to OE Department successfully!");
      return data.report;
    } catch (err) {
      alert(err.message || "Failed to forward report to OE Department");
      throw err;
    }
  }, []);

  // Handle quick forward from card
  const handleQuickForward = useCallback((report) => {
    setForwardModalReport(report);
  }, []);

  // Confirm quick forward
  const handleConfirmQuickForward = useCallback(
    async (remark) => {
      if (!forwardModalReport) return;

      setIsForwarding(true);
      try {
        await handleForwardToOE(forwardModalReport._id, remark);
        setForwardModalReport(null);
      } catch {
        // Error already handled
      } finally {
        setIsForwarding(false);
      }
    },
    [forwardModalReport, handleForwardToOE]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-stone-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-light">Loading reports...</p>
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
      <header className="bg-stone-900 text-white p-5 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-light tracking-wider mb-1">
              RESIDENT ENGINEER
            </h1>
            <p className="text-stone-400 font-light text-sm">
              Review, forward, close, or reject reports
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
              onClick={() => fetchReports(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">REFRESH</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-transparent hover:bg-stone-800 transition-colors border border-stone-700 text-sm font-light tracking-wide"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm: inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {error ? (
          <div className="bg-rose-50 border border-rose-200 p-8 text-center">
            <div className="w-14 h-14 bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-rose-500" />
            </div>
            <p className="text-rose-800 font-light mb-4">{error}</p>
            <button
              onClick={() => fetchReports()}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-light text-sm transition-colors"
            >
              RETRY
            </button>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              <StatCard
                icon={FileText}
                count={categorizedReports.all.length}
                label="Total"
                color="text-stone-600"
                isActive={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <StatCard
                icon={AlertCircle}
                count={categorizedReports.pendingReview.length}
                label="Pending"
                color="text-amber-600"
                isActive={filter === "pendingReview"}
                onClick={() => setFilter("pendingReview")}
              />
              <StatCard
                icon={Send}
                count={categorizedReports.readyForOE.length}
                label="Ready OE"
                color="text-blue-600"
                isActive={filter === "readyForOE"}
                onClick={() => setFilter("readyForOE")}
              />
              <StatCard
                icon={Eye}
                count={categorizedReports.atOE.length}
                label="At OE"
                color="text-violet-600"
                isActive={filter === "atOE"}
                onClick={() => setFilter("atOE")}
              />
              <StatCard
                icon={CheckCircle}
                count={categorizedReports.closed.length}
                label="Closed"
                color="text-emerald-600"
                isActive={filter === "closed"}
                onClick={() => setFilter("closed")}
              />
              <StatCard
                icon={XCircle}
                count={categorizedReports.rejected.length}
                label="Rejected"
                color="text-rose-600"
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by serial no, apparatus, description..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:outline-none transition-colors font-light"
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

            {/* Count */}
            <p className="text-sm text-stone-500 font-light mb-4">
              Showing {displayReports.length} report
              {displayReports.length !== 1 ? "s" : ""}
            </p>

            {/* Reports List */}
            {displayReports.length === 0 ? (
              <div className="bg-white border border-stone-200 p-12 text-center">
                <div className="w-16 h-16 bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-stone-300" />
                </div>
                <p className="text-stone-500 font-light">No reports found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayReports.map((report) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                    isNew={newReportIds.has(report._id)}
                    onClick={() => setSelectedReport(report)}
                    onQuickForward={handleQuickForward}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAction={handleAction}
          onAddRemark={handleAddRemark}
          onForwardToOE={handleForwardToOE}
        />
      )}

      {/* Quick Forward Modal (from card button) */}
      <ForwardToOEModal
        isOpen={Boolean(forwardModalReport)}
        onClose={() => setForwardModalReport(null)}
        onConfirm={handleConfirmQuickForward}
        isProcessing={isForwarding}
        report={forwardModalReport}
      />
    </div>
  );
}
