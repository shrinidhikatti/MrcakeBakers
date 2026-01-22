# 🎂 Mr.Cake - Artisan Bakery E-commerce Platform

A modern, full-stack e-commerce platform for a bakery business with customer ordering, admin management, and delivery partner systems. Built with Next.js 16, TypeScript, Prisma, and NextAuth.

## ✨ Features

### 🛍️ Customer Features
- Browse products with beautiful, clean design
- Category-based filtering
- Shopping cart with persistent storage
- Wishlist functionality
- User authentication and profile management
- Order placement and tracking
- Delivery scheduling

### 👨‍💼 Admin Features
- Comprehensive dashboard with statistics
- Order management and status updates
- Product management (CRUD operations)
- User management
- Assign delivery partners to orders
- Settings management

### 🚚 Delivery Partner Features
- View assigned orders
- Update delivery status
- Track total deliveries
- Real-time order details

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 with App Router & Turbopack
- **Language**: TypeScript
- **Authentication**: NextAuth v5
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **State Management**: Zustand (for cart)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma db push

# Seed database with sample data
npx prisma db seed
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Test Credentials

After seeding the database, use these credentials to test different roles:

### Admin Panel
- **Email**: admin@mrcake.com
- **Password**: admin123
- **Access**: Full admin dashboard at `/admin`

### Customer Account
- **Email**: john@example.com
- **Password**: customer123
- **Access**: Shopping, cart, orders, wishlist

### Delivery Partner
- **Email**: rajesh@mrcake.com
- **Password**: delivery123
- **Access**: Delivery dashboard at `/delivery`

## 📁 Project Structure

```
mrcake-bakery/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Register page
│   ├── products/page.tsx        # Products listing
│   ├── cart/page.tsx            # Shopping cart
│   ├── checkout/page.tsx        # Checkout
│   ├── profile/page.tsx         # User profile
│   ├── admin/                   # Admin panel pages
│   ├── delivery/                # Delivery dashboard
│   └── api/                     # API routes
├── components/
│   ├── Header.tsx               # Main navigation
│   └── Footer.tsx               # Footer component
├── lib/
│   ├── prisma.ts                # Prisma client
│   └── utils.ts                 # Utility functions
├── store/
│   └── cartStore.ts             # Zustand cart store
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── auth.ts                      # NextAuth configuration
└── middleware.ts                # Route protection
```

## 🎨 Design Highlights

- **Clean & Modern**: Minimalist design with focus on bakery aesthetics
- **Color Scheme**:
  - Primary: Red/Pink tones (#F25042)
  - Accent: Cream (#FFF8F0)
  - Text: Dark chocolate brown (#4A2C2A)
- **Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Fade-in and slide animations using Framer Motion
- **Custom Components**: Reusable button, card, and input styles

## 📄 Available Scripts

```bash
# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (caution: deletes all data)
npx prisma db push --force-reset
npx prisma db seed
```

## 🗄️ Database Schema

The application uses SQLite with the following main models:

- **User** - Customer accounts with authentication
- **DeliveryPartner** - Delivery personnel accounts
- **Category** - Product categories (Cakes, Pastries, Breads, Cookies)
- **Product** - Bakery products with details
- **Order** - Customer orders with status tracking
- **OrderItem** - Individual items in an order
- **Address** - Delivery addresses
- **Wishlist** - Saved products per user
- **Review** - Product reviews (schema ready, not implemented in UI yet)

## 🔐 Authentication Flow

1. Users can register with email/password
2. Passwords are hashed using bcrypt
3. NextAuth handles session management with JWT
4. Role-based access control (CUSTOMER, ADMIN, DELIVERY_PARTNER)
5. Protected routes using middleware

## 📦 Order Flow

### Customer Journey:
1. Browse products → Add to cart
2. Proceed to checkout
3. Enter delivery address & select delivery slot
4. Place order (auto-approved in test mode)
5. Track order status in profile

### Admin Workflow:
1. View new orders
2. Confirm order
3. Update status to "Preparing"
4. Assign delivery partner
5. Monitor delivery progress

### Delivery Partner Workflow:
1. View assigned orders
2. Mark as "Picked Up"
3. Update to "Out for Delivery"
4. Complete delivery
5. System updates delivery counter

## Order Status Flow

```
PENDING → CONFIRMED → PREPARING → ASSIGNED →
PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
```

## 🎯 Key Features Implementation

### Shopping Cart
- Implemented with Zustand for state management
- Persists to localStorage
- Real-time item count in header
- Add/remove/update quantity

### Product Management
- Full CRUD operations in admin panel
- Category-based organization
- Stock management
- Featured products support
- Image storage (using emojis in demo, easily replaceable with real images)

### Delivery System
- Assign orders to available delivery partners
- Real-time status updates
- Delivery partner dashboard
- Track total deliveries per partner

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"
```

## 🔧 Customization

### Adding Real Product Images
Replace emoji placeholders in products:
```typescript
// Current: images: JSON.stringify(["🎂", "🍫"])
// Change to: images: JSON.stringify(["/images/cake1.jpg", "/images/cake2.jpg"])
```

### Integrating Payment Gateway
Replace the test payment in `/app/checkout/page.tsx`:
```typescript
// Current: Test payment auto-approved
// Add: Razorpay, Stripe, or other payment provider
```

### Email Notifications
Add email service (NodeMailer, SendGrid) in order creation API

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)

## 🐛 Common Issues

### Issue: Prisma Client not generated
**Solution**: Run `npx prisma generate`

### Issue: Database not seeded
**Solution**: Run `npx prisma db seed`

### Issue: Can't login
**Solution**: Make sure database is seeded with test users

### Issue: Cart not persisting
**Solution**: Check browser localStorage is enabled

## 🤝 Contributing

This is a demo project for learning purposes. Feel free to fork and customize!

## 📝 License

MIT License - feel free to use for your projects!

## 👨‍💻 Developer

**Shrinidhi Katti**
- Email: hello@mrcake.com
- Project: Mr.Cake E-commerce Platform
- Year: 2025

## 🎉 What's Next?

Future enhancements you could add:
- [ ] Real payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for orders
- [ ] SMS notifications for delivery
- [ ] Product reviews and ratings UI
- [ ] Coupon/discount system
- [ ] Admin analytics dashboard
- [ ] Inventory management
- [ ] Customer loyalty program
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

**Enjoy building with Mr.Cake! 🎂✨**

For issues or questions, please check the documentation or create an issue on GitHub.
