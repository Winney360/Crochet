import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQs = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    
    {
      question: "Do you accept custom orders?",
      answer: "Yes! We love creating custom pieces. Please contact us via WhatsApp or email with your ideas, and we'll work with you to bring your vision to life."
    },
    {
      question: "How do I care for my crochet items?",
      answer: "Most crochet items should be hand washed in cold water with mild detergent and laid flat to dry. Avoid machine washing and drying to maintain the shape and quality of your pieces."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa and Cash payment."
    },
    {
      question: "How do I know what size to order?",
      answer: " If you're unsure, feel free to contact us with your measurements, and we'll help you choose the perfect size."
    },
    {
        question: "Do you do Delivery?",
        answer: "Unfortunately, we do not offer delivery services at the moment. However, you can pick up your order from our location."
    },
    {
        question: "How long does it take for my order to be cancelled?",
        answer: "Orders are typically cancelled after 7 days of failing to pick from our location. If you need more time, please contact us to discuss your order."
    },
  ];

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
                <span className="text-gray-700 font-medium">FAQs</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our products, shipping, and policies.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                  {openQuestion === index ? (
                    <FaChevronUp className="text-cyan-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                {openQuestion === index && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-linear-to-r from-pink-400 to-cyan-400 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're here to help! Contact us directly and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/254791995578"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              WhatsApp Us
            </a>
            <a
              href="mailto:shikukucrochet@gmail.com"
              className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;