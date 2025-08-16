## lib/zod directory overview

### lib/zod/address.ts
- **Exports**: `addressSchema`, `AddressInput`
- **Purpose**: Validate address input fields for user address forms and APIs
- **Runtime**: Server/Build-time
- **Depends on**: `zod`
- **Used by**: `app/api/user/addresses/route.ts`, `app/api/user/addresses/[id]/route.ts`, `app/api/admin/customer-addresses/[id]/route.ts`
- **DB models**: none
- **SAFE TO DELETE**: NO

## Cross-flows
- Address create/update APIs use `addressSchema` to validate payloads.

## Usage audit (direct vs indirect)

- `lib/zod/address.ts`
  - **Direct imports**: listed above
  - **Indirect usage**: none

## Final deletion flags (based on deep scan)
- `lib/zod/address.ts` → SAFE TO DELETE: NO


