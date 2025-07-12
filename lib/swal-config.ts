// lib/swal-config.ts
export async function getReactSwal() {
  const Swal = (await import('sweetalert2')).default;
  const withReactContent = (await import('sweetalert2-react-content')).default;
  const ReactSwal = withReactContent(Swal);
  ReactSwal.mixin({
    customClass: {
      container: 'font-cairo',
      title: 'text-lg font-semibold mb-2',
      htmlContainer: 'text-muted-foreground',
      confirmButton: 'bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90',
      cancelButton:
        'bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 mr-2',
      actions: 'gap-2 mt-4',
    },
    buttonsStyling: false,
    showClass: {
      popup: 'animate-in fade-in-90 zoom-in-105',
    },
    hideClass: {
      popup: 'animate-out fade-out-90 zoom-out-105',
    },
  });
  return ReactSwal;
}
