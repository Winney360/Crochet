import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShippingFast, FaShieldAlt, FaExchangeAlt, FaPhoneAlt, FaChevronLeft, FaChevronRight, FaArrowDown, FaArrowUp  } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import BestsellerProductCard from '../components/BestSellerProductCard';
import { hardcodedProducts } from '../data/hardcodedProducts';
import axios from 'axios';
import background from '../assets/background/background.jpeg';
import adultimage from '../assets/background/adultimage.webp';
import babyimage from '../assets/background/babyimage.webp';
import bagimage from '../assets/background/bagimage.webp';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCollection, setActiveCollection] = useState('All Collection');
  const [allProductsForCategories, setAllProductsForCategories] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const collectionCategories = ['All Products', 'Baby Collection', 'Adult Clothing', 'Bags Collection'];
  const filteredCollection =
    activeCollection === 'All Products'
      ? allProducts
      : allProducts.filter((product) => product.category === activeCollection);
  const productsToShow = showAllProducts ? filteredCollection : filteredCollection.slice(0, 12);
      

  const heroSlides = [
    {
      title: 'Adult Clothing',
      image: adultimage
    },
    {
      title: 'Baby Collection',
      image: babyimage
    },
    {
      title: 'Bags',
      image: bagimage
    }
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);

    let allProducts = [...hardcodedProducts];
    
    try {
      const featuredResponse = await axios.get(`${API_BASE_URL}/products`);
      if (Array.isArray(featuredResponse.data) && featuredResponse.data.length > 0) {
        const apiProducts = featuredResponse.data;
        allProducts = [
          ...hardcodedProducts,
          ...apiProducts.filter(apiProduct => 
            !hardcodedProducts.some(hardcoded => hardcoded._id === apiProduct._id)
          )
        ];
      }
    } catch (apiError) {
      console.log('Using only hardcoded products');
    }
    
    console.log('Total products:', allProducts.length);

    setAllProducts(allProducts);

    // FEATURED: Only products with is_featured: true
    const featured = allProducts
      .filter(product => product.is_featured === true)
      .slice(0, 8);
    
    // BESTSELLER: Only products with rating >= 4.5
    const bestsellers = allProducts
      .filter(product => (product.rating || 0) >= 4.5)
      .slice(0, 8);
    
    // CATEGORIES: Use ALL products for category filtering
    const allProductsForCategories = allProducts;

    setFeaturedProducts(featured);
    setBestsellerProducts(bestsellers);
    
    // Use ALL products for category filtering, not just featured
    setAllProductsForCategories(allProductsForCategories);

      
      const staticTestimonials = [
        {
          _id: 1,
          customer_name: "Sarah Johnson",
          profession: "Crochet Enthusiast",
          comment: "Absolutely love my crochet bunny! The quality is amazing and it arrived so quickly. Will definitely order again!",
          rating: 5,
          image_url: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"
        },
        {
          _id: 2,
          customer_name: "Mike Chen",
          profession: "Gift Buyer",
          comment: "Perfect gifts for my nieces. They adored the handmade quality and unique designs. The attention to detail is incredible!",
          rating: 5,
          image_url: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
        },
        {
          _id: 3,
          customer_name: "Emily Davis",
          profession: "Interior Designer",
          comment: "The crochet home decor items add such a cozy touch to my projects. Highly recommended for anyone looking for unique pieces!",
          rating: 4,
          image_url: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
        }
      ];

      setTestimonials(staticTestimonials);

      // Static categories for now
      setCategories(collectionCategories);
    } catch (error) {
      console.error('Error fetching data:', error);

      // Fallback: use only hardcoded products
      const featured = hardcodedProducts.filter(product => product.is_featured).slice(0, 8);
      const bestsellers = hardcodedProducts.filter(product => product.rating >= 4.5).slice(0, 8);
      setFeaturedProducts(featured);
      setBestsellerProducts(bestsellers);
      setAllProductsForCategories(hardcodedProducts);
      setTestimonials([]);
      setCategories(collectionCategories);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading beautiful crochet creations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img
            src={background}
            alt="Organic Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>
        </div>

        {/* Static Content (Full Width) */}
        <div className="relative z-20 h-full flex items-center px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl mb-4 text-cyan-400">100% Handmade</h2>
            <h3 className="text-7xl mb-6 font-bold text-pink-400">Crochet Creation</h3>
            <p className="text-lg mb-8 text-cyan-400">Cute, Cozy and Stylish for every Season</p>
            <div className="flex items-center w-full max-w-xl bg-white rounded-full shadow-md border-2 border-pink-400 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search"
                    className="grow px-6 py-3 text-gray-700 focus:outline-none border-none"
                  />
                  <button className="bg-cyan-500 text-white px-6 py-3 font-bold hover:bg-cyan-600 transition-colors rounded-r-full rounded-l-full border-l-3 border-pink-400">
                    Submit Now
                  </button>
                </div>
          </div>
        </div>

        {/* Slideshow Floating on Right Center */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-[520px] h-[400px] z-30 shadow-lg rounded-lg overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10"></div>
              <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
                <div className="bg-cyan-400/40 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <h2 className="text-2xl font-bold text-white">{slide.title}</h2>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-pink-400/40 hover:bg-pink-400/60 text-cyan-400/40 p-2 rounded-full z-40 text-4xl"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-pink-400/40 hover:bg-pink-400/60 text-cyan-400/40 p-2 rounded-full z-40 text-4xl"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Header + Tabs Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-4">
              {/* Left: Heading and Subtext */}
              <div className="text-center lg:text-left p-9 ml-20">
                <h2 className="text-5xl  text-gray-600">Our Crochet</h2>
                <h2 className="text-gray-600 text-5xl ">Products</h2>
              </div>

              {/* Right: Tabs */}
              <div className="flex justify-center lg:justify-end gap-15 flex-wrap">
                {collectionCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCollection(cat)}
                    className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                      activeCollection === cat
                        ? 'bg-cyan-400 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-cyan-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCollection.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {/* Show Toggle Button Only if There Are More Than 12 Products */}
            {filteredCollection.length > 12 && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="flex items-center gap-3 bg-linear-to-r from-cyan-400 to-pink-400 text-white px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg animate-bounce font-semibold"
                >
                  {showAllProducts ? (
                    <>
                      <FaArrowUp className="text-lg" />
                      <span>Show Less Products</span>
                    </>
                  ) : (
                    <>
                      <span>See All {filteredCollection.length} Products</span>
                      <FaArrowDown className="text-lg" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bestseller Products */}
      {bestsellerProducts.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Bestseller Products</h2>
              <p className="text-gray-600">Our most popular products</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellerProducts.map((product) => (
                <BestsellerProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-pink-400 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">10k+</p>
              <p className="text-green-100">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-green-100">Products</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50+</p>
              <p className="text-green-100">Expert Team</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">15+</p>
              <p className="text-green-100">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
              <p className="text-gray-600">Real feedback from our valued customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-white p-8 rounded-lg shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.customer_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.customer_name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.profession}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;