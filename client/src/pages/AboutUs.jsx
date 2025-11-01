import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-700 font-medium">About Us</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">About ShikuStitch Crochet</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handcrafting beautiful crochet pieces with love, passion, and attention to detail since 2024.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Story Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Welcome to ShikuStitch Crochet, where every stitch tells a story of creativity and craftsmanship. 
                Founded in 2024, our journey began with a simple passion for transforming yarn into beautiful, 
                functional pieces that bring joy to everyday life.
              </p>
              <p>
                What started as a personal hobby quickly grew into a beloved business as friends and family 
                fell in love with our unique creations. Each piece is meticulously handcrafted with premium 
                materials, ensuring not just beauty but durability that lasts.
              </p>
              <p>
                We believe in the power of handmade items to create connections, tell stories, and add that 
                special touch of warmth to your home and wardrobe. Every order is made with care, and we pour 
                our heart into every single stitch.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-cyan-500 mb-3">Quality Craftsmanship</h3>
                <p className="text-gray-600">
                  We use only the finest yarns and materials, and each piece undergoes rigorous quality checks 
                  to ensure it meets our high standards.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-pink-500 mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  Our crochet pieces are made to last, reducing the need for fast fashion. We source eco-friendly 
                  materials whenever possible.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-cyan-500 mb-3">Customer Love</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We work closely with customers to create custom pieces 
                  that perfectly match their vision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Design & Plan</h3>
              <p className="text-gray-600">
                We sketch designs and select the perfect yarn colors and textures for each unique piece.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Handcraft with Care</h3>
              <p className="text-gray-600">
                Each piece is carefully crocheted stitch by stitch, ensuring perfect tension and detail.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Check & Picking</h3>
              <p className="text-gray-600">
                Every item is inspected, carefully packaged, and well stored for you to pick up.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-linear-to-r from-cyan-400 to-pink-400 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Piece?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our collection of handmade crochet creations
          </p>
          <Link
            to="/shop"
            className="bg-white text-cyan-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;