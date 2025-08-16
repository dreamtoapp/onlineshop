// Temporary defaults to avoid relying on .env during setup.
// Replace the placeholder strings with your real values copied from your private .env.
// NOTE: These are for development/staging only. Do NOT commit real secrets to a public repo.

export const DEFAULT_COMPANY_SETTINGS = {
  // Cloudinary
  cloudinaryCloudName: 'dhyh7aufp',
  cloudinaryApiKey: '514636716573491',
  cloudinaryApiSecret: 'dnIYjzsrvmjUhK9fLLnRaJQyz0I',
  cloudinaryUploadPreset: 'E-comm',
  cloudinaryClientFolder: 'amwag',

  // WhatsApp
  whatsappPermanentToken: 'EAAlbxe42UBwBPB583mFV5rUr0f4i9jPbGlZCwmZAwYyclfGJyA0wqB6pD7cxvKVrN5tceFdygwn84WeeDZBZCsD2ZC1Rbk732lACcbPmBduZBY19xXZCGpOh5Hmz3wVonvnSqASqRvdbMvntHiqReXxmMZAQszNRzJcKXmwm4ASHYREOsbsCJXuTScwYjN4fhH8ZAOQZDZD',
  whatsappPhoneNumberId: '744540948737430',
  whatsappApiVersion: 'v23.0',
  whatsappBusinessAccountId: '752435584083272',
  whatsappWebhookVerifyToken: 'ammwag_webhook_2024',
  whatsappAppSecret: 'bde6d09b706496ceb34352ce56f518df',
  whatsappNumber: '',

  // Email / SMTP (works with most SMTP providers: SendGrid, Resend, Mailgun, Gmail, etc.)
  emailUser: 'devnadish@gmail.com',
  emailPass: 'gdmc gxxv eths gqgn',
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',

  // Analytics
  gtmContainerId: '',

  // Pusher
  pusherAppId: '1946717',
  pusherKey: '5a58b98a320f45940b0c',
  pusherSecret: 'ea7e9b152b16c6d28afd',
  pusherCluster: 'us2',

  // Web Push (VAPID)
  vapidPublicKey: 'BItqQ5e0yq2bjIquXBHMVy-_4I3bTPqAKqdCJdG_BQCjYPUSs_zmC-Yw13OmUBwWR4TL9sWrfgn535pfOQ1YDj4',
  vapidPrivateKey: 'Hm6gy3OnZ8AUZfDZwVZ8FHD1y3KfgUvXNchuQmEPbjA',
  vapidSubject: 'mailto:admin@dreamtoapp.com',
  vapidEmail: 'admin@dreamtoapp.com',

  // Auth
  authCallbackUrl: 'http://localhost:3000',
  // Auth behavior toggles
  requireWhatsappOtp: false,

  // Other client-only keys (example)
  googleMapsApiKey: 'AIzaSyDQcbJV7DpTft7TkYTutaJ9YBt-eMvn-3E',
};

export type DefaultCompanySettings = typeof DEFAULT_COMPANY_SETTINGS;
/**
 * SMTP notes
 * - These fields are generic and should work with most SMTP providers.
 * - Common rules:
 *   - Port 465 → secure: true (implicit TLS)
 *   - Port 587/25 → secure: false (STARTTLS)
 *   - For SendGrid/Resend, user is often "apikey" and pass is the API key
 * - If a provider is API-only (no SMTP), use their SDK separately instead of these fields.
 */