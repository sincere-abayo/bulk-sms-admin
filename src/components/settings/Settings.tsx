import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiSettings,
  FiSave,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiMessageSquare,
  FiShield,
  FiGlobe,
  FiMail,
  FiPhone,
  FiKey,
  FiDatabase,
  FiActivity,
  FiUsers,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSmartphone,
} from "react-icons/fi";

interface SystemSettings {
  sms: {
    provider: string;
    apiKey: string;
    username: string;
    costPerSMS: number;
    maxRecipientsPerBatch: number;
    retryAttempts: number;
    timeoutSeconds: number;
  };
  pricing: {
    baseCostRWF: number;
    bulkDiscountThreshold: number;
    bulkDiscountPercent: number;
    currency: string;
  };
  security: {
    jwtSecret: string;
    tokenExpiryHours: number;
    maxLoginAttempts: number;
    otpExpiryMinutes: number;
    requireEmailVerification: boolean;
  };
  system: {
    maintenanceMode: boolean;
    maxUsersPerDay: number;
    maxMessagesPerUser: number;
    enableRegistration: boolean;
    enableGuestAccess: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    adminEmail: string;
    lowBalanceThreshold: number;
    systemAlerts: boolean;
  };
  appDownloads: {
    androidUrl: string;
    iosUrl: string;
    enableAndroid: boolean;
    enableIos: boolean;
  };
}

