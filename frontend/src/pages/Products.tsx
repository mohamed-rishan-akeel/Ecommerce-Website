import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import ProductList from '../components/products/ProductList';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to connect to the server. Please check if the server is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return <ProductList products={products} />;
};

export default Products; 