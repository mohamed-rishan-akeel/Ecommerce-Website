import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  ClockIcon,
  FireIcon,
  TagIcon
} from '@heroicons/react/24/outline';

// Import images
import iphone from '../assets/images/iphone.jpg';
import laptop from '../assets/images/laptop.jpg';
import headphone from '../assets/images/black headphone.jpg';
import joystick from '../assets/images/joy stick black.jpg';

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  validUntil: string;
  type: 'flash' | 'clearance' | 'bundle' | 'special';
}

const deals: Deal[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Bundle',
    description: 'Get iPhone 15 Pro with AirPods Pro and MagSafe charger',
    originalPrice: 1299,
    discountedPrice: 1099,
    discountPercentage: 15,
    image: iphone,
    validUntil: '2024-03-31',
    type: 'bundle'
  },
  {
    id: '2',
    title: 'Gaming Laptop Clearance',
    description: 'Last year models with RTX 3080 at clearance prices',
    originalPrice: 2499,
    discountedPrice: 1799,
    discountPercentage: 28,
    image: laptop,
    validUntil: '2024-03-25',
    type: 'clearance'
  },
  {
    id: '3',
    title: 'Flash Sale - Headphones',
    description: 'Premium noise-cancelling headphones',
    originalPrice: 399,
    discountedPrice: 299,
    discountPercentage: 25,
    image: headphone,
    validUntil: '2024-03-20',
    type: 'flash'
  },
  {
    id: '4',
    title: 'Special Offer - Gaming Bundle',
    description: 'Gaming controller with 3 months Game Pass subscription',
    originalPrice: 129,
    discountedPrice: 89,
    discountPercentage: 31,
    image: joystick,
    validUntil: '2024-03-28',
    type: 'special'
  }
];

const DealBadge = ({ type }: { type: Deal['type'] }) => {
  const badges = {
    flash: {
      icon: SparklesIcon,
      text: 'Flash Sale',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    },
    clearance: {
      icon: TagIcon,
      text: 'Clearance',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    },
    bundle: {
      icon: FireIcon,
      text: 'Bundle Deal',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    },
    special: {
      icon: ClockIcon,
      text: 'Special Offer',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
  };

  const { icon: Icon, text, color } = badges[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {text}
    </span>
  );
};

const Deals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Special Deals & Offers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Don't miss out on these amazing deals! Limited time offers on premium tech products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            to={`/products/${deal.id}`}
            className="group"
          >
            <div className="card overflow-hidden">
              <div className="relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-4 left-4">
                  <DealBadge type={deal.type} />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    {deal.discountPercentage}% OFF
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {deal.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {deal.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${deal.discountedPrice}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${deal.originalPrice}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Valid until
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(deal.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Deals; 