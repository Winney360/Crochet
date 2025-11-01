import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Arrows */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {/* Left Arrow */}
          <button 
            onClick={prevTestimonial}
            className="p-3 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">
            What Our Clients Say
          </h2>

          {/* Right Arrow */}
          <button 
            onClick={nextTestimonial}
            className="p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center">
            {/* Quote Icon */}
            <FaQuoteLeft className="text-4xl text-cyan-400 mx-auto mb-6" />
            
            {/* Testimonial Text */}
            <p className="text-lg md:text-xl text-gray-600 italic mb-8 leading-relaxed">
              "{testimonials[currentIndex].comment}"
            </p>

            {/* Client Info */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-linear-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonials[currentIndex].customer_name.charAt(0)}
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {testimonials[currentIndex].customer_name}
                </h4>
                <p className="text-cyan-500">{testimonials[currentIndex].profession}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i}
                      className={`text-lg ${
                        i < testimonials[currentIndex].rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-cyan-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;