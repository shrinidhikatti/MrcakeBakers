# MrCakeBakers - Feature Testing Guide

This guide provides step-by-step instructions to test all 7 implemented features.

## Prerequisites

1. **Run the seed script** to populate test data:
   ```bash
   npm run seed
   # or
   npx tsx prisma/seed.ts
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access the application** at http://localhost:4444

---

## Test Credentials

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Admin** | admin@mrcake.com | admin123 | Full admin access |
| **Customer** | john@example.com | customer123 | 750 loyalty points (SILVER tier) |
| **VIP Customer** | sarah@example.com | customer123 | 2500 loyalty points (GOLD tier) |
| **Delivery Partner** | rajesh@mrcake.com | delivery123 | Delivery partner portal |

---

## Feature 1: Promo Codes / Coupons

### Test Case 1.1: Apply Valid Coupon at Checkout

**Steps:**
1. Login as `john@example.com`
2. Add any product to cart (e.g., Chocolate Truffle Cake - ₹850)
3. Go to `/checkout`
4. In the "Promo Code" section, enter: `WELCOME50`
5. Click "Apply"

**Expected Result:**
- ✅ Success message: "Coupon applied successfully!"
- ✅ 10% discount applied (max ₹200)
- ✅ Order total reduced by discount amount
- ✅ Discount shown in order summary

### Test Case 1.2: Test Minimum Order Amount

**Steps:**
1. Add a cheap item (e.g., Chocolate Éclair - ₹80)
2. Go to checkout
3. Try coupon: `WELCOME50` (requires ₹500 minimum)

**Expected Result:**
- ❌ Error: "Order total must be at least ₹500"

### Test Case 1.3: Admin Coupon Management

**Steps:**
1. Login as `admin@mrcake.com`
2. Go to `/admin/coupons`
3. Click "Create Coupon"
4. Fill in details:
   - Code: `TEST2026`
   - Type: PERCENTAGE
   - Value: 15
   - Min Order: ₹600
   - Valid dates: Current year
5. Click "Create Coupon"

**Expected Result:**
- ✅ Coupon created and appears in list
- ✅ Can edit/delete the coupon
- ✅ Can toggle active status

### Available Test Coupons:
- `WELCOME50` - 10% off, min ₹500, max discount ₹200
- `FLAT100` - ₹100 off, min ₹800
- `SAVE20` - 20% off, min ₹1000, max discount ₹500

---

## Feature 2: Real-Time Order Tracking

### Test Case 2.1: Track Active Delivery

**Steps:**
1. Login as `john@example.com`
2. Go to `/profile/orders`
3. Find the order with status "OUT_FOR_DELIVERY"
4. Click "Track on Map" button
5. Observe the map showing delivery partner location
6. Click "Full Tracking" button

**Expected Result:**
- ✅ Map displays with customer and agent markers
- ✅ Distance shown (e.g., "2.5 km away")
- ✅ Auto-updates every 10 seconds
- ✅ Full tracking page shows:
  - Order timeline with all status updates
  - ETA estimate
  - Delivery partner name
  - Live location updates
  - Pulsing "Live" indicator

### Test Case 2.2: Order Timeline

**Steps:**
1. On the tracking page (`/track/[orderId]`)
2. Observe the timeline on the left side

**Expected Result:**
- ✅ All status transitions shown with timestamps
- ✅ Current status highlighted
- ✅ Past statuses marked as complete (green checkmark)
- ✅ Future statuses shown as pending
- ✅ Notes displayed for each status

### Test Case 2.3: Delivered Order

**Steps:**
1. Find an order with status "DELIVERED"
2. Try to track it

**Expected Result:**
- ✅ Full timeline visible
- ✅ No "Track on Map" button (delivery complete)
- ❌ No live tracking or ETA

---

## Feature 3: Product Variants

### Test Case 3.1: Select Cake Size and Flavor

**Steps:**
1. Go to `/products/chocolate-truffle-cake`
2. Observe variant options for SIZE
3. Select "2kg" (should add ₹800)
4. Select FLAVOR: "Dark Chocolate" (+₹50)
5. Add to cart
6. Go to `/cart`

**Expected Result:**
- ✅ Price updates based on variant selections
- ✅ Cart shows: "Chocolate Truffle Cake - 2kg, Dark Chocolate"
- ✅ Total reflects price modifiers (₹850 + ₹800 + ₹50 = ₹1700)
- ✅ Each variant combination treated as unique item

### Test Case 3.2: Add Custom Text to Cake

**Steps:**
1. On product page, find "Cake Customization" section
2. Enter custom text: "Happy Anniversary!"
3. Add to cart

**Expected Result:**
- ✅ Custom text saved with cart item
- ✅ Shows in cart: "Message: Happy Anniversary!"
- ✅ Appears in order confirmation

### Test Case 3.3: Admin Variant Management

**Steps:**
1. Login as admin
2. Go to `/admin/products`
3. Edit "Chocolate Truffle Cake"
4. Scroll to "Product Variants" section
5. Add new variant: SIZE - "3kg" - ₹1500

**Expected Result:**
- ✅ Variant saved successfully
- ✅ Appears on product page for customers
- ✅ Can edit/delete variants

---

## Feature 4: Social Login

**Status:** ⏸️ DEFERRED - Skipped for now, will implement later with OAuth credentials

---

## Feature 5: Inventory Management

### Test Case 5.1: Low Stock Alert

**Steps:**
1. Login as admin
2. Go to `/admin` (dashboard)
3. Observe "Low Stock Products" widget
4. Click the notification bell icon (top right)

**Expected Result:**
- ✅ Low Stock widget shows "Chocolate Chip Cookies" (3 items)
- ✅ Shows "Out of Stock: Oatmeal Raisin Cookies"
- ✅ Notification bell has red badge with count
- ✅ Clicking bell shows unread notifications

### Test Case 5.2: Stock Decrement on Order

**Steps:**
1. Login as customer
2. Add "Chocolate Chip Cookies" to cart (currently 3 in stock)
3. Complete checkout and place order

**Expected Result:**
- ✅ Stock decrements to 2
- ✅ Admin sees updated stock count
- ✅ If stock reaches 0, product marked as out of stock
- ✅ New admin notification created if threshold crossed

### Test Case 5.3: Out of Stock Product

**Steps:**
1. Go to `/products/oatmeal-raisin-cookies`

**Expected Result:**
- ✅ "Add to Cart" button disabled
- ✅ "Out of Stock" badge displayed
- ✅ Product still viewable but not purchasable

---

## Feature 6: Sales Analytics Dashboard

### Test Case 6.1: View Analytics Dashboard

**Steps:**
1. Login as admin
2. Go to `/admin/analytics`
3. Observe all charts

**Expected Result:**
- ✅ **Revenue Chart**: Line chart showing revenue over time
- ✅ **Orders Chart**: Bar chart showing order counts by day
- ✅ **Status Pie Chart**: Order distribution by status
- ✅ **Top Products Chart**: Horizontal bar showing best sellers
- ✅ All charts use sample order data from seed

### Test Case 6.2: Filter by Date Range

**Steps:**
1. On analytics page, select date range filter
2. Choose "Last 7 days"
3. Charts update

**Expected Result:**
- ✅ Charts filter data by selected period
- ✅ Metrics update accordingly
- ✅ Summary cards show filtered totals

### Test Case 6.3: Export CSV

**Steps:**
1. Click "Export CSV" button
2. Wait for download

**Expected Result:**
- ✅ CSV file downloads with analytics data
- ✅ Includes: date, revenue, orders, products
- ✅ Opens correctly in Excel/Google Sheets

---

## Feature 7: Custom Cake Builder

### Test Case 7.1: Build Custom Cake (PRIMARY TEST)

**Steps:**
1. Click "Custom Cake" in header navigation
2. Go to `/cake-builder`
3. **Step 1 - Layers**: Select "3 Layers" (+₹300)
4. Click "Next"
5. **Step 2 - Flavor**: Select "Chocolate" (+₹50)
6. Click "Next"
7. **Step 3 - Frosting**: Select "Buttercream" (+₹100)
8. Click "Next"
9. **Step 4 - Toppings**: Select "Sprinkles" (+₹30) and "Cherries" (+₹50)
10. Click "Next"
11. **Step 5 - Message**: Enter "Congratulations!"
12. Observe live preview on right side
13. Check calculated price at bottom
14. Click "Add to Cart"

**Expected Result:**
- ✅ Each step updates the live CSS preview
- ✅ Price calculator updates: ₹499 (base) + ₹300 + ₹50 + ₹100 + ₹30 + ₹50 = ₹1029
- ✅ Preview shows selected layers, colors, toppings
- ✅ Message appears on preview
- ✅ Added to cart as "Custom Cake" with all selections
- ✅ Can add multiple custom cakes with different configs

### Test Case 7.2: Save Configuration

**Steps:**
1. While building cake, click "Save Configuration"
2. Enter name: "Birthday Special"
3. Save

**Expected Result:**
- ✅ Configuration saved to database
- ✅ Available in `/profile` (if implemented)
- ✅ Can reload saved config later

### Test Case 7.3: Checkout with Custom Cake

**Steps:**
1. After adding custom cake to cart, go to `/cart`
2. Verify details shown
3. Proceed to checkout
4. Complete order

**Expected Result:**
- ✅ Custom cake shows all selections in cart
- ✅ Correct price calculated
- ✅ Order item includes custom configuration
- ✅ Can be tracked like regular order

---

## Feature 8: Loyalty Program

### Test Case 8.1: View Loyalty Dashboard

**Steps:**
1. Login as `john@example.com` (750 points, SILVER tier)
2. Go to `/profile`
3. Click "Loyalty" link or go to `/profile/loyalty`

**Expected Result:**
- ✅ Shows current points: 750
- ✅ Shows tier: SILVER (with badge)
- ✅ Progress bar to next tier (GOLD at 2000 points)
- ✅ Points history table with transactions
- ✅ Shows tier benefits (1.25x multiplier)

### Test Case 8.2: Earn Points from Order

**Steps:**
1. Login as `john@example.com`
2. Place an order worth ₹1000
3. Complete checkout

**Expected Result:**
- ✅ Order shows "Points to earn: 100"
- ✅ After order creation, points added to account (₹10 = 1 point)
- ✅ New transaction in points history
- ✅ Tier upgraded if threshold crossed
- ✅ Loyalty account updates immediately

### Test Case 8.3: Redeem Points at Checkout

**Steps:**
1. Login as `john@example.com` (750 points)
2. Add items worth ₹1500 to cart
3. Go to `/checkout`
4. In "Loyalty Points" section, enter: `200` points
5. Click "Redeem"

**Expected Result:**
- ✅ ₹20 discount applied (10 points = ₹1)
- ✅ Order total reduced by ₹20
- ✅ Points balance shows: 750 - 200 = 550
- ✅ Can't redeem more than available balance
- ✅ Minimum 100 points required

### Test Case 8.4: VIP Tier Benefits

**Steps:**
1. Login as `sarah@example.com` (2500 points, GOLD tier)
2. Go to `/profile/loyalty`

**Expected Result:**
- ✅ Shows GOLD tier badge
- ✅ 1.5x points multiplier shown
- ✅ Placing ₹1000 order earns 150 points instead of 100
- ✅ Progress shown toward PLATINUM (5000 points)

### Test Case 8.5: Admin Loyalty Stats

**Steps:**
1. Login as admin
2. Go to `/admin/loyalty`

**Expected Result:**
- ✅ Shows total customers by tier
- ✅ Total points issued
- ✅ Total points redeemed
- ✅ Average points per customer
- ✅ List of top loyalty members

---

## Integration Test: Complete Order Flow

### End-to-End Test with All Features

**Steps:**
1. Login as `john@example.com` (750 points, SILVER)
2. Go to `/products/chocolate-truffle-cake`
3. Select variants: 2kg (+₹800), Dark Chocolate (+₹50)
4. Add custom text: "Happy Birthday!"
5. Add to cart (Price: ₹1700)
6. Go to `/checkout`
7. Apply coupon: `SAVE20` (20% off, max ₹500)
8. Redeem 200 loyalty points (₹20 off)
9. Complete checkout
10. Note order number
11. Go to `/track/[orderId]` to track order
12. Login as admin (`admin@mrcake.com`)
13. Check inventory updated
14. Check analytics dashboard updated
15. Check customer earned points

**Expected Result:**
- ✅ Order total: ₹1700 - ₹340 (coupon) - ₹20 (points) = ₹1340 + delivery + tax
- ✅ Coupon usage count incremented
- ✅ 200 points deducted from customer
- ✅ ~134 new points earned from order (after SILVER 1.25x multiplier)
- ✅ Chocolate Truffle stock decremented by 1
- ✅ Order trackable with all details
- ✅ Analytics shows new order and revenue

---

## Quick Verification Checklist

After seeding, verify these key indicators:

- [ ] **F1 Coupons**: `/admin/coupons` shows 4 coupons
- [ ] **F2 Tracking**: `/profile/orders` shows 3 orders with tracking
- [ ] **F3 Variants**: Chocolate Truffle product page shows size/flavor options
- [ ] **F5 Inventory**: Admin dashboard shows 2 notifications (low stock + out of stock)
- [ ] **F6 Analytics**: `/admin/analytics` displays 4 charts with data
- [ ] **F7 Cake Builder**: `/cake-builder` loads with 5-step wizard
- [ ] **F8 Loyalty**: John has 750 points (SILVER), Sarah has 2500 (GOLD)

---

## Troubleshooting

### Issue: No data in analytics
**Solution**: Create at least 2-3 orders first, then refresh analytics page

### Issue: Tracking map not loading
**Solution**: Check browser console for errors, ensure Leaflet CSS loaded

### Issue: Custom cake not adding to cart
**Solution**: Complete all 5 steps before clicking "Add to Cart"

### Issue: Coupon not applying
**Solution**: Check minimum order amount, expiry date, and usage limit

### Issue: Points not updating
**Solution**: Ensure order status is CONFIRMED or higher for points to be awarded

---

## Development Notes

- All features use existing tech stack (Next.js, Prisma, Zustand, Recharts)
- Real-time tracking polls every 15s on tracking page, 10s on orders page
- Haversine formula calculates distance (assumes 20 km/h average speed for ETA)
- Loyalty points: ₹10 spent = 1 point, 100 points = ₹10 discount
- Stock decrement happens immediately on order creation
- Admin notifications auto-created when stock crosses threshold

---

## Performance Testing

### Load Test Scenarios:
1. **High traffic checkout**: 10+ users applying coupons simultaneously
2. **Real-time tracking**: 50+ active orders polling every 15s
3. **Analytics dashboard**: Large date range with 1000+ orders
4. **Inventory updates**: Concurrent orders decrementing same product stock

### Expected Behavior:
- Optimistic locking prevents overselling
- Coupon usage count uses atomic increment
- Polling uses efficient queries (indexed fields)
- Analytics aggregates on-demand (consider caching for production)

---

## Next Steps

1. ✅ Run seed script: `npm run seed`
2. ✅ Start dev server: `npm run dev`
3. ✅ Follow test cases above
4. ✅ Report any issues found
5. ⏭️ Ready for production deployment after testing

**Happy Testing! 🎂🎉**
