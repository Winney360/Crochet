# 🧶 Crochet Website - Handmade Creations E-Commerce

A full-stack e-commerce platform for selling handmade crochet products. Built with React, Node.js, Express, and MongoDB, featuring a modern UI, shopping cart, admin dashboard, and more.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-06B6D4?logo=tailwindcss)

## ✨ Features

### Customer Features

- 🏠 **Beautiful Landing Page** - Hero carousel, featured products, testimonials
- 🛍️ **Product Catalog** - Browse products by category with filtering and sorting
- 🔍 **Search Functionality** - Find products quickly by name, description, or category
- 🛒 **Shopping Cart** - Add, remove, and manage cart items with persistent storage
- 💳 **Checkout Process** - WhatsApp integration for order placement
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ⚡ **Performance Optimized** - Lazy loading, code splitting, and image optimization
- 📧 **Contact Form** - EmailJS integration for customer inquiries

### Admin Features

- 🔐 **Secure Authentication** - JWT-based admin login
- 📊 **Dashboard** - View and manage all products
- ➕ **Product Management** - Add, edit, and delete products
- 🖼️ **Image Upload** - Cloudinary integration for image storage
- 📈 **Statistics Panel** - Track key business metrics

## 🚀 Tech Stack

### Frontend

- **React 19** - UI library with modern hooks
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **EmailJS** - Contact form integration

### Backend

- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and CDN
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
CrochetWebsite/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── api/           # API configuration (axios)
│   │   ├── assets/        # Images and static assets
│   │   │   ├── background/   # Hero images
│   │   │   └── testimonies/  # Testimonial photos
│   │   ├── components/    # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ...
│   │   ├── context/       # React Context
│   │   │   ├── CartContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── data/          # Hardcoded products
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Node.js application
    ├── middleware/        # Authentication middleware
    │   └── auth.js
    ├── models/            # Mongoose schemas
    │   ├── Product.js
    │   ├── Admin.js
    │   ├── Cart.js
    │   └── Testimonial.js
    ├── routes/            # API routes
    │   ├── products.js
    │   ├── auth.js
    │   ├── cart.js
    │   └── testimonials.js
    ├── server.js          # Server entry point
    ├── createAdmin.js     # Admin creation script
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crochet-website.git
cd CrochetWebsite
```

### 2. Backend Setup

```bash
cd server
pnpm install
```

Create `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crochet-website
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crochet-website

JWT_SECRET=your_super_secret_jwt_key_change_this

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup

```bash
cd ../client
pnpm install
```

Create `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Create Admin Account

```bash
cd ../server
node createAdmin.js
```

Follow the prompts to create an admin account with username and password.

## 🚦 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
pnpm run dev
```

Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd client
pnpm run dev
```

Client runs on: `http://localhost:5173`

Open `http://localhost:5173` in your browser to view the website.

### Production Build

**Frontend:**

```bash
cd client
pnpm run build
pnpm run preview
```

**Backend:**

```bash
cd server
node server.js
```

## 📝 Available Scripts

### Client (Frontend)

- `pnpm run dev` - Start Vite development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally
- `pnpm run lint` - Run ESLint

### Server (Backend)

- `pnpm run dev` - Start development server with nodemon (auto-restart)
- `node server.js` - Start production server
- `node createAdmin.js` - Create a new admin account

## 🎨 Customization

### Adding Products

1. Navigate to `/admin/login`
2. Log in with admin credentials
3. Click "Add New Product" button
4. Fill in product details:
   - Name, description, price
   - Category (Baby Collection, Adult Clothing, Bags Collection)
   - Rating, featured status
   - Upload images (up to 10 per product)
5. Products appear immediately on shop page

### Styling & Theme

