import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit3, FiSave, FiRefreshCcw } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://dairy-shop-app-4.onrender.com/api/v1/fee";

const FeeManagement = () => {
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [handlingFee, setHandlingFee] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [existingConfig, setExistingConfig] = useState(null);

  // Fetch existing fee config
  const fetchFeeConfig = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setExistingConfig(res.data);
      setDeliveryCharge(res.data.deliveryCharge);
      setHandlingFee(res.data.handlingFee);
      setIsActive(res.data.isActive);
    } catch (error) {
      console.warn("No active fee config found or error:", error);
      setExistingConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeConfig();
  }, []);

  // Create new configuration
  const createConfig = async () => {
    if (!deliveryCharge || !handlingFee)
      return toast.error("Please enter both fees!");

    try {
      setUpdating(true);
      const res = await axios.post(API_URL, {
        deliveryCharge: Number(deliveryCharge),
        handlingFee: Number(handlingFee),
        isActive,
      });
      toast.success("New fee configuration created ✅");
      setExistingConfig(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create configuration"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Update existing configuration
  const updateConfig = async () => {
    if (!deliveryCharge || !handlingFee)
      return toast.error("Please enter both fees!");

    try {
      setUpdating(true);
      const res = await axios.put(API_URL, {
        deliveryCharge: Number(deliveryCharge),
        handlingFee: Number(handlingFee),
        isActive,
      });
      toast.success("Fee configuration updated successfully ✅");
      setExistingConfig(res.data);
    } catch (error) {
      toast.error("Failed to update configuration");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading configuration...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <Toaster position="top-right" />
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            ⚙️ Manage Fee Configuration
          </h1>
          <button
            onClick={fetchFeeConfig}
            className="text-gray-500 hover:text-blue-600 transition"
            title="Refresh"
          >
            <FiRefreshCcw size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Delivery Charge (₹)
            </label>
            <input
              type="number"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter delivery charge"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Handling Fee (₹)
            </label>
            <input
              type="number"
              value={handlingFee}
              onChange={(e) => setHandlingFee(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter handling fee"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <label className="text-gray-700 font-medium">Active Configuration</label>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          {!existingConfig ? (
            <button
              onClick={createConfig}
              disabled={updating}
              className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition ${
                updating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <FiSave /> {updating ? "Creating..." : "Create Configuration"}
            </button>
          ) : (
            <button
              onClick={updateConfig}
              disabled={updating}
              className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition ${
                updating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FiEdit3 /> {updating ? "Updating..." : "Update Configuration"}
            </button>
          )}
        </div>

        {existingConfig && (
          <div className="mt-8 border-t pt-5 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-800">
                Last Updated:
              </span>{" "}
              {new Date(existingConfig.updatedAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Active:</span>{" "}
              {existingConfig.isActive ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;
