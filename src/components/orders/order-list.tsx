import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Edit, Trash2, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Order } from '@/types';
import { ordersService } from '@/services/order';
import { showToast } from '../ui/sonner-toast';
import { OrderForm } from './order-form';

interface OrderListProps {
  searchTerm?: string;
  statusFilter?: string;
  startDate?: string;
  endDate?: string;
  dateFilterType?: 'createdAt' | 'expectedDeliveryDate';
}


export const OrderList: React.FC<OrderListProps> = ({
  searchTerm = '',
  statusFilter = 'all',
  startDate = '',      // Adicionar com valor padrão
  endDate = '',        // Adicionar com valor padrão
  dateFilterType = 'expectedDeliveryDate' // Adicionar com valor padrão
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      // Se temos filtros de data, vamos buscar com eles
      let response;
      if (startDate || endDate) {
        // Construir query params para a API
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        // A API do seu backend usa `startDate` e `endDate` para filtrar
        // por expectedDeliveryDate (conforme seu controller)
        response = await ordersService.getFiltered(`?${params.toString()}`);
      } else {
        response = await ordersService.getAll();
      }

      // Aplicar outros filtros localmente (texto e status)
      let filteredOrders = response.items.filter(order => !order.deleted);

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.number.toLowerCase().includes(term) ||
          order.clientName.toLowerCase().includes(term) ||
          order.clientDocument.toLowerCase().includes(term)
        );
      }

      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }

      setOrders(filteredOrders);
    } catch (error) {
      showToast('Erro', 'Não foi possível carregar os pedidos', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter, startDate, endDate, dateFilterType]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    try {
      await ordersService.delete(id);
      showToast('Sucesso', 'Pedido excluído com sucesso', { type: 'success' });
      loadOrders();
    } catch (error) {
      showToast('Erro', 'Não foi possível excluir o pedido', { type: 'error' });
    }
  };

  const handleCalculate = async (id: string) => {
    try {
      const result = await ordersService.calculateOrder(id);
      showToast(
        'Cálculo realizado',
        `Total do pedido: R$ ${result.total.toFixed(2)}`, // REMOVER .tax
        { type: 'success' }
      );
    } catch (error) {
      showToast('Erro', 'Não foi possível calcular o pedido', { type: 'error' });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package />
            Pedidos
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            Novo Pedido
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data Entrega</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.number}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>
                  {format(new Date(order.expectedDeliveryDate), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {order.items.length} itens
                  <span className="text-gray-500 text-xs block">
                    (Total: R$ {order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)})
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'novopedido' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'aceito' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'emproducao' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'pronto' ? 'bg-green-100 text-green-800' :
                          order.status === 'entregue' ? 'bg-gray-100 text-gray-800' :
                            order.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                    }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingOrder(order);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCalculate(order._id)}
                    >
                      <Calculator size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(order._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">Nenhum pedido encontrado</p>
            {searchTerm || statusFilter !== 'all' ? (
              <p className="text-sm text-gray-600 mb-4">
                {searchTerm ? `Nenhum resultado para "${searchTerm}"` : ''}
                {searchTerm && statusFilter !== 'all' ? ' com ' : ''}
                {statusFilter !== 'all' ? `status "${statusFilter}"` : ''}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Comece criando seu primeiro pedido
              </p>
            )}
            <Button onClick={() => setShowForm(true)}>
              Criar primeiro pedido
            </Button>
          </div>
        )}
      </CardContent>

      {showForm && (
        <OrderForm
          order={editingOrder}
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
          onSuccess={() => {
            loadOrders();
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}
    </Card>
  );
};