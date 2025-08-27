## lib/email directory overview

### lib/email/sendOtpEmail.ts
- **Exports**: `sendOtpEmail(to, otp, recipientName?)`
- **Purpose**: Send one-time password emails via Gmail (nodemailer)
- **Runtime**: Server
- **Depends on**: `nodemailer`, env (`EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SENDER_NAME`, `APP_NAME`, `APP_URL`)
- **Used by**: Auth/verification flows (intended)
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Complements WhatsApp OTP by providing email-based OTP delivery.

## Usage audit (direct vs indirect)
- Direct imports: none currently in scan; function is available for verification flows.
- Indirect usage: none.

## Final deletion flags (based on deep scan)
- `lib/email/sendOtpEmail.ts` → SAFE TO DELETE: NO



















