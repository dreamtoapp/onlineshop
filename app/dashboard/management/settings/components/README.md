This directory contains UI components for the admin Settings area.

Guidelines:
- Keep components purely presentational; no direct DB calls.
- Use server actions from `../actions` for mutations.
- Place form components under `components/forms/`.
- Co-locate small utility UI pieces here if they are settings-specific.

Do not:
- Read environment variables directly.
- Implement server-side logic here.


