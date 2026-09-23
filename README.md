# 🧶 Crochet Website - Handmade Creations E-Commerce

A full-stack e-commerce platform for selling handmade crochet products. Built with React, Node.js, Express, and MongoDB, featuring a modern UI, shopping cart, admin dashboard, and more.

**[🌐 View Live Demo](https://shikuku-crochet.vercel.app/)** | **[📖 GitHub Repository](#)**

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-06B6D4?logo=tailwindcss)

## ✨ Features

**Live at:** [https://shikuku-crochet.vercel.app/](https://shikuku-crochet.vercel.app/)

### Customer Features

- 🏠 **Beautiful Landing Page** - Hero carousel, featured products, testimonials
- 🛍️ **Product Catalog** - Browse products by category with filtering and sorting
- 🔍 **Search Functionality** - Find products quickly by name, description, or category
- 🛒 **Shopping Cart** - Add, remove, and manage cart items with persistent storage
- 💳 **Checkout Process** - Pay online via M-Pesa (Lipa Na M-Pesa / STK Push to Paybill) with WhatsApp order placement as a fallback
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
- **Safaricom Daraja API** - M-Pesa payment integration (Lipa Na M-Pesa Online / STK Push)

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
    │   ├── Order.js      # Order records (created at checkout)
    │   └── Testimonial.js
    ├── routes/            # API routes
    │   ├── products.js
    │   ├── auth.js
    │   ├── cart.js
    │   ├── mpesa.js      # M-Pesa STK Push, callback, and status query
    │   └── testimonials.js
    ├── utils/            # Helper modules
    │   └── mpesa.js      # Daraja API helpers (token, STK push, status query)
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

### 3. M-Pesa (Daraja API) Setup

Create a developer account at [developer.safaricom.co.ke](https://developer.safaricom.co.ke/) and add the following to the server `.env`:

```env
# M-Pesa Configuration (Safaricom Daraja API)
MPESA_ENV=sandbox                              # "sandbox" for testing, "production" for live payments
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_lipa_na_mpesa_passkey        # From the Lipa Na M-Pesa Online product settings
MPESA_SHORTCODE=174379                         # Paybill business number (174379 = sandbox test)
MPESA_CALLBACK_URL=https://your-api-url.com/api/mpesa/callback
```

> **Sandbox testing:** In `sandbox` mode use the test phone number `254791995578` — no real money is moved. Get your sandbox credentials + passkey from the Daraja portal → "Lipa Na M-Pesa Online" → "Sandbox" section.
>
> **Going live:** Fill the above with your production credentials, set `MPESA_ENV=production`, replace `MPESA_SHORTCODE` with your real paybill number, and set `MPESA_CALLBACK_URL` to your publicly reachable backend URL (e.g. Render). Submit a **Go-Live** request in the Daraja portal and Safaricom will approve/whitelist your callback URL.

### 4. Frontend Setup

```bash
cd ../client
pnpm install
```

Create `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Create Admin Account

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

## 💸 M-Pesa Payments (Lipa Na M-Pesa)

Payments are handled through the **Safaricom Daraja API** using **Lipa Na M-Pesa Online (STK Push)**. The buyer enters their phone number at checkout, receives an M-Pesa prompt on their phone, approves it with their PIN, and the money is paid directly to your **Paybill** business number.

```
Buyer at checkout
   → selects "Pay with M-Pesa", enters phone
   → POST /api/mpesa/stkpush   (creates Order, triggers STK push)
   → Buyer approves on phone (enters M-Pesa PIN)
   → Safaricom POSTs result to /api/mpesa/callback
   → Frontend polls POST /api/mpesa/query until status is confirmed
   → Order marked "paid" → cart cleared → success page
```

### API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/mpesa/stkpush` | Initiates an STK push. Body: `{ phone, fullName, email, pickupLocation, notes, items, total }`. Returns `checkoutRequestID`. |
| `POST` | `/api/mpesa/callback` | Safaricom's callback (no auth required). Updates order status to `paid`/`failed`. |
| `POST` | `/api/mpesa/query` | Queries transaction status by `checkoutRequestID`. Used for frontend polling while the buyer approves the prompt. |

### Payment Statuses (Order model)

- `pending` - Payment initiated, waiting for buyer approval
- `completed` - Payment received (STK push result code `0`)
- `failed` - Payment declined/cancelled/user timeout

### Testing Checklist (Sandbox)

1. Use `MPESA_ENV=sandbox` with sandbox consumer key/secret/passkey from the Daraja portal.
2. Checkout with the test phone `254791995578`.
3. Confirm the STK push request succeeds (returns `checkoutRequestID`); sandbox does not fire live callbacks, so verify the order flips via `/api/mpesa/query` in the Mongo `orders` collection.

### Going Live Checklist (Production)

1. Confirm your Paybill has the **Lipa Na M-Pesa Online** product enabled.
2. Replace sandbox credentials/passkey and shortcode with production values; set `MPESA_ENV=production`.
3. Set `MPESA_CALLBACK_URL` to a public HTTPS endpoint (e.g. `https://shikuku-crochet.onrender.com/api/mpesa/callback`) and add it to your Daraja app's production callback list.
4. Submit a **Go-Live** request at [developer.safaricom.co.ke](https://developer.safaricom.co.ke/) and wait for approval.

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

# M-Pesa (Safaricom Daraja API) - production values
MPESA_ENV=production
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_SHORTCODE=your_paybill_number
MPESA_CALLBACK_URL=https://your-backend-domain/api/mpesa/callback
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
- **Environment Variables** - Sensitive data not in code (including all M-Pesa/Daraja credentials)

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

### M-Pesa Payment Not Working?

- Verify `MPESA_ENV`, `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, and `MPESA_PASSKEY` are set in server `.env`
- In sandbox, the buyer must use the test phone `254791995578`; real phones won't receive the prompt
- Check the phone number format is valid (e.g. `0712...` → normalized to `254712...` automatically)
- Confirm `MPESA_SHORTCODE` is your correct paybill and, in production, that Lipa Na M-Pesa Online is enabled for it
- In production, ensure `MPESA_CALLBACK_URL` is public HTTPS and whitelisted at Go-Live
- Check the `orders` collection in MongoDB for the order's `paymentStatus`

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

- [ ] ~~Payment gateway integration (M-Pesa, PayPal)~~ ✅ **M-Pesa (Lipa Na M-Pesa) integrated**
- [ ] PayPal integration
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
