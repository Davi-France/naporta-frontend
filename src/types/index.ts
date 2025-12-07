export interface User {
  id: string;
  email: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface OrderItem {
  _id?: string;
  description: string;
  price: number;
}

export interface Order {
  _id: string;
  number: string;
  expectedDeliveryDate: string;
  clientName: string;
  clientDocument: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: 'novopedido' | 'aceito' | 'emproducao' | 'pronto' | 'entregue' | 'cancelado';
  createdAt: string;
  deleted: boolean;
  total?: number;
}

export interface AuthResponse {
  access_token: string;
}

export interface LoginData {
  email: string;
  password: string;
}


export interface OrderFormData {
  number: string;
  clientName: string;
  clientDocument: string;
  deliveryAddress: string;
  expectedDeliveryDate: string;
  status: 'novopedido' | 'aceito' | 'emproducao' | 'pronto' | 'entregue' | 'cancelado';
  items: OrderItem[];
}

export interface CalculateOrderResponse {
  total: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';