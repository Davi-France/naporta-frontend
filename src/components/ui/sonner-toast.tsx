import type { ToastType } from '@/types';
import { toast } from 'sonner';

interface ToastOptions {
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = (
  title: string,
  description?: string,
  options: ToastOptions = {}
) => {
  const { type = 'success', duration = 4000, action } = options;

  const toastConfig: any = {
    duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  };

  switch (type) {
    case 'success':
      toast.success(title, {
        description,
        ...toastConfig,
      });
      break;
    case 'error':
      toast.error(title, {
        description,
        ...toastConfig,
      });
      break;
    case 'warning':
      toast.warning(title, {
        description,
        ...toastConfig,
      });
      break;
    case 'info':
      toast.info(title, {
        description,
        ...toastConfig,
      });
      break;
    default:
      toast(title, {
        description,
        ...toastConfig,
      });
  }
};

export { toast };