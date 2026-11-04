# 🌱 FarmDoor – Connecting Farmers, Deliveries & Customers

**FarmDoor** is a digital agriculture marketplace designed to connect farmers directly with customers through an organized online platform. It provides dedicated portals for farmers, customers, delivery partners, and administrators to simplify product management, ordering, delivery, and platform operations.

The platform aims to create a convenient and transparent ecosystem where farmers can showcase their products, customers can purchase fresh produce, and delivery partners can manage orders.

## ✨ Key Features

### 👨‍🌾 Farmer Portal
- Farmer registration and login.
- Farmer dashboard.
- Add, update, and manage products.
- Manage product inventory and availability.
- View and manage customer orders.
- Track earnings and deliveries.
- Manage farmer profile.
- Receive notifications and customer reviews.

### 🛒 Customer Portal
- Customer registration and login.
- Browse available products.
- Explore products by category.
- View product details and farmer information.
- Add products to cart and wishlist.
- Place and track orders.
- Manage customer profile.
- View order history and notifications.
- Submit reviews and ratings.

### 🚚 Delivery Partner Portal
- Delivery partner registration and login.
- Delivery dashboard.
- View delivery requests.
- Manage active deliveries.
- Track delivery history.
- View earnings.
- Manage delivery profile.
- Receive delivery notifications.

### 🛡️ Admin Portal
- Admin authentication.
- Admin dashboard.
- Manage customers and farmers.
- Manage delivery partners.
- Manage products and categories.
- Manage orders and payments.
- Handle customer complaints.
- Monitor reports and analytics.
- Manage notifications and audit logs.
- Configure platform settings.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| CSS | Styling and responsive UI |
| React Router | Navigation |
| Context API | State management |
| Node.js | Backend (planned/integration stage) |
| Express.js | Backend APIs (planned/integration stage) |
| MongoDB Atlas | Database (planned/integration stage) |

## 📁 Project Structure

```text
FarmDoor/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── delivery/
│   │   ├── farmer/
│   │   └──
│   │
│   ├── context/
│   │
│   ├── data/
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── delivery/
│   │   └── farmer/
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/snehithareddy867/FarmDoor.git
```

### 2. Navigate to the project directory

```bash
cd FarmDoor
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open in browser

```text
http://localhost:5173
```

## 🔐 Authentication and Security

FarmDoor is designed with separate authentication and protected routes for different user roles:

- Administrator
- Farmer
- Customer
- Delivery Partner

Each portal provides role-specific access to its features.

## 🚀 Future Enhancements

- Complete MongoDB Atlas integration.
- Backend API development using Node.js and Express.js.
- Persistent user authentication and authorization.
- Real-time order and delivery tracking.
- Online payment gateway integration.
- Product availability and inventory synchronization.
- Improved analytics and reporting.
- Enhanced mobile responsiveness.

## 🎯 Project Objective

The main objective of FarmDoor is to simplify the connection between farmers and customers by providing a unified digital platform for agricultural products, order management, and delivery operations.

## 👩‍💻 Developer

**Snehitha Reddy**

GitHub: [@snehithareddy867](https://github.com/snehithareddy867)

## 📄 License

This project is developed for educational and demonstration purposes.
