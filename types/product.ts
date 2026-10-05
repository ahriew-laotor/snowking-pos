export interface Category {
  id: string;
  name: string;
  active?: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image?: string;
  available?: boolean;
}

export interface ProductOption {
  sweetness?: string;
  ice?: string;
  toppings?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  options: ProductOption;
  totalPrice: number;
}