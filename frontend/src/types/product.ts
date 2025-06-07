export interface Review {
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
} 