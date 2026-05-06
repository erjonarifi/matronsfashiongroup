# 🧵 Matrons Fashion Group — Full-Stack E-Commerce

A luxury fashion e-commerce website with client shopping and admin management.

---

## 🛠 Prerequisites

Install these before anything else:

1. **Node.js v18+** → https://nodejs.org
2. **PostgreSQL v14+** → https://postgresql.org

---

## ⚡ Quick Setup (Step by Step)

### Step 1: Set up the Database

Open your terminal and connect to PostgreSQL:

```bash
psql -U postgres
```

Then run the schema file:

```bash
\i /path/to/matronsfashiongroup/backend/database/schema.sql
```

Or copy-paste the contents of `backend/database/schema.sql` into your PostgreSQL client.

This will:
- Create the `matronsfashion` database
- Create all tables (users, products, cart_items, orders)
- Seed the admin account and 6 sample products

---

### Step 2: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your PostgreSQL password:

```
DB_PASSWORD=your_actual_postgres_password
JWT_SECRET=change_this_to_a_long_random_string
```

---

### Step 3: Install & Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

---

### Step 4: Install & Start Frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
npm start
```

Frontend opens at **http://localhost:3000**

---

## 🔑 Default Accounts

### Admin Account
- **Email:** admin@matronsfashion.com
- **Password:** admin123
- **Access:** Full product management dashboard

### Client Account
- Register at http://localhost:3000/register
- Can browse products and add to cart

---

## 📋 Features

### Client
- ✅ Create account / Login
- ✅ Browse full product collection
- ✅ Filter by category & search
- ✅ Add products to cart
- ✅ Adjust cart item quantities
- ✅ Remove items / Clear cart
- ✅ View cart total

### Admin
- ✅ Secure admin login (separate from client)
- ✅ Dashboard with stats (total products, stock, out of stock)
- ✅ Add new products (name, description, price, category, image, stock)
- ✅ Edit existing products
- ✅ Delete products (with confirmation)
- ✅ Adjust stock quantity inline from the table
- ✅ Search/filter products in dashboard

---

## 🗂 Project Structure

```
matronsfashiongroup/
├── backend/
│   ├── server.js              # Express server
│   ├── .env.example           # Environment template
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── routes/
│   │   ├── auth.js            # Register, login, /me
│   │   ├── products.js        # Full product CRUD
│   │   └── cart.js            # Cart management
│   └── database/
│       ├── db.js              # PostgreSQL pool
│       └── schema.sql         # Tables + seed data
│
└── frontend/
    └── src/
        ├── App.js             # Routes
        ├── context/
        │   ├── AuthContext.js # Global auth state
        │   └── CartContext.js # Global cart state
        ├── components/
        │   ├── Navbar.js      # Navigation
        │   ├── ProductCard.js # Product display
        │   └── ProtectedRoute.js
        └── pages/
            ├── Home.js        # Landing page
            ├── Products.js    # Shop page
            ├── Cart.js        # Cart page
            ├── Login.js       
            ├── Register.js    
            └── admin/
                └── AdminDashboard.js
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | User | Get profile |
| GET | /api/products | — | All products |
| POST | /api/products | Admin | Add product |
| PUT | /api/products/:id | Admin | Edit product |
| DELETE | /api/products/:id | Admin | Delete product |
| PATCH | /api/products/:id/stock | Admin | Update stock |
| GET | /api/cart | User | Get cart |
| POST | /api/cart | User | Add to cart |
| PUT | /api/cart/:id | User | Update quantity |
| DELETE | /api/cart/:id | User | Remove item |
| DELETE | /api/cart | User | Clear cart |

---

## 🚀 Production

For production deployment, update `.env`:
```
NODE_ENV=production
JWT_SECRET=very_long_random_secure_string
```

And change the admin password immediately after first login.
