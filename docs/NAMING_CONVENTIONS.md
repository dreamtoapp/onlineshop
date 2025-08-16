## Project Naming Rules (Functions and Variables)

### Goals
- Simple, clear English. No abbreviations or cryptic names.
- Descriptive over short. Never use 1–2 character names (e.g., `a`, `x`).
- Consistent casing: `camelCase` for variables/functions, `PascalCase` for components/classes/types.

### Functions
- Use action verbs; present tense; describe exactly what they do.
- Prefer domain terms where helpful.
- Examples:
```ts
// Good
saveIncomingMessage()
recordMessageStatus()
buildApiEndpoint()
getApiHeaders()

// Bad
doMsg()
handle()
proc()
```

### Variables
- Use nouns or noun phrases. Include context (who/what) in the name.
- Booleans start with `is/has/should/can`.
- Avoid generic names like `data`, `obj`, `res`, `arr`.
- Examples:
```ts
// Good
customerId
messageText
isActiveDriver
statusUpdate

// Bad
d
obj1
flag
tmp
```

### Components/Classes/Types
- `PascalCase` for React components, classes, enums, and interfaces.
- Types/interfaces should be descriptive (avoid `Any`, avoid suffixing everything with `Type`).
- Examples:
```ts
// Good
OrderAnalyticsChart
WhatsAppConfig
OrderStatus

// Bad
orderchart
cfg
Enum1
```

### Constants and Config
- Environment keys remain UPPER_SNAKE_CASE.
- In-code constants use `camelCase` unless they are truly global flags.
- Examples:
```ts
// Good
const useDbWhatsappWebhookProcessing = process.env.USE_DB_WHATSAPP_WEBHOOK_PROCESSING === 'true';

// Allowed (env)
process.env.WHATSAPP_PHONE_NUMBER_ID
```

### TypeScript Rules
- No `any`. Use precise types or `unknown` with narrowing.
- Prefer deriving types from sources (e.g., Prisma schema) instead of manual duplication when practical.

### General Guidance
- Prefer explicit over implicit; avoid cleverness.
- Names should make comments unnecessary most of the time.
- Keep function scope small; single responsibility (SOLID-friendly).



