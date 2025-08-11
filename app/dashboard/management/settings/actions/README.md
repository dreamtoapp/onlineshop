This directory contains server actions for the admin Settings area.

Guidelines:
- Validate inputs with schemas from `../helper`.
- Perform partial updates only; never overwrite with empty strings.
- Always call `revalidateTag('company')` after mutations.

Do not:
- Export UI components.
- Leak secrets to client; return generic success messages.


