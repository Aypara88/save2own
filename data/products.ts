export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "PlayStation 5",
    price: 400000,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    category: "Gaming",
    description: "Latest gaming console with 4K gaming support",
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400",
    category: "Electronics",
    description: "Premium smartphone with advanced camera system",
  },
  {
    id: "3",
    name: "Samsung 55\" Smart TV",
    price: 650000,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    category: "Electronics",
    description: "4K UHD Smart TV with HDR support",
  },
  {
    id: "4",
    name: "MacBook Pro M2",
    price: 1800000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    category: "Electronics",
    description: "Powerful laptop for professionals",
  },
  {
    id: "5",
    name: "Nike Air Max",
    price: 85000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Fashion",
    description: "Premium sports shoes",
  },
  {
    id: "6",
    name: "LG Inverter AC",
    price: 350000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    category: "Home",
    description: "1.5HP Split Air Conditioner",
  },
  {
    id: "7",
    name: "Honda Generator",
    price: 350000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    category: "Home",
    description: "3.5KVA Generator for home use",
  },
  {
    id: "8",
    name: "Samsung Galaxy S23",
    price: 950000,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    category: "Electronics",
    description: "Android flagship smartphone",
  },
  {
    id: "9",
    name: "Apple Watch Series 8",
    price: 450000,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    category: "Electronics",
    description: "Advanced health and fitness tracking",
  },
  {
    id: "10",
    name: "JBL Bluetooth Speaker",
    price: 65000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    category: "Electronics",
    description: "Portable wireless speaker",
  },
];