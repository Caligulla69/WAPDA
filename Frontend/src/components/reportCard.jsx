import React from 'react';
import { FileText, Clock, User, ChevronRight, AlertCircle, CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react';

export default function ReportCard({ report, onClick }) {
  const getStatusConfig = (status) => {
    const configs = {
      'Closed': { 
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200', 
        icon: CheckCircle,
        label: 'CLOSED'
      },
      'Rejected': { 
        color: 'bg-rose-50 text-rose-800 border-rose-200', 
        icon: XCircle,
        label: 'REJECTED'
      },
      'Pending': { 
        color: 'bg-amber-50 text-amber-800 border-amber-200', 
        icon: AlertCircle,
        label: 'PENDING'
      },
      'Needs Revision': { 
        color: 'bg-orange-50 text-orange-800 border-orange-200', 
        icon: RefreshCw,
        label: 'NEEDS REVISION'
      },
      'Under Review': { 
        color: 'bg-violet-50 text-violet-800 border-violet-200', 
        icon: Eye,
        label: 'UNDER REVIEW'
      }
    };
    return configs[status] || { 
      color: 'bg-blue-50 text-blue-800 border-blue-200', 
      icon: FileText,
      label: status?.toUpperCase() || 'OPEN'
    };
  };

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;
  
  // Handle department display safely
  const department = report.referTo || report.department || 'N/A';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-50 border border-stone-200 group-hover:bg-stone-100 transition-colors">
              <FileText className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <h3 className="font-light text-stone-800 text-lg tracking-wide">
                {report.serialNo}
              </h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">{department} Department</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 text-xs font-light border ${statusConfig.color} flex items-center gap-1.5`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </span>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Apparatus Section */}
        <div className="mb-4 pb-4 border-b border-stone-100">
          <p className="text-xs text-stone-500 font-light tracking-wide mb-1">APPARATUS AFFECTED</p>
          <p className="text-stone-800 font-light">{report.apparatus}</p>
        </div>

        {/* Description */}
        <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2">
          {report.description}
        </p>

        {/* Footer Metadata */}
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
}