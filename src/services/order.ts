import type { Order, OrderFormData } from '@/types';
import api from './api';

export const ordersService = {
  async getAll(): Promise<{ items: Order[] }> {
    const response = await api.get('/orders');
    return response.data;
  },

  async getFiltered(queryParams: string): Promise<{ items: Order[] }> {
    const response = await api.get(`/orders${queryParams}`);
    return response.data;
  },


  async getById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async create(data: OrderFormData): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async update(id: string, data: Partial<OrderFormData>): Promise<Order> {
    const response = await api.patch(`/orders/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },

  async calculateOrder(id: string): Promise<{ total: number }> {
    const response = await api.post(`/orders/calculate-order/${id}`);
    return response.data;
  },
};