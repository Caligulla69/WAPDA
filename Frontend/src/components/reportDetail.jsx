import React, { useState } from "react";
import {
  X,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  Radio,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  FileText,
  Eye,
} from "lucide-react";

export default function ReportDetail({
  report,
  onClose,
  onAction,
  onAddRemark,
}) {
  const [remarkText, setRemarkText] = useState("");
  const [actionText, setActionText] = useState(report.departmentAction || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");
  const user = {
    id: 1,
    name: "John Doe",
    role: "department", // try "oe" or "shift_engineer" to test role-based rendering
    email: "john.doe@powergrid.com",
    phone: "+92 312 4567890",
  };
  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onAddRemark(report.id, remarkText);
    setRemarkText("");
    setIsSubmitting(false);
  };

  const handleAction = async (type) => {
    // Validation for department users
    if (user.role === "department" && type === "submit" && !actionText.trim()) {
      alert("Please describe the action taken by your department");
      return;
    }

    setActionType(type);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (user.role === "department") {
      onAction(report.id, type, actionText);
    } else {
      onAction(report.id, type);
    }

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
        icon: AlertCircle,
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
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 text-white p-6 flex justify-between items-center z-10">
          <div>
            <h3 className="text-2xl font-light tracking-wide">
              {report.serialNo}
            </h3>
            <p className="text-stone-400 font-light text-sm mt-1">
              Troubleshooting Report Details
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
          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={`px-4 py-2 text-sm font-light border ${statusConfig.color} flex items-center gap-2`}
            >
              <StatusIcon className="w-4 h-4" />
              {report.status?.toUpperCase() || "OPEN"}
            </span>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  DATE
                </p>
              </div>
              <p className="text-stone-800 font-light">
                {report.date || "N/A"}
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  TIME
                </p>
              </div>
              <p className="text-stone-800 font-light">
                {report.time || "N/A"}
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  NOTIFIED BY
                </p>
              </div>
              <p className="text-stone-800 font-light">
                {report.notifiedBy || "N/A"}
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MeansIcon className="w-4 h-4 text-stone-500" />
                <p className="text-xs text-stone-500 font-light tracking-wide">
                  MEANS
                </p>
              </div>
              <p className="text-stone-800 font-light">
                {report.means || "N/A"}
              </p>
            </div>
          </div>

          {/* Department Info */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
              REFERRED TO DEPARTMENT
            </label>
            <p className="text-stone-800 font-light text-lg">
              {report.referTo || "N/A"}
            </p>
          </div>

          {/* Apparatus */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
              APPARATUS AFFECTED
            </label>
            <p className="text-stone-800 font-light">
              {report.apparatus || "N/A"}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
              DESCRIPTION OF TROUBLE
            </label>
            <p className="text-stone-800 font-light leading-relaxed">
              {report.description || "No description provided"}
            </p>
          </div>

          {/* Recommendation */}
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                RECOMMENDATION
              </label>
              <p className="text-stone-800 font-light leading-relaxed">
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
              <p className="text-stone-800 font-light leading-relaxed">
                {report.operationAction}
              </p>
            </div>
          )}

          {/* Department Action - For Department Role */}
          {user.role === "department" && (
            <div className="bg-stone-50 border border-stone-300 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                <Wrench className="w-4 h-4 inline mr-2" />
                YOUR DEPARTMENT ACTION *
              </label>
              <textarea
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="Describe the action taken or planned by your department..."
                className="w-full px-4 py-3 border border-stone-300 text-stone-800 bg-white focus:border-stone-800 focus:outline-none transition-colors font-light resize-none"
                rows="4"
              />
              <p className="text-xs text-stone-500 font-light mt-2">
                This will be submitted to OE Department for verification
              </p>
            </div>
          )}

          {/* Department Action Display - For Other Roles */}
          {user.role !== "department" && report.departmentAction && (
            <div className="bg-stone-50 border border-stone-300 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">
                DEPARTMENT ACTION
              </label>
              <p className="text-stone-800 font-light leading-relaxed">
                {report.departmentAction}
              </p>
            </div>
          )}

          {/* Remarks Section */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              REMARKS & UPDATES
            </label>

            <div className="space-y-4 mb-6">
              {report.remarks && report.remarks.length > 0 ? (
                report.remarks.map((remark, idx) => (
                  <div key={idx} className="border-l-2 border-stone-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3.5 h-3.5 text-stone-500" />
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
                <p className="text-stone-400 font-light text-sm text-center py-4">
                  No remarks yet
                </p>
              )}
            </div>

            {/* Add Remark Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRemark()}
                placeholder="Add a remark or update..."
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

          {/* Action Buttons - Role Based */}
          {user.role === "department" && (
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
                SUBMIT FOR VERIFICATION
              </label>
              <button
                onClick={() => handleAction("submit")}
                disabled={actionType !== "" || !actionText.trim()}
                className="w-full px-6 py-4 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionType === "submit" ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    SUBMIT TO OE DEPARTMENT
                  </>
                )}
              </button>
              <p className="text-xs text-stone-500 font-light mt-3 text-center">
                Once submitted, this report will be sent to OE Department for
                final verification
              </p>
            </div>
          )}

          {user.role === "oe" && (
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">
                VERIFICATION ACTIONS
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAction("verify")}
                  disabled={actionType !== ""}
                  className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionType === "verify" ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      VERIFY & CLOSE
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionType !== ""}
                  className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionType === "reject" ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      REJECT
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {user.role === "shift_engineer" && (
            <div className="bg-white border border-stone-200 p-6">
              <p className="text-stone-500 font-light text-sm text-center">
                Report submitted to {report.referTo} Department for action
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
