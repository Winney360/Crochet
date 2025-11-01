import { Link } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaRuler, 
  FaPalette, 
  FaGift, 
  FaHeart,
  FaStar,
  FaAward
} from 'react-icons/fa';

const ShopDetails = () => {
  const shoppingGuides = [
    {
      icon: <FaRuler className="text-3xl text-cyan-400" />,
      title: 'Size Guide',
      description: 'Find your perfect fit with our detailed sizing charts',
      content: {
        'Baby Clothes': '0-3 months, 3-6 months, 6-12 months, 12-18 months',
        'Adult Clothing': 'XS, S, M, L, XL with exact measurements provided',
        'Bags': 'Small (8-10"), Medium (10-12"), Large (12-15") dimensions',
        'Note': 'All items are handmade - slight variations may occur'
      }
    },
    {
      icon: <FaPalette className="text-3xl text-pink-400" />,
      title: 'Color Guide',
      description: 'Understanding colors and customization options',
      content: {
        'Available Colors': '20+ premium yarn colors available',
        'Custom Colors': 'Bring your own color inspiration',
        'Color Matching': 'Send us fabric/swatch photos for perfect matches',
        'Seasonal Colors': 'Limited edition seasonal colorways'
      }
    },
    {
      icon: <FaGift className="text-3xl text-cyan-400" />,
      title: 'Gift Services',
      description: 'Perfect for special occasions and gift-giving',
      content: {
        'Gift Wrapping': 'Complimentary gift wrapping available',
        'Gift Messages': 'Include personalized notes with your order',
        'Gift Cards': 'Digital gift cards for the perfect present',
        'Special Occasions': 'Birthdays, baby showers, weddings, anniversaries'
      }
    },
    {
      icon: <FaHeart className="text-3xl text-pink-400" />,
      title: 'Care Guide',
      description: 'Keep your crochet pieces looking beautiful',
      content: {
        'Washing': 'Hand wash in cold water with mild detergent',
        'Drying': 'Lay flat to dry - never tumble dry',
        'Storage': 'Store folded in cool, dry place away from direct sunlight',
        'Maintenance': 'Gentle spot cleaning recommended for stains'
      }
    }
  ];

  const materialInfo = [
    {
      name: 'Premium Cotton',
      benefits: ['Soft & breathable', 'Machine washable', 'Perfect for baby items', 'Hypoallergenic'],
      bestFor: 'Baby clothes, summer wear, sensitive skin'
    },
    {
      name: 'Acrylic Yarn',
      benefits: ['Durable & long-lasting', 'Colorfast', 'Easy care', 'Budget-friendly'],
      bestFor: 'Everyday items, bags, home decor'
    },
    {
      name: 'Wool Blend',
      benefits: ['Warm & cozy', 'Elastic recovery', 'Moisture-wicking', 'Winter appropriate'],
      bestFor: 'Winter wear, blankets, cold weather accessories'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-pink-400 to-cyan-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Shopping Guide</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Everything you need to know for the perfect shopping experience
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-white text-pink-400 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300"
            >
              Start Shopping
            </Link>
            <a
              href="#guides"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-pink-400 transition-all duration-300"
            >
              Explore Guides
            </a>
          </div>
        </div>
      </div>

      {/* Shopping Guides */}
      <section id="guides" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Shopping Guides</h2>
            <p className="text-gray-600 text-lg">Essential information to help you shop with confidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shoppingGuides.map((guide, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  {guide.icon}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{guide.title}</h3>
                    <p className="text-gray-600">{guide.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(guide.content).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-cyan-400 pl-4">
                      <h4 className="font-semibold text-gray-800">{key}</h4>
                      <p className="text-gray-600 text-sm mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Information */}
      <section className="py-16 bg-linear-to-br from-cyan-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Materials</h2>
            <p className="text-gray-600 text-lg">Premium quality yarns for exceptional results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {materialInfo.map((material, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-linear-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaAward className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{material.name}</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {material.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <FaStar className="text-cyan-400 text-xs" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Best For:</h4>
                  <p className="text-sm text-gray-600">{material.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Quick Shopping Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { tip: 'Measure Twice', desc: 'Check our size guide before ordering' },
                { tip: 'Custom Colors', desc: 'We can match any color you love' },
                { tip: 'Gift Ready', desc: 'Perfect presents with personal touches' },
                { tip: 'Care Matters', desc: 'Follow care instructions for longevity' }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-400 mb-2">{item.tip}</div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-pink-400 to-cyan-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Now that you're equipped with all the information, explore our beautiful collection
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-pink-400 px-12 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Browse Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShopDetails;