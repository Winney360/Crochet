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
    <section className="bg-gray-100 py-12 md:py-20 mr-4 md:mr-20 ml-4 md:ml-20 rounded-lg">
      <div className="max-w-6xl mx-auto px-4 md:px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 min-h-[300px] md:min-h-[400px]">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col items-center text-center mr-1 md:mr-2 ml-1 md:ml-2"
          >
            <div className="text-cyan-400 text-4xl md:text-5xl mb-4 md:mb-15 mt-4 md:mt-10">
              {stat.icon}
            </div>
            <h3 className="text-pink-400 font-semibold text-sm md:text-4xl uppercase tracking-wide mb-4 md:mb-10 px-2 break-words">
              {stat.label}
            </h3>
            <p className="text-2xl md:text-4xl font-semibold text-gray-700 mt-2 md:mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsPanel;