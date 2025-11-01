import React from "react";
import { FaUsers, FaStar, FaPaintBrush, FaBoxOpen } from "react-icons/fa";

const stats = [
  { label: "SATISFIED CUSTOMERS", value: "250+", icon: <FaUsers /> },
  { label: "QUALITY OF SERVICE", value: "99%", icon: <FaStar /> },
  { label: "HANDMADE CREATIONS", value: "400+", icon: <FaPaintBrush /> },
  { label: "AVAILABLE PRODUCTS", value: "200+", icon: <FaBoxOpen /> },
];

const StatsPanel = () => {
  return (
    <section className="bg-gray-100 py-20 mr-20 ml-20 rounded-lg">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-[400px] ">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center mr-2 ml-2"
          >
            <div className="text-cyan-400 text-5xl mb-15 mt-10">{stat.icon}</div>
            <h3 className="text-pink-400 font-semibold text-4xl uppercase tracking-wide mb-10">
              {stat.label}
            </h3>
            <p className="text-4xl font-semibold text-gray-700 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsPanel;