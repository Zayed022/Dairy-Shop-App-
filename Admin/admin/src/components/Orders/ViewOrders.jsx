import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiEdit3,
  FiRefreshCcw,
} from "react-icons/fi";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  Pending: <FiClock className="text-yellow-500" />,
  Confirmed: <FiCheckCircle className="text-blue-500" />,
  "Out for Delivery": <FiTruck className="text-purple-500" />,
  Delivered: <FiCheckCircle className="text-green-500" />,
  Cancelled: <FiXCircle className="text-red-500" />,
};

const validStatuses = [
  "Pending",
  "Confirmed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://dairy-shop-app-4.onrender.com/api/v1/orders/get-all-orders"
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return alert("Please select a status first");

    try {
      setUpdating(orderId);
      const res = await axios.put(
        `https://dairy-shop-app-4.onrender.com/api/v1/orders/${orderId}/status`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("✅ Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("❌ Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-10">
      {/* Header Section with Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
          Orders Overview
        </h1>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition ${
            refreshing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <FiRefreshCcw
            className={`text-lg ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No orders found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  🧾 Order ID: {order._id.slice(-6).toUpperCase()}
                </h2>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                >
                  {statusIcons[order.status]}
                  {order.status}
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-gray-700 mb-3">
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {order.customer?.name}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {order.customer?.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> <br />
                  <span>House No: {order.customer?.houseNo}</span> <br />
                  <span>Floor: {order.customer?.floorNo}</span> <br />
                  <span>Building: {order.customer?.buildingName}</span> <br />
                  <span>Landmark: {order.customer?.landmark}</span> <br />
                  {order.customer?.city}, {order.customer?.pincode}
                </p>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                <ul className="text-gray-700 space-y-1">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between text-sm sm:text-base"
                    >
                      <span>
                        {item.name} ({item.unit}) × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-lg font-semibold text-gray-900">
                  Total: ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Admin Status Update */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-4">
                <div className="flex items-center gap-2">
                  <FiEdit3 className="text-gray-500" />
                  <label className="text-sm text-gray-700 font-medium">
                    Update Status:
                  </label>
                  <select
                    className="border rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedStatus[order._id] || order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    {validStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => updateOrderStatus(order._id)}
                  disabled={updating === order._id}
                  className={`${
                    updating === order._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-5 py-2 rounded-lg font-medium transition`}
                >
                  {updating === order._id ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
