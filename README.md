# TechTrove - Modern eCommerce Platform

A full-stack eCommerce website for selling electronic gadgets, built with React.js, Node.js, Express, and MongoDB.

## Features

- 🏠 Responsive Home Page with featured products and categories
- 🔍 Advanced Product Search with autocomplete
- 🛍️ Product Listings with filters
- 🛒 Shopping Cart functionality
- 👤 User Authentication (JWT)
- 📦 Order Management
- 💳 Payment Integration (Stripe & COD)
- 🎨 Dark/Light Mode
- 📱 Mobile Responsive Design
- ⚡ Admin Dashboard
- 💖 Wishlist
- 🏷️ Flash Deals/Promotions

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/techtrove.git
cd techtrove
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
Create `.env` files in both frontend and backend directories based on the provided `.env.example` files.

5. Start Development Servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Project Structure

```
techtrove/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── features/     # Redux slices
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── public/           # Static assets
└── backend/              # Node.js backend
    ├── controllers/      # Route controllers
    ├── models/          # MongoDB models
    ├── routes/          # API routes
    ├── middleware/      # Custom middleware
    └── utils/           # Helper functions
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) 