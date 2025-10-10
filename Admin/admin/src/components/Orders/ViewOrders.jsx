import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";

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

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://dairy-shop-app-4.onrender.com/api/v1/orders/get-all-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Orders Overview
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No orders found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              {/* Order Header */}
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
                  <span className="font-semibold">Address:</span>{" "}
                  {order.customer?.address?.houseNo},{" "}
                  {order.customer?.address?.city},{" "}
                  {order.customer?.address?.pincode}
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
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <p className="text-lg font-semibold text-gray-900">
                  Total: ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
