// utils/wrap-server-action.ts
export function wrapServerAction<T extends { success: boolean; message?: string }>(
  action: (prevState: T, formData: FormData) => Promise<T>
): (prevState: T, formData: FormData) => Promise<T> {
  return async (prevState, formData) => {
    try {
      return await action(prevState, formData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.';
      return { success: false, message } as T;
    }
  };
}
