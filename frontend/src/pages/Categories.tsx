import { Link } from 'react-router-dom';
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  TvIcon,
  CameraIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  productCount: number;
}

const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Latest smartphones from top brands',
    icon: DevicePhoneMobileIcon,
    productCount: 24
  },
  {
    id: 'laptops',
    name: 'Laptops & Computers',
    description: 'High-performance laptops and desktops',
    icon: ComputerDesktopIcon,
    productCount: 18
  },
  {
    id: 'audio',
    name: 'Audio & Headphones',
    description: 'Premium audio equipment and accessories',
    icon: SpeakerWaveIcon,
    productCount: 15
  },
  {
    id: 'tv',
    name: 'TV & Home Theater',
    description: 'Smart TVs and home entertainment systems',
    icon: TvIcon,
    productCount: 12
  },
  {
    id: 'cameras',
    name: 'Cameras & Photography',
    description: 'Digital cameras and photography gear',
    icon: CameraIcon,
    productCount: 20
  },
  {
    id: 'components',
    name: 'PC Components',
    description: 'Computer parts and components',
    icon: CpuChipIcon,
    productCount: 30
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Tech accessories and gadgets',
    icon: WrenchScrewdriverIcon,
    productCount: 45
  },
  {
    id: 'tablets',
    name: 'Tablets & E-readers',
    description: 'Tablets, iPads, and e-book readers',
    icon: DeviceTabletIcon,
    productCount: 16
  }
];

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Shop by Category
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our wide range of tech categories. From smartphones to gaming gear, find exactly what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group"
            >
              <div className="card p-6 h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200">
                  <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {category.productCount} Products
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform duration-200">
                    Browse →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories; 