import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ADD useNavigate here
import { FaStar, FaShippingFast, FaShieldAlt, FaExchangeAlt, FaPhoneAlt, FaChevronLeft, FaChevronRight, FaArrowDown, FaArrowUp,  FaQuoteRight, FaSearch } from 'react-icons/fa'; // ADD FaSearch here
import ProductCard from '../components/ProductCard';
import BestsellerProductCard from '../components/BestSellerProductCard';
import { hardcodedProducts } from '../data/hardcodedProducts';
import StatsPanel from "../components/StatsPanel";
import PromoSection from "../components/PromoSection";
import axios from 'axios';
import background from '../assets/background/background.jpeg';
import adultimage from '../assets/background/adultimage.webp';
import babyimage from '../assets/background/babyimage.webp';
import bagimage from '../assets/background/bagimage.webp';
import loiseimage from '../assets/testimonies/loise.jpg';
import meimage from '../assets/testimonies/me.jpg';
import sharlineimage from '../assets/testimonies/sharline.jpg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCollection, setActiveCollection] = useState('All Products');
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  
  // ADD THESE TWO LINES FOR SEARCH FUNCTIONALITY
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const collectionCategories = ['All Products', 'Baby Collection', 'Adult Clothing', 'Bags Collection'];
  
  // Static testimonials (no need to fetch or store in state since they're static)
  const testimonials = useMemo(() => [
    {
      _id: 1,
      customer_name: "Winnie",
      profession: "Crochet Enthusiast",
      comment: "Absolutely love my crochet bunny! The quality is amazing. Will definitely order again!",
      rating: 5,
      image_url: meimage
    },
    {
      _id: 2,
      customer_name: " Loise ",
      profession: "Gift Buyer",
      comment: "Perfect gifts for my nieces. They adored the handmade quality and unique designs. The attention to detail is incredible!",
      rating: 5,
      image_url: loiseimage
    },
    {
      _id: 3,
      customer_name: "Sharline",
      profession: "Student",
      comment: "The crochet bag I purchased is not only stylish but also very durable. I've received so many compliments on it!",
      rating: 4,
      image_url: sharlineimage
    }
  ], []);
  
  // Memoize filtered collection to prevent recalculation on every render
  const filteredCollection = useMemo(() => {
    return activeCollection === 'All Products'
      ? allProducts
      : allProducts.filter((product) => product.category === activeCollection);
  }, [activeCollection, allProducts]);
  
  const productsToShow = useMemo(() => {
    return showAllProducts ? filteredCollection : filteredCollection.slice(0, 12);
  }, [showAllProducts, filteredCollection]);
      

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

  // ADD THIS SEARCH FUNCTION
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to shop page with search query
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      // Clear search input
      setSearchTerm('');
    }
  }, [searchTerm, navigate]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000); 
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const fetchData = async () => {
  try {
    setLoading(true);

    // Start with hardcoded products immediately for faster initial render
    let allProducts = hardcodedProducts;
    
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

    // FEATURED: Only products with is_featured: true (limit to 9 for performance)
    const featured = allProducts
      .filter(product => product.is_featured === true)
      .slice(0, 9);
    
    // BESTSELLER: Only products with rating >= 4.5 (limit to 9 for performance)
    const bestsellers = allProducts
      .filter(product => (product.rating || 0) >= 4.5)
      .slice(0, 9);

    setFeaturedProducts(featured);
    setBestsellerProducts(bestsellers);
    } catch (error) {
      console.error('Error fetching data:', error);

      // Fallback: use only hardcoded products
      const featured = hardcodedProducts.filter(product => product.is_featured).slice(0, 9);
      const bestsellers = hardcodedProducts.filter(product => product.rating >= 4.5).slice(0, 9);
      setFeaturedProducts(featured);
      setBestsellerProducts(bestsellers);
      setAllProducts(hardcodedProducts);
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
<section className="relative h-auto lg:h-[600px] w-full overflow-hidden">
  {/* Background Image with Blur */}
  <div className="absolute inset-0">
    <img
      src={background}
      alt="Organic Background"
      className="w-full h-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>
  </div>

  {/* Content Wrapper - Added items-center for vertical centering */}
  <div className="relative z-20 flex flex-col lg:flex-row items-center lg:items-center justify-center h-auto lg:h-full px-4 sm:px-6 lg:px-8 py-10 lg:py-0 gap-8">
    {/* Left Side: Text + Search */}
    <div className="max-w-2xl w-full">
      <h2 className="text-2xl mb-4 text-cyan-400">100% Handmade</h2>
      <h3 className="text-5xl sm:text-6xl lg:text-7xl mb-6 font-bold text-pink-400">Crochet Creation</h3>
      <p className="text-lg mb-8 text-cyan-400">Cute, Cozy and Stylish for every Season</p>

      {/* Responsive Search Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-full shadow-md border-2 border-pink-400 flex items-center overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search crochet products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="grow px-4 py-3 text-gray-700 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
        />
        <button
          type="submit"
          className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-4 sm:px-5 sm:gap-2 transition-colors text-sm sm:text-base"
        >
          <FaSearch className="text-sm sm:text-md" />
          Search
        </button>
      </form>
    </div>

    {/* Right Side: Slideshow */}
    <div className="relative w-full sm:w-[520px] h-[300px] sm:h-[400px] shadow-lg rounded-lg overflow-hidden">
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
            loading={index === 0 ? 'eager' : 'lazy'}
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-pink-400/40 hover:bg-pink-400/60 text-cyan-400/40 p-2 rounded-full z-40 text-2xl sm:text-4xl"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-pink-400/40 hover:bg-pink-400/60 text-cyan-400/40 p-2 rounded-full z-40 text-2xl sm:text-4xl"
      >
        <FaChevronRight />
      </button>
    </div>
  </div>
</section>

      {/* Categories Section */}
      {allProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Header + Tabs Row */}
            <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
              {/* Left: Heading and Subtext - Single line on mobile, two lines on desktop */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-600 block lg:hidden">
                  Our Crochet Products
                </h2>
                <div className="hidden lg:block">
                  <h2 className="text-5xl text-gray-600">Our Crochet</h2>
                  <h2 className="text-gray-600 text-5xl">Products</h2>
                </div>
              </div>

              {/* Right: Tabs - Row below heading on mobile */}
              <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                {collectionCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCollection(cat)}
                    className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-full font-semibold transition-colors ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 products-grid">
              {productsToShow.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
           
            {/* Show Toggle Button Only if There Are More Than 12 Products */}
            {filteredCollection.length > 12 && (
              <div className={`flex justify-center mt-12 ${showAllProducts ? 'sticky bottom-8 z-50' : ''}`}>
                <button 
                  onClick={() => {
                    const wasShowingAll = showAllProducts;
                    setShowAllProducts(!showAllProducts);
                    
                    // Scroll to products grid when clicking "Show Less Products"
                    if (wasShowingAll) {
                      setTimeout(() => {
                        const productsGrid = document.querySelector('.products-grid');
                        if (productsGrid) {
                          const yOffset = -100; // Adjust this value as needed
                          const y = productsGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 50);
                    }
                  }}
                  className={`flex items-center gap-3 bg-linear-to-r from-cyan-400 to-pink-400 text-white px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg font-semibold ${
                    showAllProducts ? 'animate-bounce' : 'animate-pulse'
                  }`}
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

      {/* Promo Section */}
      <PromoSection />

      {/* Bestseller Products */}
      {bestsellerProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Bestseller Products</h2>
              <p className="text-gray-600">From tiny stitches to timeless style-these crochet favorites have stolen hearts everywhere. Cozy up with our bestsellers today.</p>
              <p> ~ " Every piece tells a story-here are the ones that touched the most hearts"~</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
              {bestsellerProducts.map((product) => (
                <BestsellerProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
      
     

      {/* Stats Section */}
      <StatsPanel />

      
      

     
{/* Testimonials Section */}
{testimonials.length > 0 && (
  <section className="py-16">
    <div className="container mx-auto px-4">
      {/* Header with Arrows - Responsive layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-pink-400 mb-2 sm:mb-4">Our Testimonial</h2>
          <p className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-700">Our Client Saying !</p>
        </div>
        
        {/* Arrows - Now below on mobile, right on desktop */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentTestimonialIndex((prev) => 
              prev === 0 ? testimonials.length - 1 : prev - 1
            )}
            className="p-3 h-12 w-12 rounded-full border border-cyan-400 text-pink-400 hover:bg-cyan-400 transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <button
            onClick={() => setCurrentTestimonialIndex((prev) => 
              (prev + 1) % testimonials.length
            )}
            className="p-3 h-12 w-12 rounded-full border border-cyan-400 text-pink-400 hover:bg-cyan-400 transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* FIXED: Single testimonial on mobile, two on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* First Testimonial - Always visible */}
        <div className="bg-gray-100 p-6 md:p-8 rounded-lg shadow-md">
          <div className="transition-opacity duration-500 opacity-100">
            {/* Description at the top */}
            <p className="text-gray-600 italic mb-6 text-base md:text-lg leading-relaxed">
              "{testimonials[currentTestimonialIndex]?.comment || 'No comment available'}"
            </p>

            {/* Horizontal line */}
            <div className="border-t border-cyan-400 mb-6"></div>

            {/* Client info section */}
            <div className="flex items-center justify-between">
              {/* Left: Client image and info */}
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src={testimonials[currentTestimonialIndex]?.image_url || ''}
                  alt={testimonials[currentTestimonialIndex]?.customer_name || 'Customer'}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                  loading="lazy"
                />
                
                {/* Center: Client name, profession, and stars */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                    {testimonials[currentTestimonialIndex]?.customer_name || 'Anonymous'}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">
                    {testimonials[currentTestimonialIndex]?.profession || 'Customer'}
                  </p>
                  <div className="flex gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs md:text-sm ${
                          i < (testimonials[currentTestimonialIndex]?.rating || 0) ? 'text-pink-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Far right: Quote icon */}
              <div className="text-cyan-400">
                <FaQuoteRight className="text-2xl md:text-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Second Testimonial - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block bg-gray-100 p-8 rounded-lg shadow-md">
          <div className="transition-opacity duration-500 opacity-100">
            {/* Description at the top */}
            <p className="text-gray-600 italic mb-6 text-lg leading-relaxed">
              "{testimonials[(currentTestimonialIndex + 1) % testimonials.length]?.comment || 'No comment available'}"
            </p>

            {/* Horizontal line */}
            <div className="border-t border-cyan-400 mb-6"></div>

            {/* Client info section */}
            <div className="flex items-center justify-between">
              {/* Left: Client image and info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[(currentTestimonialIndex + 1) % testimonials.length]?.image_url || ''}
                  alt={testimonials[(currentTestimonialIndex + 1) % testimonials.length]?.customer_name || 'Customer'}
                  className="w-16 h-16 rounded-full object-cover"
                  loading="lazy"
                />
                
                {/* Center: Client name, profession, and stars */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800">
                    {testimonials[(currentTestimonialIndex + 1) % testimonials.length]?.customer_name || 'Anonymous'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {testimonials[(currentTestimonialIndex + 1) % testimonials.length]?.profession || 'Customer'}
                  </p>
                  <div className="flex gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < (testimonials[(currentTestimonialIndex + 1) % testimonials.length]?.rating || 0) ? 'text-pink-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Far right: Quote icon */}
              <div className="text-cyan-400">
                <FaQuoteRight className="text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8 md:hidden">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonialIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentTestimonialIndex 
                ? 'bg-cyan-500 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  </section>
)}
   
  </div>
  );
};

export default Home;