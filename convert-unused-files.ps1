# Convert Unused Files to .txt for Safe Testing
# This script converts unused files to .txt format so we can test if the app still works

Write-Host "🔄 Converting unused files to .txt format..." -ForegroundColor Yellow

# Components to convert
$components = @(
    "components\CardImage.tsx",
    "components\empty-box.tsx", 
    "components\FilterAlert.tsx",
    "components\GoogleMap.tsx",
    "components\image-upload.tsx",
    "components\InputField.tsx",
    "components\mdx-components.tsx",
    "components\Notification.tsx",
    "components\SupportPingButton.tsx",
    "components\TextareaField.tsx",
    "components\ui\InfoTooltip.tsx"
)

# Hooks to convert
$hooks = @(
    "hooks\useCart.txt",
    "hooks\use-analytics.ts"
)

# Utils to convert
$utils = @(
    "utils\fashionSeedData copy.txt",
    "utils\seedWithAppLogic.ts",
    "utils\pusherActions.ts",
    "utils\localStoreage.ts",
    "utils\wrap-server-action.ts",
    "utils\seo.ts",
    "utils\uniqeId.ts"
)

# Lib files to convert
$lib = @(
    "lib\pusher1.ts",
    "lib\pusherSetting.ts",
    "lib\sendWhatsapp-otp.ts",
    "lib\cloudinary.ts",
    "lib\image-utils.ts",
    "lib\getGeo.ts",
    "lib\cacheTest.ts",
    "lib\pusherClient.ts",
    "lib\pusherServer.ts",
    "lib\getAddressFromLatLng.ts",
    "lib\auth-dynamic-config.ts",
    "lib\importFonts.ts",
    "lib\isValidObjectId.ts",
    "lib\notifications.ts",
    "lib\alert-utils.ts",
    "lib\revalidate.ts",
    "lib\swal-config.ts",
    "lib\web-vitals.ts"
)

# Scripts to convert
$scripts = @(
    "scripts\checkOrderAddressIntegrity.ts",
    "scripts\migrate-addresses.ts",
    "scripts\add-test-orders.ts",
    "scripts\verify-test-data.ts",
    "scripts\test-cancel-reason.js",
    "scripts\re-register-push-subscription.ts",
    "scripts\check-driver-capacity.ts",
    "scripts\check-user-subscription.ts",
    "scripts\verify-order-data.js"
)

# Combine all files
$allFiles = $components + $hooks + $utils + $lib + $scripts

$convertedCount = 0
$skippedCount = 0

foreach ($file in $allFiles) {
    if (Test-Path $file) {
        try {
            $txtFile = $file + ".txt"
            Copy-Item $file $txtFile
            Remove-Item $file
            Write-Host "✅ Converted: $file" -ForegroundColor Green
            $convertedCount++
        }
        catch {
            Write-Host "❌ Failed to convert: $file" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host "`n📊 Conversion Summary:" -ForegroundColor Cyan
Write-Host "✅ Converted: $convertedCount files" -ForegroundColor Green
Write-Host "⚠️  Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "`n🔄 Ready to test build..." -ForegroundColor Cyan 