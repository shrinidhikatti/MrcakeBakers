# ✅ Quick Testing Checklist

Run this checklist to verify all features are working after seeding the database.

## 🚀 Setup (Do this first)

```bash
# 1. Start database, then seed it
npm run seed

# 2. Start dev server
npm run dev

# 3. Open http://localhost:4444
```

---

## Feature 1: Coupons 🎟️

- [ ] Login as `john@example.com` / `customer123`
- [ ] Add Chocolate Truffle Cake (₹850) to cart
- [ ] Go to checkout
- [ ] Enter coupon: `WELCOME50`
- [ ] Click "Apply"
- [ ] **VERIFY**: ✅ "Coupon applied!" message, ₹85 discount shown
- [ ] Try coupon: `SAVE20`
- [ ] **VERIFY**: ✅ Error "Order total must be at least ₹1000"
- [ ] Login as `admin@mrcake.com` / `admin123`
- [ ] Go to `/admin/coupons`
- [ ] **VERIFY**: ✅ See 4 coupons, can edit/delete

**Status**: ⬜ PASS | ⬜ FAIL

---

## Feature 2: Order Tracking 📍

- [ ] Login as `john@example.com`
- [ ] Go to `/profile/orders`
- [ ] Find "OUT_FOR_DELIVERY" order
- [ ] Click "Track on Map"
- [ ] **VERIFY**: ✅ Map shows, distance displayed, updates every 10s
- [ ] Click "Full Tracking"
- [ ] **VERIFY**: ✅ Timeline with all statuses, ETA shown, agent name visible, pulsing "Live" indicator

**Status**: ⬜ PASS | ⬜ FAIL

---

## Feature 3: Product Variants 🎂

- [ ] Go to `/products/chocolate-truffle-cake`
- [ ] **VERIFY**: ✅ Size options visible (500g, 1kg, 2kg)
- [ ] **VERIFY**: ✅ Flavor options visible (Dark Chocolate, Milk Chocolate)
- [ ] Select "2kg" (+₹800)
- [ ] **VERIFY**: ✅ Price updates to ₹1650
- [ ] Select "Dark Chocolate" (+₹50)
- [ ] **VERIFY**: ✅ Price updates to ₹1700
- [ ] Enter custom text: "Test Message"
- [ ] Add to cart
- [ ] Go to `/cart`
- [ ] **VERIFY**: ✅ Shows "2kg, Dark Chocolate", "Message: Test Message", price ₹1700

**Status**: ⬜ PASS | ⬜ FAIL

---

## Feature 5: Inventory Management 📦

- [ ] Login as `admin@mrcake.com`
- [ ] Go to `/admin` dashboard
- [ ] **VERIFY**: ✅ "Low Stock Products" widget shows Chocolate Chip Cookies (3 items)
- [ ] **VERIFY**: ✅ Shows Oatmeal Raisin Cookies out of stock
- [ ] Click notification bell (top right)
- [ ] **VERIFY**: ✅ Red badge with count "2"
- [ ] **VERIFY**: ✅ Dropdown shows 2 unread notifications
- [ ] Go to `/products/oatmeal-raisin-cookies`
- [ ] **VERIFY**: ✅ "Out of Stock" badge, "Add to Cart" disabled

**Status**: ⬜ PASS | ⬜ FAIL

---

## Feature 6: Analytics Dashboard 📊

- [ ] Login as `admin@mrcake.com`
- [ ] Go to `/admin/analytics`
- [ ] **VERIFY**: ✅ Revenue line chart displays with data
- [ ] **VERIFY**: ✅ Orders bar chart displays with data
- [ ] **VERIFY**: ✅ Status pie chart shows order distribution
- [ ] **VERIFY**: ✅ Top products chart shows horizontal bars
- [ ] Click "Export CSV"
- [ ] **VERIFY**: ✅ CSV file downloads successfully

**Status**: ⬜ PASS | ⬜ FAIL

---

## Feature 7: Custom Cake Builder 🎨 (PRIMARY TEST)

- [ ] Click "Custom Cake" in header navigation
- [ ] Go to `/cake-builder`
- [ ] **VERIFY**: ✅ 5-step wizard loads, preview on right side

### Step by Step:
- [ ] **Step 1 - Layers**: Select "3 Layers"
  - [ ] **VERIFY**: ✅ Preview shows 3 tiers, price = ₹799
- [ ] Click "Next"
- [ ] **Step 2 - Flavor**: Select "Chocolate"
  - [ ] **VERIFY**: ✅ Preview color changes to brown, price = ₹849
- [ ] Click "Next"
- [ ] **Step 3 - Frosting**: Select "Buttercream"
  - [ ] **VERIFY**: ✅ Price = ₹949
