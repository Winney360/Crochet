const mongoose = require('mongoose');
const Testimonial = require('./models/Testimonial');
require('dotenv').config();

const sampleTestimonials = [
  {
    customer_name: "Sarah Johnson",
    profession: "Crochet Enthusiast",
    comment: "Absolutely love my crochet bunny! The quality is amazing and it arrived so quickly. Will definitely order again!",
    rating: 5,
    image_url: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"
  },
  {
    customer_name: "Mike Chen",
    profession: "Gift Buyer",
    comment: "Perfect gifts for my nieces. They adored the handmade quality and unique designs. The attention to detail is incredible!",
    rating: 5,
    image_url: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
  },
  {
    customer_name: "Emily Davis",
    profession: "Interior Designer",
    comment: "The crochet home decor items add such a cozy touch to my projects. Highly recommended for anyone looking for unique pieces!",
    rating: 4,
    image_url: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
  },
  {
    customer_name: "David Wilson",
    profession: "New Parent",
    comment: "The baby crochet items are so soft and safe. My daughter loves her new blanket and it's held up perfectly in the wash!",
    rating: 5,
    image_url: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  }
];

const addTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crochet-website');
    console.log('Connected to MongoDB');

    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');

    // Add sample testimonials
    await Testimonial.insertMany(sampleTestimonials);
    console.log('Sample testimonials added successfully!');

    const testimonials = await Testimonial.find();
    console.log('\nCurrent testimonials in database:');
    testimonials.forEach(testimonial => {
      console.log(`- ${testimonial.customer_name}: ${testimonial.rating} stars`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error adding testimonials:', error);
    process.exit(1);
  }
};

addTestimonials();