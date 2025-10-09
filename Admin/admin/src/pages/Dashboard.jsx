import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Products",
      description: "Manage all store products",
      color: "bg-blue-500",
      path: "/products",
      icon: "🧃",
    },
    {
      title: "Orders",
      description: "View and manage orders",
      color: "bg-green-500",
      path: "/orders",
      icon: "📦",
    },
    {
      title: "Delivery Charges",
      description: "Set or edit delivery fees",
      color: "bg-yellow-500",
      path: "/delivery-charges",
      icon: "💸",
    },
    {
      title: "Settings",
      description: "Change preferences & login info",
      color: "bg-purple-500",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 text-center">
        Admin Dashboard
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className={`${card.color} text-white rounded-2xl shadow-lg cursor-pointer p-6 sm:p-8 flex flex-col items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-300`}
          >
            <div className="text-6xl mb-4">{card.icon}</div>
            <h2 className="text-xl sm:text-2xl font-semibold text-center">{card.title}</h2>
            <p className="text-sm sm:text-base mt-2 text-center opacity-90">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
