## ngrok HTTPS guide for WhatsApp webhook (Windows)

This sets up a secure public URL for your local Next.js app so Meta can call your webhook.

### 1) Install and authenticate
- Download ngrok for Windows and add it to PATH: `https://ngrok.com/download`
- Get your authtoken from the ngrok dashboard (Getting Started → Your Authtoken)

```powershell
ngrok config add-authtoken YOUR_NGROK_AUTHTOKEN
```

Do NOT commit your authtoken to the repo.

### 2) Run your Next.js app locally
```powershell
pnpm dev
```
Default: `http://localhost:3000`

### 3) Start an HTTPS tunnel to your app
```powershell
ngrok http http://localhost:3000
```

Copy the HTTPS URL shown (e.g., `https://abc123.ngrok.app`). Keep the ngrok window open; closing it kills the URL.

Optional (paid): keep a fixed domain
```powershell
ngrok http --domain=yourname.ngrok.app 3000
```

### 4) Configure Meta (WhatsApp Cloud)
- Callback URL: `https://YOUR_NGROK_DOMAIN/api/webhook/whatsapp`
- Verify Token: must match the value stored in DB (`Company.whatsappWebhookVerifyToken`)
- Subscribe to: messages, message status

App secrets (DB fields) that must be correct:
- `whatsappPermanentToken`
- `whatsappPhoneNumberId`
- `whatsappWebhookVerifyToken`
- `whatsappAppSecret`

### 5) Feature flags in your app
Set in your `.env.local` (and restart dev server):
```bash
USE_DB_WHATSAPP_WEBHOOK_PROCESSING=true
# Optional auto-reply
AUTO_REPLY_ENABLED=false
```

### 6) Test from your phone
- Send a WhatsApp message to your business number
- Expected logs (examples):
```
whatsapp.webhook { kind: 'request', mode: 'db' }
whatsapp.webhook { kind: 'message', waMessageId: '...', fromWa: '...' }
```
- Verify DB with Prisma Studio:
```powershell
pnpm prisma studio
```

### 7) Troubleshooting
- 401 Invalid signature: `whatsappAppSecret` mismatch
- 403 Verify failed: webhook verify token mismatch between Meta and DB
- Mode shows `log-only`: set `USE_DB_WHATSAPP_WEBHOOK_PROCESSING=true` and restart
- No rows but 200 OK: wrong `DATABASE_URL`/database in Studio or Compass
- Local HTTPS via Next.js is not required; ngrok already provides valid HTTPS

### 8) Useful commands
```powershell
# Tunnel to a specific port (variant syntax)
ngrok http 3000

# Open local inspector
start http://127.0.0.1:4040

# Update token (if it changes)
ngrok config add-authtoken NEW_TOKEN
```


