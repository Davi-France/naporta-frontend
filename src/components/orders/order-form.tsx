import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Order } from '@/types';
import { ordersService } from '@/services/order';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { showToast } from '@/components/ui/sonner-toast';

// Gerar número de pedido único (P-XXXX)
const generateOrderNumber = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `P-${randomNum}`;
};

// Status válidos
const STATUS_OPTIONS = [
  { value: 'novopedido', label: 'Novo Pedido' },
  { value: 'aceito', label: 'Aceito' },
  { value: 'emproducao', label: 'Em Produção' },
  { value: 'pronto', label: 'Pronto' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
] as const;

// Schema para items - SEM QUANTITY!
const itemSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  price: z.number().min(0.01, 'Preço deve ser maior que 0'),
});

const formSchema = z.object({
  number: z.string().min(1, 'Número do pedido é obrigatório'),
  clientName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  clientDocument: z.string().min(11, 'CPF/CNPJ inválido'),
  deliveryAddress: z.string().min(10, 'Endereço muito curto'),
  expectedDeliveryDate: z.string().min(1, 'Data de entrega é obrigatória'),
  status: z.enum(['novopedido', 'aceito', 'emproducao', 'pronto', 'entregue', 'cancelado']),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item'),
});

type FormData = z.infer<typeof formSchema>;

interface OrderFormProps {
  order?: Order | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: order?.number || generateOrderNumber(),
      clientName: order?.clientName || '',
      clientDocument: order?.clientDocument || '',
      deliveryAddress: order?.deliveryAddress || '',
      expectedDeliveryDate: order?.expectedDeliveryDate
        ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0]
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: order?.status || 'novopedido',
      items: order?.items.map(item => ({
        description: item.description,
        price: item.price,
        // SEM quantity!
      })) || [{ description: '', price: 0 }],
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      // Criar payload exatamente como o backend espera
      const payload = {
        number: values.number,
        clientName: values.clientName,
        clientDocument: values.clientDocument,
        deliveryAddress: values.deliveryAddress,
        expectedDeliveryDate: values.expectedDeliveryDate,
        status: values.status,
        items: values.items.map(item => ({
          description: item.description,
          price: item.price,
          // SEM quantity!
        })),
      };

      console.log('Enviando payload:', payload);

      if (order) {
        await ordersService.update(order._id, payload);
        showToast('Sucesso', 'Pedido atualizado com sucesso', { type: 'success' });
      } else {
        await ordersService.create(payload);
        showToast('Sucesso', 'Pedido criado com sucesso', { type: 'success' });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Erro detalhado:', error);

      if (error.response?.data?.message) {
        showToast('Erro', error.response.data.message, { type: 'error' });
      } else if (error.response?.data) {
        // Mostrar erros de validação do NestJS
        const errors = error.response.data;
        if (Array.isArray(errors)) {
          errors.forEach((err: any) => {
            showToast('Erro de validação', `${err.property}: ${err.constraints?.[Object.keys(err.constraints)[0]]}`, { type: 'error' });
          });
        } else {
          showToast('Erro', JSON.stringify(errors), { type: 'error' });
        }
      } else {
        showToast('Erro', 'Não foi possível salvar o pedido', { type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const items = form.getValues('items');
    form.setValue('items', [...items, { description: '', price: 0 }]);
  };

  const removeItem = (index: number) => {
    const items = form.getValues('items');
    if (items.length > 1) {
      form.setValue('items', items.filter((_, i) => i !== index));
    }
  };

  // Calcular total do pedido
  const calculateTotal = () => {
    const items = form.watch('items');
    return items.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Pedido</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!!order}
                        className={order ? 'bg-gray-100' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Endereço e Data */}
            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço de Entrega</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedDeliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Prevista de Entrega</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <FormLabel>Itens do Pedido</FormLabel>
                  <p className="text-sm text-gray-500">
                    Total: R$ {calculateTotal().toFixed(2)}
                  </p>
                </div>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus size={16} className="mr-1" />
                  Adicionar Item
                </Button>
              </div>

              {form.watch('items').map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Descrição</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome do produto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Preço Unitário</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={form.watch('items').length <= 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}

              <p className="text-xs text-gray-500 mt-2">
                💡 Cada item tem quantidade = 1. Para múltiplas unidades, adicione o mesmo item várias vezes.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : order ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};