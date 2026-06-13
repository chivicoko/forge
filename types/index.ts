export interface ProductType {
  id: string
  name: string
  slug: string
  description: string
  images: string[]
  colors: string[]
  sizes: string[]
  price: number
  stock: number
  sold: number
  weight?: number
  category?: string
  category_id: string
  added_by_id: string
  is_listed: boolean
  created_at: string
  updated_at: string
}

export interface CartItem extends ProductType {
  quantity: number
}

export interface CategoryType {
  id: string
  name: string
  added_by_id: string
  is_listed: boolean
  created_at: string
  updated_at: string
}

export interface UserType {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  is_superuser: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface RatesType {
  id?: string
  country: string
  naira_rate: number
  currency: string
  created_at?: string
  updated_at?: string
}

export interface OrderItemType {
  product: string
  quantity: number
  color: string
  size: string
  cost: number
  price: number
}

export interface OrderType {
  id: string
  user: string
  order_items: OrderItemType[]
  status: string
  reference: string
  phone_number: string
  created_at: string
  address: string
  transaction?: string | null
  total_cost: number
}

export interface TransactionType {
  id: string
  user_id: string
  reference: string
  status: string
  type: string
  amount: number
  payment_service: string
  created_at: string
  updated_at: string
}
