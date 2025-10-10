import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSettings } from "react-icons/fi";

const ManageCODSettings = () => {
  const [codEnabled, setCodEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          "https://dairy-shop-app-4.onrender.com/api/v1/settings/"
        );
        setCodEnabled(res.data.codEnabled);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage("⚠️ Failed to load current settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Toggle COD and update in DB
  const handleToggle = async () => {
    try {
      setUpdating(true);
      const res = await axios.put(
        "https://dairy-shop-app-4.onrender.com/api/v1/settings/",
        { codEnabled: !codEnabled }
      );
      setCodEnabled(res.data.codEnabled);
      setMessage(`✅ COD is now ${res.data.codEnabled ? "ENABLED" : "DISABLED"}`);
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("❌ Failed to update COD status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiSettings className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Manage App Settings</h1>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Cash On Delivery (COD)
          </h2>
          <p className="text-sm text-gray-500">
            Toggle this switch to enable or disable COD ordering in the app.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between mt-3">
            <span
              className={`font-semibold ${
                codEnabled ? "text-green-600" : "text-red-600"
              }`}
            >
              {codEnabled ? "Enabled" : "Disabled"}
            </span>

            <button
              onClick={handleToggle}
              disabled={updating}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                codEnabled ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  codEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {updating && (
            <p className="text-sm text-blue-500 mt-2">Updating settings...</p>
          )}
          {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageCODSettings;
