import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string, formatStr = 'dd/MM/yyyy') => {
  try {
    return format(parseISO(dateString), formatStr, { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString: string) => {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm');
};

export const isDateInRange = (date: Date, startDate?: string, endDate?: string): boolean => {
  if (!startDate && !endDate) return true;

  const dateStr = format(date, 'yyyy-MM-dd');

  if (startDate && endDate) {
    return dateStr >= startDate && dateStr <= endDate;
  } else if (startDate) {
    return dateStr >= startDate;
  } else if (endDate) {
    return dateStr <= endDate;
  }

  return true;
};