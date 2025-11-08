import React, { useState, useMemo, useEffect } from 'react';
import { X, Clock, FileText, User, Calendar, Wrench, AlertCircle, CheckCircle, MessageSquare, Plus, ChevronRight, Search, Filter, Loader2, LogOut } from 'lucide-react';
import API_URL from '../../utils/api';
import { logout } from '../../utils/logout';
import { useNavigate } from "react-router-dom";


const ReportCard = ({ report, onClick }) => {
  const statusConfig = {
    Pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertCircle },
    'Under Review': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
    'Needs Revision': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle },
    Closed: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    Rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: X }
  };

  const config = statusConfig[report.status] || statusConfig.Pending;
  const StatusIcon = config.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-light text-stone-800 text-lg tracking-wide">{report.serialNo}</span>
              <span className={`px-3 py-1 text-xs font-light border ${config.color} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {report.status.toUpperCase()}
              </span>
            </div>
            <p className="text-stone-500 text-sm font-light">{report.apparatus}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all" />
        </div>
        
        <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2">
          {report.description}
        </p>
        
        <div className="flex items-center gap-6 text-xs text-stone-500 font-light border-t border-stone-100 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {report.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {report.time}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {report.notifiedBy}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetail = ({ report, onClose, onAddRemark, onUpdateStatus }) => {
  const [remarkText, setRemarkText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;
    setIsSubmitting(true);
    await onAddRemark(report._id, remarkText);
    setRemarkText('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-900 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-light tracking-wide">{report.serialNo}</h3>
          <button onClick={onClose} className="text-white hover:text-stone-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Update */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">STATUS</label>
            <select
              value={report.status}
              onChange={(e) => onUpdateStatus(report._id, e.target.value)}
              className="w-full p-3 border border-stone-300 bg-white text-stone-800 font-light focus:border-stone-800 focus:outline-none transition-colors"
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">DATE</label>
              <p className="text-stone-800 font-light">{report.date}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">TIME</label>
              <p className="text-stone-800 font-light">{report.time}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">NOTIFIED BY</label>
              <p className="text-stone-800 font-light">{report.notifiedBy}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">DEPARTMENT</label>
              <p className="text-stone-800 font-light">{report.referTo}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">CURRENT STAGE</label>
              <p className="text-stone-800 font-light">{report.currentStage}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">PRIORITY</label>
              <p className="text-stone-800 font-light">{report.priority || 'Medium'}</p>
            </div>
          </div>

          {/* Apparatus */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">APPARATUS AFFECTED</label>
            <p className="text-stone-800 font-light">{report.apparatus}</p>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">DESCRIPTION</label>
            <p className="text-stone-800 font-light leading-relaxed">{report.description}</p>
          </div>

          {/* Recommendation */}
          {report.recommendation && (
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">RECOMMENDATION</label>
              <p className="text-stone-800 font-light leading-relaxed">{report.recommendation}</p>
            </div>
          )}

          {/* Operation Action */}
          {report.operationAction && (
            <div className="bg-white border border-stone-200 p-6">
              <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">ACTION TAKEN</label>
              <p className="text-stone-800 font-light leading-relaxed">{report.operationAction}</p>
            </div>
          )}

          {/* Remarks */}
          <div className="bg-white border border-stone-200 p-6">
            <label className="block text-sm font-light text-stone-600 mb-4 tracking-wide">REMARKS</label>
            <div className="space-y-4 mb-6">
              {report.remarks && report.remarks.length > 0 ? (
                report.remarks.map((remark, idx) => (
                  <div key={idx} className="border-l-2 border-stone-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-stone-500" />
                      <span className="text-sm font-light text-stone-800">{remark.user}</span>
                      <span className="text-xs text-stone-400 font-light">{remark.timestamp}</span>
                    </div>
                    <p className="text-stone-600 font-light">{remark.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-stone-400 font-light text-sm">No remarks yet</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRemark()}
                placeholder="Add a remark..."
                className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
              />
              <button
                onClick={handleAddRemark}
                disabled={isSubmitting || !remarkText.trim()}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'ADDING...' : 'ADD'}
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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    serialNo: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    apparatus: '',
    description: '',
    recommendation: '',
    operationAction: '',
    referTo: 'Electrical',
    means: 'Telephone'
  });

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reports`, {
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const data = await response.json();
      setReports(data.reports || data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const handleSubmit = async () => {
    if (!formData.serialNo || !formData.description || !formData.apparatus) {
      alert('Please fill all required fields (Serial No, Apparatus, Description)');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/createReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create report');
      }

      // Add new report to the list
      setReports([data.report, ...reports]);
      
      // Reset form
      setFormData({
        serialNo: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        apparatus: '',
        description: '',
        recommendation: '',
        operationAction: '',
        referTo: 'Electrical',
        means: 'Telephone'
      });
      setShowForm(false);
      alert('Report created successfully!');
    } catch (err) {
      console.error('Error creating report:', err);
      alert(err.message || 'Failed to create report. Please try again.');
    }
  };

  const handleAddRemark = async (reportId, text) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}/remarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to add remark');
      }

      const data = await response.json();
      
      // Update local state
      setReports(reports.map(r => 
        r._id === reportId ? data.report : r
      ));
      
      // Update selected report if it's open
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport(data.report);
      }
    } catch (err) {
      console.error('Error adding remark:', err);
      alert('Failed to add remark. Please try again.');
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      
      // Update local state
      setReports(reports.map(r => 
        r._id === reportId ? data.report : r
      ));
      
      // Update selected report if it's open
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport(data.report);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      logout(navigate)
      
    } catch (err) {
      console.error('Error logging out:', err);
      alert('Failed to logout. Please try again.');
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
      {/* Header */}
      <div className="bg-stone-900 text-white p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-wider mb-2">TROUBLESHOOTING REPORTS</h1>
              <p className="text-stone-400 font-light">Shift Engineer Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 font-light text-sm tracking-wide transition-colors"
              >
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showForm ? 'CANCEL' : 'NEW REPORT'}
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
          </div>
        )}

        {/* New Report Form */}
        {showForm && (
          <div className="bg-white border border-stone-200 rounded-md p-8 mb-8">
            <h3 className="text-2xl font-light text-stone-800 mb-6 tracking-wide">GENERATE REPORT</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">SERIAL NO *</label>
                <input
                  type="text"
                  value={formData.serialNo}
                  onChange={(e) => setFormData({...formData, serialNo: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light"
                  placeholder="TR-2025-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">DATE</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">TIME</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">APPARATUS AFFECTED *</label>
                <input
                  type="text"
                  value={formData.apparatus}
                  onChange={(e) => setFormData({...formData, apparatus: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light"
                  placeholder="e.g., Transformer T1"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">DESCRIPTION *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light resize-none"
                  rows="4"
                  placeholder="Describe the trouble..."
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">RECOMMENDATION</label>
                <textarea
                  value={formData.recommendation}
                  onChange={(e) => setFormData({...formData, recommendation: e.target.value})}
                  className="w-full px-4 py-3 border border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light resize-none"
                  rows="3"
                  placeholder="Recommended actions..."
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">ACTION TAKEN</label>
                <input
                  type="text"
                  value={formData.operationAction}
                  onChange={(e) => setFormData({...formData, operationAction: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-stone-300 text-stone-800 focus:border-stone-800 focus:outline-none transition-colors font-light"
                  placeholder="Actions taken by operation staff..."
                />
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">DEPARTMENT</label>
                <select
                  value={formData.referTo}
                  onChange={(e) => setFormData({...formData, referTo: e.target.value})}
                  className="w-full p-3 border border-stone-300 bg-white text-stone-800 font-light focus:border-stone-800 focus:outline-none transition-colors"
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Instrumentation">Instrumentation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-stone-600 mb-3 tracking-wide">MEANS</label>
                <select
                  value={formData.means}
                  onChange={(e) => setFormData({...formData, means: e.target.value})}
                  className="w-full p-3 border border-stone-300 bg-white text-stone-800 font-light focus:border-stone-800 focus:outline-none transition-colors"
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
              className="mt-8 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors"
            >
              SUBMIT REPORT
            </button>
          </div>
        )}

        {/* Filters */}
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
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-md border border-stone-200 p-12 text-center">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-400 font-light">No reports found</p>
            </div>
          ) : (
            filteredReports.map(report => (
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