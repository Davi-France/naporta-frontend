import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  Calendar,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { ordersService } from '@/services/order';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Order } from '@/types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    recentOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await ordersService.getAll();
      const orders = response.items.filter(order => !order.deleted);
      const totalOrders = orders.length;
      const recentOrdersCount = orders.filter(order =>
        new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;

      const pendingOrders = orders.filter(order =>
        order.status === 'novopedido' || order.status === 'aceito'
      ).length;

      setStats({
        totalOrders,
        recentOrders: recentOrdersCount,
        pendingOrders,
      });

      //pega os 5 ultimso pedidosp ra mostrar
      setRecentOrders(
        orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novopedido':
        return 'bg-yellow-100 text-yellow-800';
      case 'aceito':
        return 'bg-blue-100 text-blue-800';
      case 'emproducao':
        return 'bg-purple-100 text-purple-800';
      case 'pronto':
        return 'bg-green-100 text-green-800';
      case 'entregue':
        return 'bg-gray-100 text-gray-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao sistema de gestão de pedidos Na Porta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos Recentes</p>
                <p className="text-3xl font-bold mt-2">{stats.recentOrders}</p>
                <p className="text-sm text-gray-500 mt-1">Últimos 7 dias</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Gerencie seus pedidos rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start"
              onClick={() => navigate('/orders')}
            >
              <Package className="mr-2 h-4 w-4" />
              Ver todos os pedidos
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/orders')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar novo pedido
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Últimos Pedidos
                </CardTitle>
                <CardDescription>
                  Pedidos criados recentemente
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/orders')}
              >
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/orders`)}
                  >
                    <div>
                      <p className="font-medium">{order.number}</p>
                      <p className="text-sm text-gray-600">{order.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(order.createdAt), 'dd/MM/yy', { locale: ptBR })}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Nenhum pedido encontrado</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/orders')}
                  >
                    Criar primeiro pedido
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo por Status</CardTitle>
          <CardDescription>
            Distribuição dos pedidos por status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { status: 'novopedido', label: 'Novo Pedido', color: 'bg-yellow-500' },
              { status: 'aceito', label: 'Aceito', color: 'bg-blue-500' },
              { status: 'emproducao', label: 'Em Produção', color: 'bg-purple-500' },
              { status: 'pronto', label: 'Pronto', color: 'bg-green-500' },
              { status: 'entregue', label: 'Entregue', color: 'bg-gray-500' },
            ].map((item) => {
              const count = recentOrders.filter(o => o.status === item.status).length;
              const percentage = recentOrders.length > 0 ? (count / recentOrders.length) * 100 : 0;

              return (
                <div key={item.status} className="text-center">
                  <div className="relative h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`h-20 w-20 rounded-full ${item.color} flex items-center justify-center mx-auto mb-2`}>
                          <span className="text-white font-bold text-lg">{count}</span>
                        </div>
                        <p className="text-sm font-medium">{item.label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};