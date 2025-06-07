import { FaStar, FaStarHalf } from 'react-icons/fa';
import type { Product } from '../../types/product';
import * as productImages from '../../assets/images';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalf
          key={`star-half`}
          className="text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaStar
          key={`star-empty-${i}`}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

  const getImagePath = (imagePath: string) => {
    // Extract the image filename from the path
    const filename = imagePath.split('/').pop() || '';
    // Find the matching imported image
    const imageKey = Object.keys(productImages).find(key => 
      (productImages as any)[key].includes(filename)
    );
    return imageKey ? (productImages as any)[imageKey] : imagePath;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={getImagePath(product.image)}
            alt={product.name}
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>
          
          <div className="flex items-center space-x-2">
            <div className="flex">
              {renderRatingStars(product.rating)}
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </div>

          <div className="text-gray-700 dark:text-gray-300">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>

          <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Brand:</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stock:</span>
              <span className="font-medium text-gray-900 dark:text-white">{product.countInStock}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            disabled={product.countInStock === 0}
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 