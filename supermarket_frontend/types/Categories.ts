
export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  details: {
    weight?: string;
    origin?: string;
    organic?: boolean;
    storage?: string;
  };
  nutrition: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
  };
  reviews: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: Product[]; 
}


export interface CartItem {
  id: number;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  total_price: number;
}

export interface CartResponse {
  items: CartItem[];
  total_cart_price: number;
}



export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}
