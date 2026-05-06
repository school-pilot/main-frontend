import React, { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  ChevronDown,
  Shield,
  Bell,
  Globe,
  Database,
  Download,
  Cpu,
  Mail,
  MessageSquare,
  Key,
  AlertTriangle,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreVertical,
  Copy,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState("system");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    email: true,
    sms: false,
    push: false,
  });
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    site_name: "SchoolPilot",
    site_url: "https://schoolpilot.example.com",
    support_email: "support@schoolpilot.com",
    support_phone: "+1-234-567-8900",
    maintenance_mode: false,
    debug_mode: false,
    default_timezone: "UTC",
    default_language: "en",
    date_format: "YYYY-MM-DD",
    time_format: "24h",
    session_timeout: 30,
    max_login_attempts: 5,
    password_expiry_days: 90,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enable_2fa: true,
    require_strong_passwords: true,
    password_min_length: 8,
    password_require_numbers: true,
    password_require_symbols: true,
    enable_ip_whitelist: false,
    enable_login_notifications: true,
    enable_audit_logs: true,
    auto_logout_inactive_users: true,
    session_timeout: 30,
    password_expiry_days: 90,
    max_login_attempts: 5,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    enable_email_notifications: true,
    enable_sms_notifications: false,
    enable_push_notifications: true,
    email_sender_name: "SchoolPilot",
    email_sender_email: "noreply@schoolpilot.com",
    sms_provider: "twilio",
    sms_sender_id: "SCHOOLPILOT",
    notification_sound: true,
    desktop_notifications: true,
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    enable_api: true,
    api_rate_limit: 100,
    api_key_expiry_days: 365,
    enable_webhooks: false,
    webhook_url: "",
    webhook_secret: "",
    enable_cors: true,
    allowed_origins: ["https://schoolpilot.example.com"],
  });

  useEffect(() => {
    fetchSystemInfo();
    fetchUsers();
  }, []);

  const fetchSystemInfo = async () => {
    setLoading(true);
    try {
      const mockSystemInfo = {
        version: "2.0.1",
        last_update: "2024-01-15",
        uptime: "15 days, 6 hours",
        total_users: 1254,
        total_schools: 42,
        active_sessions: 156,
        database_size: "2.4 GB",
        server_os: "Ubuntu 20.04",
        php_version: "8.1",
        node_version: "18.0.0",
        memory_usage: "65%",
        cpu_usage: "42%",
        storage_used: "45%",
      };
      setSystemInfo(mockSystemInfo);
    } catch (error) {
      toast.error("Failed to fetch system information");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const mockUsers = [
        {
          id: 1,
          email: "super.admin@schoolpilot.com",
          role: "super_admin",
          school_name: "All Schools",
          is_active: true,
          last_login: "2024-01-15T10:30:00",
          created_at: "2023-01-01",
        },
        {
          id: 2,
          email: "admin@school1.edu",
          role: "school_admin",
          school_name: "Greenwood High",
          is_active: true,
          last_login: "2024-01-15T09:15:00",
          created_at: "2023-03-15",
        },
        {
          id: 3,
          email: "teacher@school1.edu",
          role: "teacher",
          school_name: "Greenwood High",
          is_active: true,
          last_login: "2024-01-14T14:20:00",
          created_at: "2023-05-20",
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSaveSettings = async (settingsType) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully!`);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSystemAction = (action) => {
    const actions = {
      backup: {
        message: "Creating database backup...",
        success: "Backup created successfully!",
      },
      cache: {
        message: "Clearing cache...",
        success: "Cache cleared successfully!",
      },
      restart: {
        message: "Restarting application...",
        success: "Application restarted!",
      },
      reset: {
        message: "Resetting system...",
        success: "System reset completed!",
      },
    };

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, action === "reset" ? 3000 : 1500)),
      {
        loading: actions[action].message,
        success: actions[action].success,
        error: `Failed to ${action} system`,
      }
    );
  };

  const tabs = [
    { id: "system", label: "System", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API", icon: Key },
    { id: "users", label: "Users", icon: Users },
  ];

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.school_name && user.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage system-wide configurations and settings</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={systemSettings.site_name}
                    onChange={(e) => setSystemSettings({ ...systemSettings, site_name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={systemSettings.site_url}
                    onChange={(e) => setSystemSettings({ ...systemSettings, site_url: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={systemSettings.support_email}
                    onChange={(e) => setSystemSettings({ ...systemSettings, support_email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    value={systemSettings.support_phone}
                    onChange={(e) => setSystemSettings({ ...systemSettings, support_phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Timezone
                  </label>
                  <select
                    value={systemSettings.default_timezone}
                    onChange={(e) => setSystemSettings({ ...systemSettings, default_timezone: e.target.value })}
                    className="input-field"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST</option>
                    <option value="America/Chicago">CST</option>
                    <option value="America/Denver">MST</option>
                    <option value="America/Los_Angeles">PST</option>
                    <option value="Europe/London">GMT</option>
                    <option value="Asia/Kolkata">IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <select
                    value={systemSettings.default_language}
                    onChange={(e) => setSystemSettings({ ...systemSettings, default_language: e.target.value })}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">
                      When enabled, only super admins can access the system
                    </p>
                  </div>
                  <button
                    onClick={() => setSystemSettings({ ...systemSettings, maintenance_mode: !systemSettings.maintenance_mode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      systemSettings.maintenance_mode ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        systemSettings.maintenance_mode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Debug Mode</h4>
                    <p className="text-sm text-gray-600">
                      Enable detailed error logging (not recommended for production)
                    </p>
                  </div>
                  <button
                    onClick={() => setSystemSettings({ ...systemSettings, debug_mode: !systemSettings.debug_mode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      systemSettings.debug_mode ? "bg-red-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        systemSettings.debug_mode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-3">
                <button
                  onClick={() => handleSaveSettings("system")}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save System Settings</span>
                    </>
                  )}
                </button>

                <button
                  onClick={fetchSystemInfo}
                  disabled={loading}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* System Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              
              {loading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader size="md" />
                </div>
              ) : systemInfo ? (
                <div className="space-y-4">
                  {[
                    { label: "Version", value: systemInfo.version },
                    { label: "Last Update", value: systemInfo.last_update },
                    { label: "Uptime", value: systemInfo.uptime },
                    { label: "Total Users", value: systemInfo.total_users.toLocaleString() },
                    { label: "Total Schools", value: systemInfo.total_schools },
                    { label: "Active Sessions", value: systemInfo.active_sessions },
                    { label: "Database Size", value: systemInfo.database_size },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No system information available</p>
              )}

              <button
                onClick={() => handleSystemAction("backup")}
                className="w-full mt-6 btn-secondary flex items-center justify-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Backup Database</span>
              </button>
            </div>

            {/* System Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSystemAction("cache")}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Clear Cache</span>
                </button>

                <button
                  onClick={() => handleSystemAction("restart")}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restart Application</span>
                </button>

                <button
                  onClick={() => handleSystemAction("reset")}
                  className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset System</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-medium">{systemInfo?.cpu_usage}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: systemInfo?.cpu_usage || "0%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <span className="text-sm font-medium">{systemInfo?.memory_usage}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: systemInfo?.memory_usage || "0%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-medium">{systemInfo?.storage_used}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: systemInfo?.storage_used || "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">
                      Require users to enable 2FA for enhanced security
                    </p>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({ ...securitySettings, enable_2fa: !securitySettings.enable_2fa })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      securitySettings.enable_2fa ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        securitySettings.enable_2fa ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Strong Passwords</h4>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({ ...securitySettings, require_strong_passwords: !securitySettings.require_strong_passwords })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      securitySettings.require_strong_passwords ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        securitySettings.require_strong_passwords ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Minimum Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="32"
                      value={securitySettings.password_min_length}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (Days)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={securitySettings.password_expiry_days}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_expiry_days: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={securitySettings.password_require_numbers}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_require_numbers: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Require Numbers</label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={securitySettings.password_require_symbols}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, password_require_symbols: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Require Symbols</label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">IP Whitelist</h4>
                    <p className="text-sm text-gray-600">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({ ...securitySettings, enable_ip_whitelist: !securitySettings.enable_ip_whitelist })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      securitySettings.enable_ip_whitelist ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        securitySettings.enable_ip_whitelist ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Audit Logs</h4>
                    <p className="text-sm text-gray-600">
                      Log all system activities for security monitoring
                    </p>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({ ...securitySettings, enable_audit_logs: !securitySettings.enable_audit_logs })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      securitySettings.enable_audit_logs ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        securitySettings.enable_audit_logs ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSaveSettings("security")}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Security Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Security Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
              
              <div className="space-y-4">
                {[
                  { label: "SSL/TLS Encryption", status: true },
                  { label: "Firewall Protection", status: true },
                  { label: "SQL Injection Protection", status: true },
                  { label: "XSS Protection", status: true },
                  { label: "CSRF Protection", status: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    {item.status ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 btn-secondary">
                Run Security Scan
              </button>
            </div>

            {/* Recent Security Events */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
              
              <div className="space-y-3">
                {[
                  { event: "Failed Login Attempt", details: "IP: 192.168.1.100", time: "2 hours ago", type: "warning" },
                  { event: "New Admin Login", details: "Location: New York, US", time: "4 hours ago", type: "info" },
                  { event: "Password Changed", details: "User: admin@schoolpilot.com", time: "1 day ago", type: "info" },
                  { event: "API Rate Limit Exceeded", details: "IP: 203.0.113.1", time: "1 day ago", type: "warning" },
                ].map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.event}</h4>
                        <p className="text-sm text-gray-600">{event.details}</p>
                      </div>
                      <span className="text-xs text-gray-500">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
              
              <div className="space-y-6">
                {/* Email Settings */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("email")}
                    className="w-full px-4 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Email Settings</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.email ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Enable Email Notifications</h4>
                            </div>
                            <button
                              onClick={() => setNotificationSettings({ ...notificationSettings, enable_email_notifications: !notificationSettings.enable_email_notifications })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                notificationSettings.enable_email_notifications ? "bg-primary-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  notificationSettings.enable_email_notifications ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sender Name
                              </label>
                              <input
                                type="text"
                                value={notificationSettings.email_sender_name}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, email_sender_name: e.target.value })}
                                className="input-field"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sender Email
                              </label>
                              <input
                                type="email"
                                value={notificationSettings.email_sender_email}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, email_sender_email: e.target.value })}
                                className="input-field"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SMS Settings */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("sms")}
                    className="w-full px-4 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">SMS Settings</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.sms ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.sms && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Enable SMS Notifications</h4>
                            </div>
                            <button
                              onClick={() => setNotificationSettings({ ...notificationSettings, enable_sms_notifications: !notificationSettings.enable_sms_notifications })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                notificationSettings.enable_sms_notifications ? "bg-primary-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  notificationSettings.enable_sms_notifications ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                SMS Provider
                              </label>
                              <select
                                value={notificationSettings.sms_provider}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, sms_provider: e.target.value })}
                                className="input-field"
                              >
                                <option value="twilio">Twilio</option>
                                <option value="vonage">Vonage (Nexmo)</option>
                                <option value="aws">AWS SNS</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sender ID
                              </label>
                              <input
                                type="text"
                                value={notificationSettings.sms_sender_id}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, sms_sender_id: e.target.value })}
                                className="input-field"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* In-App Settings */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("push")}
                    className="w-full px-4 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">In-App Notifications</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedSections.push ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.push && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Enable Push Notifications</h4>
                            </div>
                            <button
                              onClick={() => setNotificationSettings({ ...notificationSettings, enable_push_notifications: !notificationSettings.enable_push_notifications })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                notificationSettings.enable_push_notifications ? "bg-primary-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  notificationSettings.enable_push_notifications ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Notification Sound</h4>
                            </div>
                            <button
                              onClick={() => setNotificationSettings({ ...notificationSettings, notification_sound: !notificationSettings.notification_sound })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                notificationSettings.notification_sound ? "bg-primary-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  notificationSettings.notification_sound ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Desktop Notifications</h4>
                            </div>
                            <button
                              onClick={() => setNotificationSettings({ ...notificationSettings, desktop_notifications: !notificationSettings.desktop_notifications })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                notificationSettings.desktop_notifications ? "bg-primary-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  notificationSettings.desktop_notifications ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSaveSettings("notifications")}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Notification Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notifications Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Test Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Notifications</h3>
              
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Test Email</span>
                </button>

                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Test SMS</span>
                </button>

                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Test In-App Notification</span>
                </button>
              </div>
            </div>

            {/* Notification Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Statistics</h3>
              
              <div className="space-y-4">
                {[
                  { label: "Emails Sent Today", value: "1,245" },
                  { label: "SMS Sent Today", value: "324" },
                  { label: "Delivery Rate", value: "98.7%" },
                  { label: "Failed Deliveries", value: "16" },
                  { label: "Avg Response Time", value: "2.3s" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className="font-medium text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* API Tab */}
      {activeTab === "api" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">API Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable API Access</h4>
                  </div>
                  <button
                    onClick={() => setApiSettings({ ...apiSettings, enable_api: !apiSettings.enable_api })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      apiSettings.enable_api ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        apiSettings.enable_api ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Rate Limit (per minute)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={apiSettings.api_rate_limit}
                      onChange={(e) => setApiSettings({ ...apiSettings, api_rate_limit: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key Expiry (Days)
                    </label>
                    <input
                      type="number"
                      min="7"
                      max="365"
                      value={apiSettings.api_key_expiry_days}
                      onChange={(e) => setApiSettings({ ...apiSettings, api_key_expiry_days: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Webhooks</h4>
                  </div>
                  <button
                    onClick={() => setApiSettings({ ...apiSettings, enable_webhooks: !apiSettings.enable_webhooks })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      apiSettings.enable_webhooks ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        apiSettings.enable_webhooks ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={apiSettings.webhook_url}
                    onChange={(e) => setApiSettings({ ...apiSettings, webhook_url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={apiSettings.webhook_secret}
                      onChange={(e) => setApiSettings({ ...apiSettings, webhook_secret: e.target.value })}
                      className="input-field pr-10"
                      placeholder="Enter webhook secret key"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable CORS</h4>
                  </div>
                  <button
                    onClick={() => setApiSettings({ ...apiSettings, enable_cors: !apiSettings.enable_cors })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      apiSettings.enable_cors ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        apiSettings.enable_cors ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Origins
                  </label>
                  <textarea
                    value={apiSettings.allowed_origins.join(", ")}
                    onChange={(e) => setApiSettings({ ...apiSettings, allowed_origins: e.target.value.split(",").map(s => s.trim()) })}
                    className="input-field"
                    rows={3}
                    placeholder="https://example.com, https://app.example.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate multiple origins with commas
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSaveSettings("api")}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save API Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* API Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* API Keys */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Generate New</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "Production API Key", key: "sk_live_...xYz123", expires: "2024-12-31" },
                  { name: "Development API Key", key: "sk_test_...Abc456", expires: "2024-06-30" },
                ].map((apiKey, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                        <p className="text-sm text-gray-600">Expires: {apiKey.expires}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs bg-white px-2 py-1 rounded border">
                        {apiKey.key}
                      </code>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Usage Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage Statistics</h3>
              
              <div className="space-y-4">
                {[
                  { label: "Total API Requests Today", value: "12,456" },
                  { label: "Successful Requests", value: "12,300 (98.7%)" },
                  { label: "Failed Requests", value: "156 (1.3%)" },
                  { label: "Average Response Time", value: "248ms" },
                  { label: "Peak Requests/Minute", value: "420" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className="font-medium text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 btn-secondary">
                View API Documentation
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage all system users and their permissions</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full md:w-64"
                  />
                </div>

                <button
                  onClick={() => {
                    setSelectedUser({
                      email: "",
                      role: "super_admin",
                      is_active: true,
                    });
                    setShowUserDialog(true);
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Email</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">School</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Last Login</th>
                    <th className="table-header">Created</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="table-cell font-medium">{user.email}</td>
                      <td className="table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "super_admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "school_admin"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "teacher"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell">{user.school_name || "-"}</td>
                      <td className="table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="table-cell">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDialog(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this user?")) {
                                toast.success("User deleted successfully");
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Dialog */}
      <AnimatePresence>
        {showUserDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedUser?.id ? "Edit User" : "Add New User"}
                  </h2>
                  <button
                    onClick={() => setShowUserDialog(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={selectedUser?.email || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          email: e.target.value,
                        })
                      }
                      className="input-field"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={selectedUser?.role || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="school_admin">School Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={selectedUser?.password || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            password: e.target.value,
                          })
                        }
                        className="input-field pr-10"
                        placeholder={selectedUser?.id ? "Leave empty to keep current" : "Enter password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedUser?.is_active ? "true" : "false"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          is_active: e.target.value === "true",
                        })
                      }
                      className="input-field"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    onClick={() => setShowUserDialog(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      toast.success("User saved successfully");
                      setShowUserDialog(false);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Save User
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminSettings;