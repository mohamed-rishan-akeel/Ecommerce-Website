import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const DUMMY_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
};

const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD001',
    date: '2023-12-01',
    status: 'delivered',
    total: 999,
    items: [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        quantity: 1,
        price: 999,
        image: '/images/iphone-15-pro.jpg',
      },
    ],
  },
  {
    id: 'ORD002',
    date: '2023-12-05',
    status: 'processing',
    total: 2398,
    items: [
      {
        id: '2',
        name: 'MacBook Pro M3',
        quantity: 1,
        price: 1999,
        image: '/images/macbook-pro.jpg',
      },
      {
        id: '3',
        name: 'Sony WH-1000XM5',
        quantity: 1,
        price: 399,
        image: '/images/sony-headphones.jpg',
      },
    ],
  },
];

const Profile = () => {
  const [user, setUser] = useState(DUMMY_USER);
  const [orders] = useState<Order[]>(DUMMY_ORDERS);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement API call to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(editedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary-600 hover:text-primary-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Street</label>
                  <input
                    type="text"
                    value={editedUser.address.street}
                    onChange={(e) => setEditedUser({
                      ...editedUser,
                      address: { ...editedUser.address, street: e.target.value }
                    })}
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={editedUser.address.city}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        address: { ...editedUser.address, city: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={editedUser.address.state}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        address: { ...editedUser.address, state: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={editedUser.address.zipCode}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        address: { ...editedUser.address, zipCode: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input
                      type="text"
                      value={editedUser.address.country}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        address: { ...editedUser.address, country: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="btn btn-primary w-full mt-4"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <p className="text-gray-600 dark:text-gray-400">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.address.street}<br />
                    {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                    {user.address.country}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Order History</h2>
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 