- **Color Scheme**: Pink (#FF69B4) and Cyan (#00CED1)
- **Primary Colors**:
  - `pink-400` for CTAs and accents
  - `cyan-400` for secondary elements
- Modify colors in component classes or `tailwind.config.js`
- Global styles in `client/src/index.css`

### Replacing Images

- **Hero Images**: `client/src/assets/background/`
  - `adultimage.webp` - Adult clothing hero
  - `babyimage.webp` - Baby collection hero
  - `bagimage.webp` - Bags collection hero
  - `background.jpeg` - Main background
- **Testimonial Photos**: `client/src/assets/testimonies/`
- **Product Images**: Uploaded via admin dashboard (stored in Cloudinary)

### Contact Form Configuration

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Get Service ID, Template ID, and Public Key
3. Update `client/src/pages/Contact.jsx` with your credentials

## 🌐 Deployment

### Frontend Deployment (Vercel - Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Set build settings:
   - **Build Command**: `cd client && pnpm install && pnpm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `pnpm install`
4. Add environment variable:
   - `VITE_API_BASE_URL` = Your backend URL

### Backend Deployment (Railway/Render/Heroku)

**Railway (Recommended):**

1. Create new project on [Railway](https://railway.app/)
2. Connect GitHub repository
3. Set root directory to `server`
4. Add environment variables (all from `.env`)
5. Deploy automatically

**Environment Variables to Set:**

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database (MongoDB Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (or allow from anywhere: `0.0.0.0/0`)
4. Get connection string
5. Update `MONGODB_URI` in backend environment variables

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth for admin
- **Password Hashing** - bcryptjs with salt rounds
- **Protected Routes** - Middleware checks for valid tokens
- **CORS Configuration** - Controlled cross-origin requests
- **Input Validation** - Server-side validation for all inputs
- **Secure File Upload** - Multer with file type and size restrictions
- **Environment Variables** - Sensitive data not in code

## 🐛 Troubleshooting

### Website Loading Slowly?

✅ **Fixed with Performance Optimizations:**

- Lazy loading implemented for routes
- Images use `loading="lazy"` attribute
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Check [PERFORMANCE_IMPROVEMENTS.md](client/PERFORMANCE_IMPROVEMENTS.md)

### Products Not Showing?

- Verify MongoDB is running and connected
- Check `VITE_API_BASE_URL` in client `.env`
- Open browser DevTools → Network tab → Check API calls
- Hardcoded products should show even if API fails

### Admin Login Not Working?

- Ensure admin account created with `createAdmin.js`
- Check `JWT_SECRET` is set in server `.env`
- Clear browser localStorage and cookies
- Check browser console for error messages

### Images Not Uploading?

- Verify Cloudinary credentials in `.env`
- Check file size (5MB limit)
- Ensure file is an image format (jpg, png, webp)
- Check browser console for upload errors

### Cart Items Disappearing?

- Cart uses localStorage for persistence
- Check browser localStorage is enabled
- Clear cache and reload if issues persist

## 📊 Performance Metrics

**After Optimizations:**

- Initial Load: ~1-2 seconds (on average connection)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+ (Performance)

**Optimizations Applied:**

- Code splitting for all routes
- Lazy loading for images
- Memoization for expensive computations
- Reduced initial bundle size by 60%

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

For questions, issues, or suggestions:

- **WhatsApp**: [+254 791 995 578](https://wa.me/254791995578)
- **Email**: Contact form on website
- **Location**: Nairobi, Kenya

## 🎯 Roadmap

### Future Enhancements

- [ ] Payment gateway integration (M-Pesa, PayPal)
- [ ] User accounts and order history
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email newsletters
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities (offline mode)

## 🙏 Acknowledgments

- **Cloudinary** - Image hosting and CDN
- **EmailJS** - Contact form service
- **React Icons** - Beautiful icon library
- **TailwindCSS** - Utility-first CSS framework
- **MongoDB** - Flexible NoSQL database
- All the amazing open-source contributors

---

<div align="center">

**Made with 🧶 and ❤️ by Winfred**

_Every stitch tells a story - Handcrafted with passion_

[⬆ Back to Top](#-crochet-website---handmade-creations-e-commerce)

</div>
