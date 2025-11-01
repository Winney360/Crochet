import React from "react";
import { Link } from 'react-router-dom';
import crochetImage from '../assets/background/crochet-image.jpg';

const PromoSection = () => {
  const handleShopClick = () => {
    // Scroll to top when navigating to shop
    window.scrollTo(0, 0);
  };

  return (
    <section className="bg-cyan-400 px-16 py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="max-w-md text-white">
          <h1 className="text-6xl  font-bold leading-tight">
            <span className="block">From Our Hands</span>
            <span className="block">To Your Heart</span>
          </h1>
          <h3 className="mt-6 text-xl md:text-2xl text-white/90">
            Discover the Magic of Crochet.
          </h3>
          <Link to="/shop" onClick={handleShopClick}>
            <button className="mt-8 border hover:bg-pink-400 text-white font-bold py-4 px-10 rounded-full shadow-xl transition duration-300 text-lg">
              SHOP NOW
            </button>
          </Link>
        </div>

        {/* Image + Price Tag */}
        <div className="relative">
          <img
            src={crochetImage}
            alt="Crochet Products"
            className="w-130 h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoSection;