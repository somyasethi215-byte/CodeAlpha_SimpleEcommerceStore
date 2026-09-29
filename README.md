# Simple E-commerce Store

A basic e-commerce site built with **Express.js** (backend) and **vanilla HTML/CSS/JS** (frontend), using **SQLite** as the database.

## Features
- Product listing with search
- Product detail page
- Shopping cart (add, update quantity, remove)
- User registration/login (session-based, passwords hashed with bcrypt)
- Order processing (checkout, stock deduction, order history)

## Project structure
```
ecommerce-app/
  server.js            # Express app entry point
  db/
    database.js        # SQLite connection + schema
    seed.js             # Sample product data
  routes/
    auth.js             # register/login/logout
    products.js         # product listing/detail
    cart.js              # cart CRUD (requires login)
    orders.js            # checkout + order history (requires login)
  middleware/
    requireAuth.js      # blocks routes unless logged in
  public/               # frontend (served as static files)
    index.html           # product listing
    product.html          # product detail
    cart.html              # shopping cart
    login.html / register.html
    orders.html             # order history
    order-confirmation.html
    css/style.css
    js/common.js          # shared fetch helper + header/nav
```

## Setup

1. **Install dependencies** (requires Node.js 18+):
   ```bash
   npm install
   ```

2. **Seed the database** with sample products:
   ```bash
   npm run seed
   ```
   This creates `db/store.db` and inserts 6 sample products. Run it again any time to reset the product catalog.

3. **Start the server**:
   ```bash
   npm start
   ```

4.
## How it works

- **Database**: `better-sqlite3` creates `db/store.db` automatically on first run, with tables for `users`, `products`, `cart_items`, `orders`, and `order_items`.
- **Auth**: `express-session` keeps the logged-in user's ID in a signed cookie. `bcryptjs` hashes passwords before storing them — plaintext passwords are never saved.
- **Cart**: stored server-side per user (not in the browser), so it survives across devices/sessions as long as you're logged in.
- **Checkout**: wrapped in a SQLite transaction — it checks stock, creates the order + order items, decrements stock, and clears the cart all atomically. If stock runs out mid-request, nothing is partially applied.

## Next steps if you want to extend this
- Add an "admin" role to manage products from the UI instead of `seed.js`.
- Add product categories/filters.
- Add pagination for the product grid.
- Swap SQLite for PostgreSQL/MySQL for production (the SQL is simple enough to port).
- Add a real payment integration (Stripe, Razorpay, etc.) instead of instant "placed" status.
