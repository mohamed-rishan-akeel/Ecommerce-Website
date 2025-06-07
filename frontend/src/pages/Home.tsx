import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to TechTrove</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Your one-stop shop for the latest electronics and gadgets
        </p>
        <Link
          to="/products"
          className="btn btn-primary inline-block"
        >
          Browse Products
        </Link>
      </div>

      {/* Featured Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Smartphones', 'Laptops', 'Headphones'].map((category) => (
            <Link
              key={category}
              to={`/products?category=${category.toLowerCase()}`}
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{category}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our {category.toLowerCase()} collection
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 