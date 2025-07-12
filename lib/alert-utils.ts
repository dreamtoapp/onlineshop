// lib/alert-utils.ts
import { getReactSwal } from './swal-config';

type AlertOptions = {
  title?: string;
  text?: string;
  html?: string;
  timer?: number;
};

export const Alert = {
  toast: {
    success: async (message: string) => {
      const ReactSwal = await getReactSwal();
      ReactSwal.fire({
        title: '\u062a\u0645 \u0628\u0646\u062c\u0627\u062d!',
        text: message,
        icon: 'success',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
    error: async (message: string) => {
      const ReactSwal = await getReactSwal();
      ReactSwal.fire({
        title: '\u062e\u0637\u0623!',
        text: message,
        icon: 'error',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 4000,
      });
    },
  },
  dialog: {
    confirm: async (options: AlertOptions) => {
      const ReactSwal = await getReactSwal();
      return ReactSwal.fire({
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '\u062a\u0623\u0643\u064a\u062f',
        cancelButtonText: '\u0625\u0644\u063a\u0627\u0621',
        ...options,
      });
    },
    success: async (options: AlertOptions) => {
      const ReactSwal = await getReactSwal();
      return ReactSwal.fire({
        icon: 'success',
        confirmButtonText: '\u062d\u0633\u0646\u0627\u064b',
        ...options,
      });
    },
  },
};