const Settings: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<SystemSettings>({
    sms: {
      provider: "africastalking",
      apiKey: "",
      username: "",
      costPerSMS: 15,
      maxRecipientsPerBatch: 100,
      retryAttempts: 3,
      timeoutSeconds: 30,
    },
    pricing: {
      baseCostRWF: 15,
      bulkDiscountThreshold: 1000,
      bulkDiscountPercent: 10,
      currency: "RWF",
    },
    security: {
      jwtSecret: "",
      tokenExpiryHours: 24,
      maxLoginAttempts: 5,
      otpExpiryMinutes: 10,
      requireEmailVerification: false,
    },
    system: {
      maintenanceMode: false,
      maxUsersPerDay: 100,
      maxMessagesPerUser: 10000,
      enableRegistration: true,
      enableGuestAccess: false,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      adminEmail: "admin@bulksms.com",
      lowBalanceThreshold: 1000,
      systemAlerts: true,
    },
    appDownloads: {
      androidUrl:
        "https://play.google.com/store/apps/details?id=com.bulksmspro.app",
      iosUrl: "https://apps.apple.com/app/bulksmspro/id123456789",
      enableAndroid: true,
      enableIos: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("sms");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showJwtSecret, setShowJwtSecret] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/admin/app-settings"
      );
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({
          ...prev,
          appDownloads: data.appDownloads,
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/admin/app-settings",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appDownloads: {
              androidUrl: settings.appDownloads.androidUrl,
              iosUrl: settings.appDownloads.iosUrl,
              enableAndroid: settings.appDownloads.enableAndroid,
              enableIos: settings.appDownloads.enableIos,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      const savedSettings = await response.json();

      // Update local state with saved settings
      setSettings((prev) => ({
        ...prev,
        appDownloads: savedSettings.appDownloads,
      }));

      setSaveMessage({
        type: "success",
        text: "App download settings saved successfully!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to save settings. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (
    section: keyof SystemSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const tabs = [
    {
      id: "sms",
      label: "SMS Configuration",
      icon: <FiMessageSquare className="w-4 h-4" />,
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: <FiDollarSign className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <FiShield className="w-4 h-4" />,
    },
    { id: "system", label: "System", icon: <FiSettings className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiMail className="w-4 h-4" />,
    },
    {
      id: "appDownloads",
      label: "App Downloads",
      icon: <FiSmartphone className="w-4 h-4" />,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 p-6 ${
        resolvedTheme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            System Settings
          </h1>
          <p
            className={`${
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Configure system preferences and operational parameters
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadSettings}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
              resolvedTheme === "dark"
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-300"
            }`}
          >
            <FiRefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiSave className={`w-4 h-4 ${saving ? "animate-pulse" : ""}`} />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg border ${
            saveMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {saveMessage.type === "success" ? (
              <FiCheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <FiAlertCircle className="w-5 h-5 mr-2" />
            )}
            {saveMessage.text}
          </div>
        </div>
      )}

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div
          className={`rounded-lg shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <h3
              className={`text-lg font-semibold mb-4 ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Configuration
            </h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : resolvedTheme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Panel */}
        <div
          className={`lg:col-span-3 rounded-lg shadow-sm border ${
            resolvedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6">
            {/* SMS Configuration */}
            {activeTab === "sms" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    SMS Provider Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        SMS Provider
                      </label>
                      <select
                        value={settings.sms.provider}
                        onChange={(e) =>
                          updateSettings("sms", "provider", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="africastalking">Africa's Talking</option>
                        <option value="twilio">Twilio</option>
                        <option value="nexmo">Nexmo</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        value={settings.sms.username}
                        onChange={(e) =>
                          updateSettings("sms", "username", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="Enter SMS provider username"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={settings.sms.apiKey}
                          onChange={(e) =>
                            updateSettings("sms", "apiKey", e.target.value)
                          }
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            resolvedTheme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Enter SMS provider API key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showApiKey ? (
                            <FiEyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <FiEye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Cost per SMS (RWF)
                      </label>
                      <input
                        type="number"
                        value={settings.sms.costPerSMS}
                        onChange={(e) =>
                          updateSettings(
                            "sms",
                            "costPerSMS",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="1"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Max Recipients per Batch
                      </label>
                      <input
                        type="number"
                        value={settings.sms.maxRecipientsPerBatch}
                        onChange={(e) =>
                          updateSettings(
                            "sms",
                            "maxRecipientsPerBatch",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="1"
                        max="1000"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Retry Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.sms.retryAttempts}
                        onChange={(e) =>
                          updateSettings(
                            "sms",
                            "retryAttempts",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="1"
                        max="10"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.sms.timeoutSeconds}
                        onChange={(e) =>
                          updateSettings(
                            "sms",
                            "timeoutSeconds",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="5"
                        max="300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Configuration */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Pricing Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Base Cost per SMS (RWF)
                      </label>
                      <input
                        type="number"
                        value={settings.pricing.baseCostRWF}
                        onChange={(e) =>
                          updateSettings(
                            "pricing",
                            "baseCostRWF",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="1"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Currency
                      </label>
                      <select
                        value={settings.pricing.currency}
                        onChange={(e) =>
                          updateSettings("pricing", "currency", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="RWF">Rwandan Franc (RWF)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Bulk Discount Threshold
                      </label>
                      <input
                        type="number"
                        value={settings.pricing.bulkDiscountThreshold}
                        onChange={(e) =>
                          updateSettings(
                            "pricing",
                            "bulkDiscountThreshold",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="100"
                      />
                      <p
                        className={`text-sm mt-1 ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Minimum messages for bulk discount
                      </p>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Bulk Discount Percentage
                      </label>
                      <input
                        type="number"
                        value={settings.pricing.bulkDiscountPercent}
                        onChange={(e) =>
                          updateSettings(
                            "pricing",
                            "bulkDiscountPercent",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="0"
                        max="50"
                      />
                      <p
                        className={`text-sm mt-1 ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Discount percentage for bulk orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Configuration */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Security Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        JWT Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showJwtSecret ? "text" : "password"}
                          value={settings.security.jwtSecret}
                          onChange={(e) =>
                            updateSettings(
                              "security",
                              "jwtSecret",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            resolvedTheme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Enter JWT secret key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowJwtSecret(!showJwtSecret)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showJwtSecret ? (
                            <FiEyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <FiEye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Token Expiry (hours)
                      </label>
                      <input
                        type="number"
                        value={settings.security.tokenExpiryHours}
                        onChange={(e) =>
                          updateSettings(
                            "security",
                            "tokenExpiryHours",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="1"
                        max="168"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) =>
                          updateSettings(
                            "security",
                            "maxLoginAttempts",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="3"
                        max="10"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        OTP Expiry (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.security.otpExpiryMinutes}
                        onChange={(e) =>
                          updateSettings(
                            "security",
                            "otpExpiryMinutes",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="5"
                        max="30"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) =>
                            updateSettings(
                              "security",
                              "requireEmailVerification",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Require email verification for new accounts
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Configuration */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    System Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Max Users per Day
                      </label>
                      <input
                        type="number"
                        value={settings.system.maxUsersPerDay}
                        onChange={(e) =>
                          updateSettings(
                            "system",
                            "maxUsersPerDay",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="10"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Max Messages per User
                      </label>
                      <input
                        type="number"
                        value={settings.system.maxMessagesPerUser}
                        onChange={(e) =>
                          updateSettings(
                            "system",
                            "maxMessagesPerUser",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="100"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.maintenanceMode}
                          onChange={(e) =>
                            updateSettings(
                              "system",
                              "maintenanceMode",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Enable maintenance mode
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.enableRegistration}
                          onChange={(e) =>
                            updateSettings(
                              "system",
                              "enableRegistration",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Allow new user registration
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.enableGuestAccess}
                          onChange={(e) =>
                            updateSettings(
                              "system",
                              "enableGuestAccess",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Enable guest access
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Configuration */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Notification Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={settings.notifications.adminEmail}
                        onChange={(e) =>
                          updateSettings(
                            "notifications",
                            "adminEmail",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Low Balance Threshold (RWF)
                      </label>
                      <input
                        type="number"
                        value={settings.notifications.lowBalanceThreshold}
                        onChange={(e) =>
                          updateSettings(
                            "notifications",
                            "lowBalanceThreshold",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        min="100"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) =>
                            updateSettings(
                              "notifications",
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Enable email notifications
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) =>
                            updateSettings(
                              "notifications",
                              "smsNotifications",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Enable SMS notifications
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notifications.systemAlerts}
                          onChange={(e) =>
                            updateSettings(
                              "notifications",
                              "systemAlerts",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Enable system alerts
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* App Downloads Configuration */}
            {activeTab === "appDownloads" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Mobile App Download Links
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Android App URL (Google Play Store)
                      </label>
                      <input
                        type="url"
                        value={settings.appDownloads.androidUrl}
                        onChange={(e) =>
                          updateSettings(
                            "appDownloads",
                            "androidUrl",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="https://play.google.com/store/apps/details?id=com.yourapp"
                      />
                      <p
                        className={`text-sm mt-1 ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Full URL to your Android app on Google Play Store
                      </p>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          resolvedTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        iOS App URL (Apple App Store)
                      </label>
                      <input
                        type="url"
                        value={settings.appDownloads.iosUrl}
                        onChange={(e) =>
                          updateSettings(
                            "appDownloads",
                            "iosUrl",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          resolvedTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        placeholder="https://apps.apple.com/app/your-app/id123456789"
                      />
                      <p
                        className={`text-sm mt-1 ${
                          resolvedTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Full URL to your iOS app on Apple App Store
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.appDownloads.enableAndroid}
                          onChange={(e) =>
                            updateSettings(
                              "appDownloads",
                              "enableAndroid",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Show Android download button on landing page
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.appDownloads.enableIos}
                          onChange={(e) =>
                            updateSettings(
                              "appDownloads",
                              "enableIos",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            resolvedTheme === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Show iOS download button on landing page
                        </span>
                      </label>
                    </div>

                    <div
                      className={`p-4 rounded-lg border ${
                        resolvedTheme === "dark"
                          ? "bg-blue-900 border-blue-700"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <FiSmartphone className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              resolvedTheme === "dark"
                                ? "text-blue-200"
                                : "text-blue-800"
                            }`}
                          >
                            App Store Guidelines
                          </h4>
                          <p
                            className={`text-sm ${
                              resolvedTheme === "dark"
                                ? "text-blue-300"
                                : "text-blue-700"
                            }`}
                          >
                            Make sure your app URLs are correct and publicly
                            accessible. Users will be redirected to these links
                            when they click download buttons.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
