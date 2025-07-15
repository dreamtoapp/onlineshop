# PWA Action Plan: Best Practices & Dynamic Company Logo

## Goals
- Ensure PWA manifest follows best practices
- Use company info (name, description, logo) dynamically in the manifest
- Guarantee zero errors and full installability

---

## Action Steps

### 1. Manifest Source
- [x] Use only `app/manifest.ts` for the manifest (ignore/remove `public/manifest.json`)

### 2. Dynamic Company Info
- [x] Fetch company info (name, short_name, description, logo) from the database in `app/manifest.ts`
- [x] Set `name`, `short_name`, and `description` dynamically

### 3. Dynamic Logo/Icon
- [x] Use the company logo as the manifest icon if available (manifest.ts now references logo_192 and logo_512 from company record)
- [x] If not, fallback to a default icon (manifest always provides valid icons, either from Cloudinary or default)
- [x] (Optional) On logo upload, auto-generate 192x192 and 512x512 PNGs — **Not needed with Cloudinary: all required sizes are generated on the fly via URL transformation.**

### 4. Manifest Fields
- [x] Set `start_url` to `/` (unless business logic requires otherwise)
- [x] Set `display` to `standalone`
- [x] Set `theme_color` and `background_color` to match brand

### 5. Remove Redundancy
- [x] Remove or ignore `public/manifest.json` to avoid conflicts

### 6. Testing & Validation
- [ ] Test PWA installability and icon display on real devices and with Lighthouse
- [ ] Check for manifest errors, CORS issues, and icon display
- [ ] Validate all fields (name, description, icons, theme_color, etc.)

### 7. Documentation
- [ ] Document the dynamic manifest and logo process in README or docs

---

## Notes
- If the company logo is stored in a CDN or external URL, ensure CORS is handled for manifest icons
- If logo is not a PNG or not square, convert/crop as needed
- Document any manual steps for future maintainers
- **logo_192 and logo_512 must be set up in the company record for full dynamic icon support.**
- **With Cloudinary, you do not need to store separate PNGs for each size; use URL transformations instead.**

---

**Summary:**
- The manifest logic is now robust: it always provides valid icons (Cloudinary or default), and all dynamic fields are set. Ready for testing and documentation.

---

## Step-by-Step Instructions: PWA Testing & Validation

### 1. Lighthouse Audit (Chrome DevTools)
- Open your site in Google Chrome.
- Open DevTools (F12 or Ctrl+Shift+I).
- Go to the "Lighthouse" tab.
- Select "Progressive Web App" and click "Analyze page load".
- Review the results for any errors or warnings (especially manifest, icons, and installability).

### 2. Real Device Testing
- On your phone/tablet, open your site in Chrome or Safari.
- Open the browser menu and select "Add to Home screen" or "Install app".
- Confirm the app installs and the icon appears correctly.
- Open the app from your home screen and check splash screen, icon, and offline behavior (if supported).

### 3. Manifest & Icon Validation
- In DevTools, go to the "Application" tab.
- Under "Manifest", verify all fields (name, icons, theme_color, etc.) are correct.
- Click each icon to preview and ensure it loads (no CORS or 404 errors).

### 4. Troubleshooting
- If icons do not appear, check Cloudinary URLs and CORS settings.
- If install prompt does not show, ensure HTTPS and a valid manifest.
- Fix any Lighthouse or browser warnings before going live. 