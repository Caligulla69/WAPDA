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
  Edit,
  Trash2,
  Plus,
  Save,
  Shield,
  UserPlus,
  Lock,
  Unlock,
  Settings,
  Database,
  Activity,
} from "lucide-react";
import API_URL from "../../utils/api";

const ReportEditModal = ({ report, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    serialNo: report?.serialNo || "",
    date: report?.date ? new Date(report.date).toISOString().split("T")[0] : "",
    time: report?.time || "",
    notifiedBy: report?.notifiedBy || "",
    means: report?.means || "Telephone",
    referTo: report?.referTo || " EME (P)",
    apparatus: report?.apparatus || "",
    description: report?.description || "",
    recommendation: report?.recommendation || "",
    operationAction: report?.operationAction || "",
    departmentAction: report?.departmentAction || "",
    status: report?.status || "Pending",
    currentStage: report?.currentStage || "Department",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(report._id, formData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-900 text-white p-4 md:p-6 flex justify-between items-center z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-light tracking-wide">
              EDIT REPORT
            </h3>
            <p className="text-stone-400 font-light text-xs md:text-sm mt-1">
              {report.serialNo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                SERIAL NO
              </label>
              <input
                type="text"
                value={formData.serialNo}
                onChange={(e) =>
                  setFormData({ ...formData, serialNo: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
            </div>
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                DATE
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
            </div>
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                TIME
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
            </div>
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                NOTIFIED BY
              </label>
              <input
                type="text"
                value={formData.notifiedBy}
                onChange={(e) =>
                  setFormData({ ...formData, notifiedBy: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
            </div>
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                MEANS
              </label>
              <select
                value={formData.means}
                onChange={(e) =>
                  setFormData({ ...formData, means: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              >
                <option value="Telephone">Telephone</option>
                <option value="Email">Email</option>
                <option value="Radio">Radio</option>
                <option value="In Person">In Person</option>
              </select>
            </div>
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                REFER TO DEPARTMENT
              </label>
              <select
                value={formData.referTo}
                onChange={(e) =>
                  setFormData({ ...formData, referTo: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
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
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                STATUS
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Needs Revision">Needs Revision</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="bg-white border border-stone-200 p-4">
              <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
                CURRENT STAGE
              </label>
              <select
                value={formData.currentStage}
                onChange={(e) =>
                  setFormData({ ...formData, currentStage: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              >
                <option value="Department">Department</option>
                <option value="OE Department">OE Department</option>
                <option value="Resident Engineer">Resident Engineer</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
              APPARATUS AFFECTED
            </label>
            <input
              type="text"
              value={formData.apparatus}
              onChange={(e) =>
                setFormData({ ...formData, apparatus: e.target.value })
              }
              className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
            />
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
              DESCRIPTION
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light resize-none"
            />
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
              RECOMMENDATION
            </label>
            <textarea
              value={formData.recommendation}
              onChange={(e) =>
                setFormData({ ...formData, recommendation: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light resize-none"
            />
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
              OPERATION ACTION
            </label>
            <textarea
              value={formData.operationAction}
              onChange={(e) =>
                setFormData({ ...formData, operationAction: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light resize-none"
            />
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <label className="block text-xs font-light text-stone-600 mb-2 tracking-wide">
              DEPARTMENT ACTION
            </label>
            <textarea
              value={formData.departmentAction}
              onChange={(e) =>
                setFormData({ ...formData, departmentAction: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  SAVE CHANGES
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border border-stone-300 hover:border-stone-400 text-stone-800 font-light text-sm tracking-wide transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagementModal = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    department: " EME (P)",
    designation: "",
    role: "shift_engineer",
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Error fetching users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      alert("Username and password are required");
      return;
    }
    try {
      setAdding(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add user");
      }
      await fetchUsers();
      setNewUser({
        username: "",
        password: "",
        name: "",
        email: "",
        department: " EME (P)",
        designation: "",
        role: "shift_engineer",
      });
      alert("User created successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }
      await fetchUsers();
      alert("User deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: newStatus }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user status");
      }

      // Force a complete refresh of the user list
      await fetchUsers();
    } catch (err) {
      console.error("Toggle error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-50 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-900 text-white p-4 md:p-6 flex justify-between items-center z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-light tracking-wide">
              USER MANAGEMENT
            </h3>
            <p className="text-stone-400 font-light text-xs md:text-sm mt-1">
              Create, modify, and manage user access
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="p-4 md:p-6 space-y-6">
          <div className="bg-white border border-stone-200 p-4 md:p-6">
            <h4 className="text-sm font-light text-stone-800 mb-4 tracking-wide flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              ADD NEW USER
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
              <select
                value={newUser.department}
                onChange={(e) =>
                  setNewUser({ ...newUser, department: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
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
              <input
                type="text"
                placeholder="Designation"
                value={newUser.designation}
                onChange={(e) =>
                  setNewUser({ ...newUser, designation: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="px-3 py-2 border border-stone-300 text-sm text-stone-800 focus:border-stone-800 focus:outline-none font-light"
              >
                <option value="shift_engineer">Shift Engineer</option>
                <option value="department">Department</option>
                <option value="oe">OE Department</option>
                <option value="resident_engineer">Resident Engineer</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleAddUser}
                disabled={adding}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-light text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    ADD USER
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-white border border-stone-200">
            <div className="p-4 border-b border-stone-200">
              <h4 className="text-sm font-light text-stone-800 tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4" />
                EXISTING USERS ({users.length})
              </h4>
            </div>
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                        NAME
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                        EMAIL
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                        DEPARTMENT
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                        ROLE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                        STATUS
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-light text-stone-600 tracking-wide">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-stone-100 hover:bg-stone-50"
                      >
                        <td className="px-4 py-3 text-sm font-light text-stone-800">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 text-sm font-light text-stone-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm font-light text-stone-600">
                          {user.department}
                        </td>
                        <td className="px-4 py-3 text-xs font-light text-stone-600">
                          {user.role}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-light ${
                              user.status == "active"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-rose-50 text-rose-800"
                            }`}
                          >
                            {user.status === "active" ? "ACTIVE" : "DISABLED"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  user._id,
                                  user.status === "active"
                                )
                              }
                              className="p-2 hover:bg-stone-100 transition-colors"
                              title={
                                user.status === "active" ? "Disable" : "Enable"
                              }
                            >
                              {user.status === "active" ? (
                                <Lock className="w-4 h-4 text-stone-600" />
                              ) : (
                                <Unlock className="w-4 h-4 text-stone-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 hover:bg-rose-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    closed: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/admin/reports`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
      setStats({
        total: data.length,
        pending: data.filter(
          (r) =>
            r.status === "Pending" ||
            r.status === "Under Review" ||
            r.status === "Needs Revision"
        ).length,
        closed: data.filter((r) => r.status === "Closed").length,
        rejected: data.filter((r) => r.status === "Rejected").length,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { credentials: "include" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSaveReport = async (reportId, formData) => {
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update report");
      }
      await fetchReports();
      setSelectedReport(null);
      alert("Report updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete report");
      }
      await fetchReports();
      alert("Report deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const displayReports = useMemo(() => {
    let filtered = reports;
    if (filter === "pending")
      filtered = reports.filter(
        (r) =>
          r.status === "Pending" ||
          r.status === "Under Review" ||
          r.status === "Needs Revision"
      );
    else if (filter === "closed")
      filtered = reports.filter((r) => r.status === "Closed");
    else if (filter === "rejected")
      filtered = reports.filter((r) => r.status === "Rejected");

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.apparatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [filter, searchTerm, reports]);

  const filterButtons = [
    { id: "all", label: "All Reports", count: stats.total, icon: Database },
    {
      id: "pending",
      label: "Pending",
      count: stats.pending,
      icon: AlertCircle,
    },
    { id: "closed", label: "Closed", count: stats.closed, icon: CheckCircle },
    { id: "rejected", label: "Rejected", count: stats.rejected, icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-white p-4 md:p-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-light tracking-wider mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 md:w-10 md:h-10" />
              ADMIN CONTROL
            </h1>
            <p className="text-stone-400 font-light text-sm md:text-base">
              Complete system management and oversight
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUserManagement(true)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">USERS</span>
            </button>
            <button
              onClick={fetchReports}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">REFRESH</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700 text-sm font-light tracking-wide"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              {filterButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id)}
                    className={`p-4 md:p-6 transition-all duration-300 ${
                      filter === btn.id
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-700 border border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      <p className="text-xs font-light tracking-wide">
                        {btn.label.toUpperCase()}
                      </p>
                    </div>
                    <p className="text-2xl md:text-3xl font-light">
                      {btn.count}
                    </p>
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
                  placeholder="Search reports by serial no, apparatus, or description..."
                  className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-stone-200 text-sm md:text-base text-stone-800 placeholder-stone-400 focus:border-stone-800 focus:outline-none transition-colors font-light"
                />
              </div>
            </div>
            {displayReports.length === 0 ? (
              <div className="bg-white border border-stone-200 p-8 md:p-12 text-center">
                <Database className="w-12 h-12 md:w-16 md:h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-light text-sm md:text-base">
                  No reports found matching your criteria
                </p>
              </div>
            ) : (
              <div className="bg-white border border-stone-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                          SERIAL NO
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                          APPARATUS
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                          DEPARTMENT
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                          STATUS
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                          STAGE
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-light text-stone-600 tracking-wide">
                          DATE
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-light text-stone-600 tracking-wide">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayReports.map((report) => {
                        const getStatusColor = (status) => {
                          switch (status) {
                            case "Closed":
                              return "bg-emerald-50 text-emerald-800";
                            case "Rejected":
                              return "bg-rose-50 text-rose-800";
                            case "Pending":
                              return "bg-amber-50 text-amber-800";
                            case "Needs Revision":
                              return "bg-orange-50 text-orange-800";
                            case "Under Review":
                              return "bg-violet-50 text-violet-800";
                            default:
                              return "bg-blue-50 text-blue-800";
                          }
                        };

                        return (
                          <tr
                            key={report._id}
                            className="border-b border-stone-100 hover:bg-stone-50"
                          >
                            <td className="px-4 py-3 text-sm font-light text-stone-800">
                              {report.serialNo}
                            </td>
                            <td className="px-4 py-3 text-sm font-light text-stone-600 max-w-xs truncate">
                              {report.apparatus}
                            </td>
                            <td className="px-4 py-3 text-sm font-light text-stone-600">
                              {report.referTo}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-light ${getStatusColor(
                                  report.status
                                )}`}
                              >
                                {report.status?.toUpperCase() || "OPEN"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-light text-stone-600">
                              {report.currentStage}
                            </td>
                            <td className="px-4 py-3 text-sm font-light text-stone-600">
                              {new Date(report.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setSelectedReport(report)}
                                  className="p-2 hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReport(report._id)}
                                  className="p-2 hover:bg-rose-50 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {selectedReport && (
        <ReportEditModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSave={handleSaveReport}
        />
      )}
      {showUserManagement && (
        <UserManagementModal onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
}
