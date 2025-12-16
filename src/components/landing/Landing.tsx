import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiMessageSquare,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiHeart,
  FiMusic,
  FiBriefcase,
  FiHome,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiDownload,
  FiSmartphone,
  FiMonitor,
  FiStar,
  FiAward,
  FiGlobe,
} from "react-icons/fi";

interface AppSettings {
  appDownloads: {
    androidUrl: string;
    iosUrl: string;
    enableAndroid: boolean;
    enableIos: boolean;
  };
}

const Landing: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appDownloads: {
      androidUrl:
        "https://play.google.com/store/apps/details?id=com.bulksmspro.app",
      iosUrl: "https://apps.apple.com/app/bulksmspro/id123456789",
      enableAndroid: true,
      enableIos: true,
    },
  });

  useEffect(() => {
    setIsVisible(true);
    fetchAppSettings();
  }, []);

  const fetchAppSettings = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:4000";
      const response = await fetch(
        `${API_BASE_URL}/api/auth/admin/app-settings`
      );
      if (response.ok) {
        const settings = await response.json();
        setAppSettings(settings);
      }
    } catch (error) {
      console.error("Error fetching app settings:", error);
      // Keep default settings if fetch fails
    }
  };

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "Lightning Fast",
      desc: "Send thousands of messages in seconds with our optimized delivery system.",
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      title: "Contact Management",
      desc: "Import and organize your contacts easily. Create groups for targeted messaging.",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      title: "Delivery Reports",
      desc: "Track message delivery status in real-time with detailed analytics.",
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      title: "Flexible Payments",
      desc: "Pay as you go with mobile money, cards, or prepaid credits.",
    },
  ];

  const useCases = [
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: "Weddings & Celebrations",
      description:
        "Send invitations, updates, and thank you messages to all your guests",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
    {
      icon: <FiMusic className="w-6 h-6" />,
      title: "Parties & Social Events",
      description:
        "Coordinate party details, venue changes, and last-minute updates",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      title: "Business Meetings",
      description:
        "Send meeting reminders, agenda updates, and follow-up messages",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
    {
      icon: <FiHome className="w-6 h-6" />,
      title: "Community Events",
      description:
        "Notify members about events, schedule changes, and important announcements",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
  ];

  const benefits = [
    {
      icon: <FiDollarSign className="w-5 h-5" />,
      text: "Low Cost",
      subtext: "Only 15 RWF per SMS",
    },
    {
      icon: <FiClock className="w-5 h-5" />,
      text: "Instant Delivery",
      subtext: "Reach everyone in seconds",
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      text: "Bulk Messaging",
      subtext: "Send to thousands at once",
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      text: "Reliable",
      subtext: "99.9% delivery rate",
    },
  ];

  const stats = [
    { label: "Messages Sent", value: "10K+" },
    { label: "Delivery Rate", value: "99.9%" },
    { label: "Happy Users", value: "500+" },
  ];

  return (
    <div
      className={`min-h-screen ${
        resolvedTheme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div
          className={`relative z-10 px-6 py-20 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-8 backdrop-blur-sm">
              <FiMessageSquare className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              BulkSMS Pro
            </h1>
            <p className="text-xl md:text-2xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Perfect for weddings, parties, meetings & events
            </p>

            {/* Stats */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white text-opacity-80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {(appSettings.appDownloads.enableAndroid ||
                appSettings.appDownloads.enableIos) && (
                <a
                  href="#download"
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <FiSmartphone className="w-5 h-5 mr-2" />
                  Download Mobile App
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </a>
              )}
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                <FiMonitor className="w-5 h-5 mr-2" />
                Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div
        className={`py-20 px-6 ${
          resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-extrabold mb-4 ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Perfect for Your Events
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Whether you're planning a wedding, organizing a party, or
              coordinating a meeting, reach everyone instantly at an affordable
              price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                className={`${useCase.bgColor} ${useCase.borderColor} border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                <div className="flex items-start">
                  <div
                    className={`${useCase.color} ${useCase.bgColor} p-3 rounded-full mr-6 shadow-md`}
                  >
                    {useCase.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold mb-3 ${
                        resolvedTheme === "dark"
                          ? "text-gray-900"
                          : "text-gray-900"
                      }`}
                    >
                      {useCase.title}
                    </h3>
                    <p
                      className={`${
                        resolvedTheme === "dark"
                          ? "text-gray-700"
                          : "text-gray-700"
                      } leading-relaxed`}
                    >
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div
            className={`mt-16 ${
              resolvedTheme === "dark" ? "bg-gray-700" : "bg-white"
            } rounded-3xl p-8 shadow-lg`}
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <FiZap className="w-6 h-6 text-purple-600 mr-2" />
                <h3
                  className={`text-2xl font-bold ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Why Choose Us?
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={benefit.text} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-purple-600">{benefit.icon}</div>
                  </div>
                  <h4
                    className={`font-semibold mb-2 ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {benefit.text}
                  </h4>
                  <p
                    className={`text-sm ${
                      resolvedTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {benefit.subtext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className={`py-20 px-6 ${
          resolvedTheme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-extrabold mb-4 ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Why Choose BulkSMS Pro?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`${
                  resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border ${
                  resolvedTheme === "dark"
                    ? "border-gray-700"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start">
                  <div className={`${feature.bgColor} p-3 rounded-full mr-6`}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`${
                        resolvedTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600"
                      } leading-relaxed`}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div
        className={`py-20 px-6 ${
          resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-4xl font-extrabold mb-8 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Simple Pricing
          </h2>

          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-12 shadow-lg">
            <div className="text-6xl font-extrabold text-purple-600 mb-2">
              15 RWF
            </div>
            <div
              className={`text-xl mb-4 ${
                resolvedTheme === "dark" ? "text-gray-700" : "text-gray-700"
              }`}
            >
              per SMS
            </div>
            <p
              className={`${
                resolvedTheme === "dark" ? "text-gray-600" : "text-gray-600"
              } max-w-md mx-auto`}
            >
              No monthly fees • Pay only for what you send • Bulk discounts
              available
            </p>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div
        id="download"
        className={`py-20 px-6 ${
          resolvedTheme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-4xl font-extrabold mb-8 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Get BulkSMS Pro
          </h2>
          <p
            className={`text-xl mb-12 max-w-2xl mx-auto ${
              resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Download our mobile app or access the admin dashboard to start
            sending messages today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Mobile App */}
            <div
              className={`${
                resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
              } rounded-2xl p-8 text-center border ${
                resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <FiSmartphone
                className={`w-16 h-16 mx-auto mb-6 ${
                  resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <h3
                className={`text-2xl font-bold mb-4 ${
                  resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Mobile App
              </h3>
              <p
                className={`mb-6 ${
                  resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Send messages on the go with our intuitive mobile application.
              </p>
              <div className="space-y-3">
                {appSettings.appDownloads.enableAndroid && (
                  <a
                    href={appSettings.appDownloads.androidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    <FiDownload className="w-5 h-5 mr-2" />
                    Download for Android
                  </a>
                )}
                {appSettings.appDownloads.enableIos && (
                  <a
                    href={appSettings.appDownloads.iosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <FiDownload className="w-5 h-5 mr-2" />
                    Download for iOS
                  </a>
                )}
                {!appSettings.appDownloads.enableAndroid &&
                  !appSettings.appDownloads.enableIos && (
                    <div
                      className={`text-center py-4 ${
                        resolvedTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      <p>Mobile app downloads are currently unavailable.</p>
                      <p className="text-sm">
                        Contact administrator for more information.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Admin Dashboard */}
            <div
              className={`${
                resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
              } rounded-2xl p-8 text-center border ${
                resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <FiMonitor
                className={`w-16 h-16 mx-auto mb-6 ${
                  resolvedTheme === "dark"
                    ? "text-purple-400"
                    : "text-purple-600"
                }`}
              />
              <h3
                className={`text-2xl font-bold mb-4 ${
                  resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Admin Dashboard
              </h3>
              <p
                className={`mb-6 ${
                  resolvedTheme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Manage your SMS campaigns with our powerful web dashboard.
              </p>
              <a
                href="/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                <FiGlobe className="w-5 h-5 mr-2" />
                Access Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready for your next event?
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Join event organizers who trust BulkSMS Pro for seamless
            communication
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started
              <FiArrowRight className="w-5 h-5 ml-2" />
            </a>
            {(appSettings.appDownloads.enableAndroid ||
              appSettings.appDownloads.enableIos) && (
              <a
                href="#download"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                <FiDownload className="w-5 h-5 mr-2" />
                Download App
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`py-12 px-6 text-center ${
          resolvedTheme === "dark"
            ? "bg-gray-900 border-t border-gray-800"
            : "bg-gray-50 border-t border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <FiMessageSquare
              className={`w-8 h-8 mr-2 ${
                resolvedTheme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <span
              className={`text-2xl font-bold ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              BulkSMS Pro
            </span>
          </div>
          <p
            className={`mb-4 ${
              resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            &copy; {new Date().getFullYear()} BulkSMS Pro by Codefusion Ltd. All
            rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className={`${
                resolvedTheme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className={`${
                resolvedTheme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Terms of Service
            </a>
            <a
              href="#"
              className={`${
                resolvedTheme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
