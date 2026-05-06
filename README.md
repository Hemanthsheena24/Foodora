#  Foodora Delivery Application

A full-stack, 3-tier food delivery application built with React, Node.js, and MongoDB. This project includes **restaurants** with different cuisines, complete order management, and real-time status tracking.

## 🎯 Key Features

- ✅ ** Restaurants** - Browse from Pizza Palace, Burger Town, Sushi Express, Biryani House, Thai Orchid, and BBQ Paradise
- ✅ **Complete Order Workflow** - Place orders → Restaurant accepts → Prepare → Out for delivery → Delivered
- ✅ **Real-time Order Tracking** - Customers can track order status in real-time
- ✅ **Restaurant Dashboard** - Restaurants can accept and manage orders
- ✅ **User Authentication** - Separate customer and restaurant accounts
- ✅ **Shopping Cart** - Add/remove items, manage quantities
- ✅ **Order History** - View past and current orders
- ✅ **Status Management** - Complete order status lifecycle

## 🏗️ Architecture

### 3-Tier Architecture
- **Frontend Tier**: React.js with Context API for state management
- **Backend Tier**: Node.js with Express REST APIs
- **Database Tier**: MongoDB with Mongoose ODM

## 🚀 Tech Stack

### Frontend
- React 18.2
- React Router DOM v6
- Axios for HTTP requests
- Context API for authentication and cart management
- CSS3 for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Database
- MongoDB (local or cloud)
- Collections: Users, Restaurants, MenuItems, Orders, Payments

## 📁 Project Structure

```
food_delivery/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Restaurant.js
│   │   │   ├── MenuItem.js
│   │   │   ├── Order.js
│   │   │   └── Payment.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── menuController.js
│   │   │   └── orderController.js
│   ├── seed.js                    # Seeds 6 restaurants with menus
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── restaurantRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── RestaurantCard.js
│   │   │   ├── MenuItem.js
│   │   │   ├── Cart.js
│   │   │   └── Loader.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js
│   │   │   ├── RestaurantMenu.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderTracking.js
│   │   │   ├── Orders.js
│   │   │   └── RestaurantOrders.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
└── README.md
```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Update `.env` file with your MongoDB connection string:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food_delivery
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

Note: the backend now falls back to `mongodb://127.0.0.1:27017/food_delivery` when `MONGODB_URI` is not set, so a local MongoDB instance will be used by default.

4. **Start MongoDB**
   - If using local MongoDB:
   ```bash
   mongod
   ```
   - Or use MongoDB Atlas (cloud)

5. **Run the backend**
   ```bash
   npm run dev
   ```
   - Backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - `.env` file is pre-configured:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```
   - Frontend will open on `http://localhost:3000`

### Role-Based Access Control
- **Customer**: Can browse restaurants, order food, track orders
- **Restaurant**: Can accept/update orders, manage menu item

### Sample Test Accounts

**Customer Account:**
- Email: customer@example.com
- Password: password123
- Role: Customer

**Restaurant Account:**
- Email: restaurant@example.com
- Password: password123
- Role: Restaurant

### Sample Data Setup

1. **Register as Customer**
   - Go to Register page
   - Fill in details with role: "Customer"
   - You can now browse restaurants and place orders

2. **Register as Restaurant**
   - Go to Register page
   - Fill in details with role: "Restaurant"
   - You can manage orders from your dashboard

### Order Status Flow
```
PLACED → ACCEPTED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
```

## 🎯 Features

### Customer Features
- Browse restaurants
- View restaurant menus
- Add items to cart
- Manage cart (add, remove, update quantity)
- Place orders
- Track order status in real-time
- View order history
- Authentication and profile




## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

### Terminal 3 - MongoDB (if using local)
```bash
mongod
```

The application will be available at `http://localhost:3000`

## � Docker Setup (Recommended)

### Prerequisites
- Docker and Docker Compose installed on your system

### Quick Start with Docker

1. **Clone and navigate to the project directory**
   ```bash
   cd food_delivery
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```
   - First run will take longer as it builds the images
   - MongoDB will be seeded automatically

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Docker Commands

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build --force-recreate

# Clean up (removes volumes too)
docker-compose down -v
```

### Docker Architecture

- **Frontend**: React app served by Nginx (port 3000)
- **Backend**: Node.js/Express API (port 5000)
- **Database**: MongoDB with persistent data volume
- **Networking**: Services communicate via Docker network

### Environment Variables in Docker

The docker-compose.yml includes secure defaults:
- MongoDB with authentication
- JWT secret for production
- Proper service dependencies
## ☸️ Kubernetes Deployment (Production-Ready)

For production deployments, use the Kubernetes manifests in the `k8s/` directory. This setup includes:

### Features
- **Multi-environment support** (development, staging, production)
- **GitOps-ready** with Kustomize
- **Security hardening** with Network Policies and Security Contexts
- **Auto-scaling** with Horizontal Pod Autoscalers
- **High availability** with Pod Disruption Budgets
- **Monitoring integration** with Prometheus annotations
- **TLS termination** with cert-manager
- **External DNS** integration

### Quick Deploy

```bash
# Deploy to development
./deploy.sh development apply

# Deploy to production
./deploy.sh production apply

# Check status
./deploy.sh production status

# View logs
./deploy.sh production logs backend
```

### Architecture
- **Frontend**: React app served by NGINX with API proxy
- **Backend**: Node.js API with auto-scaling
- **Database**: MongoDB with persistent storage
- **Ingress**: External access with SSL/TLS
- **Monitoring**: Health checks and metrics collection

See `k8s/README.md` for detailed documentation.
## �🔄 Order Status Transitions

Valid status transitions:
```
PLACED → ACCEPTED (only restaurant can do this)
ACCEPTED → PREPARING
PREPARING → OUT_FOR_DELIVERY
OUT_FOR_DELIVERY → DELIVERED
PLACED → CANCELLED (optional)
```

## 📝 Key Business Logic

### Tax Calculation
- 5% tax is calculated on subtotal
- Formula: `tax = (subtotal * 5) / 100`

### Delivery Fee
- Fixed delivery fee: ₹50
- Could be adjusted based on distance in production

### Order Validation
- Status transitions are validated
- Cart items are verified when placing order
- Prices are calculated on backend for security




## 📄 License

This project is for learning and demonstration purposes.

## 👨‍💻 Author
Hemanth kumar M S
---

## Original 8 Restaurants:

pizzapalace@example.com / password123
burgertown@example.com / password123
sushiexpress@example.com / password123
biryanihouse@example.com / password123
thaiorchid@example.com / password123
bbqparadise@example.com / password123
vegangreen@example.com / password123
pastaprime@example.com / password123

redoven0@example.com / password123
bluespoon1@example.com / password123
greenfork2@example.com / password123
goldenwok3@example.com / password123
silvergrill4@example.com / password123
urbantiffin5@example.com / password123

## run the code

cd C:\Users\Asus\Documents\food_delevery\backend; npm install; npm run dev
cd C:\Users\Asus\Documents\food_delevery\frontend; npm install; npm start

## if backend crash run this steps

Get-Process -Name node | Stop-Process -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 2; Write-Host "All Node processes stopped"

Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 2; Write-Host "Port 5000 freed"

netstat -ano | findstr :5000

npm run dev

**Happy Coding! 🚀**