- [ ] Click "Next"
- [ ] **Step 4 - Toppings**: Select "Sprinkles" and "Cherries"
  - [ ] **VERIFY**: ✅ Decorations appear on preview, price = ₹1029
- [ ] Click "Next"
- [ ] **Step 5 - Message**: Enter "Congratulations!"
  - [ ] **VERIFY**: ✅ Text appears on cake preview
- [ ] Click "Add to Cart"
  - [ ] **VERIFY**: ✅ Success message
- [ ] Go to `/cart`
  - [ ] **VERIFY**: ✅ "Custom Cake" shows with price ₹1029
  - [ ] **VERIFY**: ✅ Shows selected options (3 Layers, Chocolate, etc.)
  - [ ] **VERIFY**: ✅ Shows message text

**Status**: ⬜ PASS | ⬜ FAIL

---

## Feature 8: Loyalty Program 🏆

- [ ] Login as `john@example.com`
- [ ] Go to `/profile/loyalty`
- [ ] **VERIFY**: ✅ Shows 750 points
- [ ] **VERIFY**: ✅ Shows SILVER tier badge
- [ ] **VERIFY**: ✅ Progress bar to GOLD (need 2000)
- [ ] **VERIFY**: ✅ Points history table with transactions
- [ ] **VERIFY**: ✅ Shows "1.25x multiplier"
- [ ] Add items worth ₹1500 to cart
- [ ] Go to `/checkout`
- [ ] In "Loyalty Points" section, enter: `200`
- [ ] Click "Redeem"
- [ ] **VERIFY**: ✅ ₹20 discount applied
- [ ] **VERIFY**: ✅ Shows "Available: 550 points" (750 - 200)
- [ ] Logout, login as `sarah@example.com`
- [ ] Go to `/profile/loyalty`
- [ ] **VERIFY**: ✅ Shows 2500 points, GOLD tier, 1.5x multiplier

**Status**: ⬜ PASS | ⬜ FAIL

---

## 🔥 Integration Test: Everything Together

- [ ] Login as `john@example.com`
- [ ] Go to `/cake-builder` and create custom cake:
  - [ ] 3 Layers, Chocolate, Buttercream, Sprinkles
  - [ ] Message: "Best Day Ever!"
- [ ] Add to cart (₹1029)
- [ ] Add Chocolate Truffle Cake with:
  - [ ] 2kg size (+₹800)
  - [ ] Dark Chocolate flavor (+₹50)
  - [ ] Custom text: "Celebration!"
- [ ] Add to cart (₹1700)
- [ ] **VERIFY**: ✅ Cart shows both items with customizations
- [ ] Go to checkout
- [ ] Apply coupon: `SAVE20`
- [ ] **VERIFY**: ✅ ₹500 discount (20% capped at ₹500)
- [ ] Redeem 200 loyalty points
- [ ] **VERIFY**: ✅ ₹20 additional discount
- [ ] Complete order (note order number)
- [ ] **VERIFY**: ✅ Order success page
- [ ] Go to `/track/[orderId]`
- [ ] **VERIFY**: ✅ Order details show both products
- [ ] **VERIFY**: ✅ Timeline shows order progression
- [ ] Login as admin
- [ ] Go to `/admin/analytics`
- [ ] **VERIFY**: ✅ New order appears in charts
- [ ] Go to `/admin`
- [ ] **VERIFY**: ✅ Chocolate Truffle stock decreased by 1

**Status**: ⬜ PASS | ⬜ FAIL

---

## 📊 Final Verification

After all tests:

- [ ] All 7 features tested individually
- [ ] Integration test passed
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone or resize browser)
- [ ] All data persists after refresh
- [ ] Admin panel fully functional
- [ ] Customer experience smooth

---

## 🎯 Quick Pass/Fail Summary

| Feature | Status | Notes |
|---------|--------|-------|
| F1: Coupons | ⬜ PASS / ⬜ FAIL | |
| F2: Tracking | ⬜ PASS / ⬜ FAIL | |
| F3: Variants | ⬜ PASS / ⬜ FAIL | |
| F5: Inventory | ⬜ PASS / ⬜ FAIL | |
| F6: Analytics | ⬜ PASS / ⬜ FAIL | |
| F7: Cake Builder | ⬜ PASS / ⬜ FAIL | |
| F8: Loyalty | ⬜ PASS / ⬜ FAIL | |
| Integration | ⬜ PASS / ⬜ FAIL | |

---

## 🐛 If Something Fails

1. Check browser console for errors
2. Verify database connection
3. Ensure seed script ran successfully
4. Check `.env` file has correct DATABASE_URL
5. Try clearing browser cache/localStorage
6. Restart dev server

---

**Testing Time Estimate**: ~30-45 minutes for complete verification

**Primary Focus**: Feature 7 (Custom Cake Builder) as specifically requested! 🎂
