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
    <section className="bg-gray-100 py-8 md:py-16 lg:py-20 mx-4 md:mx-20 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[250px] md:min-h-[350px] lg:min-h-[400px]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 sm:p-4 lg:p-8 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="text-cyan-400 text-4xl sm:text-3xl lg:text-5xl mb-4 lg:mb-8">
                {stat.icon}
              </div>
              
              {/* Label */}
              <h3 className="text-pink-400 font-semibold text-xs sm:text-sm lg:text-lg xl:text-xl uppercase tracking-wide mb-4 lg:mb-6 leading-tight px-2 wrap-break-word">
                {stat.label}
              </h3>
              
              {/* Value */}
              <p className="text-2xl sm:text-xl lg:text-3xl xl:text-4xl font-bold text-gray-800">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsPanel;