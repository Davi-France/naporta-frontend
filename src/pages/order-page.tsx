import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Filter, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showToast } from '@/components/ui/sonner-toast';
import { OrderList } from '@/components/orders/order-list';

export const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilterType, setDateFilterType] = useState<'createdAt' | 'expectedDeliveryDate'>('expectedDeliveryDate');

  const handleSearch = () => {
    showToast('Busca', 'Aplicando filtros...', { type: 'info' });

    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (statusFilter !== 'all') newParams.set('status', statusFilter);
    if (startDate) newParams.set('startDate', startDate);
    if (endDate) newParams.set('endDate', endDate);
    newParams.set('dateType', dateFilterType);

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setDateFilterType('expectedDeliveryDate');
    setSearchParams(new URLSearchParams());
    showToast('Filtros limpos', 'Todos os filtros foram removidos', { type: 'info' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Pedidos
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os pedidos do sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
          <CardDescription>
            Filtre os pedidos por texto, status e data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Buscar pedido
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Número, cliente ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="novopedido">Novo Pedido</SelectItem>
                    <SelectItem value="aceito">Aceito</SelectItem>
                    <SelectItem value="emproducao">Em Produção</SelectItem>
                    <SelectItem value="pronto">Pronto</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Filtrar por data de
                </label>
                <Select value={dateFilterType} onValueChange={(value: any) => setDateFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expectedDeliveryDate">Entrega Esperada</SelectItem>
                    <SelectItem value="createdAt">Criação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium">
                  Filtrar por período
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Data inicial
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Data final
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full"
                    disabled={!startDate && !endDate}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Aplicar Período
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {dateFilterType === 'expectedDeliveryDate'
                  ? 'Filtrando pela data prevista de entrega'
                  : 'Filtrando pela data de criação do pedido'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderList
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        startDate={startDate}
        endDate={endDate}
        dateFilterType={dateFilterType}
      />
    </div>
  );
};