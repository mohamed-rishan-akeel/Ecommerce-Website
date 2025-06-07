import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import * as productImages from '../../assets/images';

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const getImagePath = (imagePath: string) => {
    try {
      // Extract the image filename from the path
      const filename = imagePath.split('/').pop()?.toLowerCase() || '';
      
      // Create a mapping of filenames to image keys
      const imageMapping: { [key: string]: string } = {
        'black headphone.jpg': 'blackHeadphone',
        'black headphone 1.jpg': 'blackHeadphone1',
        'rose headphone.jpg': 'roseHeadphone',
        'smartwatches.jpg': 'smartwatch',
        'laptop.jpg': 'laptop',
        'joy stick black.jpg': 'joystick',
        'ssd.jpg': 'ssd',
        'harddisk.jpg': 'harddisk',
        'ipad.jpg': 'ipad',
        'ram.jpg': 'ram',
        'laptops.jpg': 'laptops',
        'headphone.jpg': 'headphone',
        'iphone.jpg': 'iphone',
      };

      // Get the corresponding image key
      const imageKey = imageMapping[filename];
      
      // Return the image or fallback to default
      return imageKey ? (productImages as any)[imageKey] : productImages.defaultImage;
    } catch (error) {
      console.error('Error loading image:', error);
      return productImages.defaultImage;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
          onClick={() => handleProductClick(product._id)}
        >
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={getImagePath(product.image)}
              alt={product.name}
              className="object-cover w-full h-64"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = productImages.defaultImage;
                target.onerror = null; // Prevent infinite loop
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating) ? 'fill-current' : 'fill-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                ({product.numReviews})
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 