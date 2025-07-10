import { migrateExistingUsers } from "../lib/address-helpers";

async function runMigration() {
    console.log('🚀 بدء ترحيل عناوين المستخدمين...');
    console.log('======================================');
    
    try {
        const results = await migrateExistingUsers();
        
        console.log('✅ تم الانتهاء من الترحيل');
        console.log('======================================');
        console.log(`📊 النتائج:`);
        console.log(`   • المستخدمين المعالجين: ${results.processed}`);
        console.log(`   • العناوين المنشأة: ${results.created}`);
        console.log(`   • المتجاوزين: ${results.skipped}`);
        console.log(`   • الأخطاء: ${results.errors}`);
        
        if (results.errors > 0) {
            console.warn('⚠️  يرجى مراجعة الأخطاء في اللوقات أعلاه');
        }
        
    } catch (error) {
        console.error('❌ خطأ في الترحيل:', error);
        process.exit(1);
    }
}

// تشغيل الـ script فقط إذا تم استدعاؤه مباشرة
if (require.main === module) {
    runMigration()
        .then(() => {
            console.log('✨ اكتمل الترحيل بنجاح');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 فشل الترحيل:', error);
            process.exit(1);
        });
}

export default runMigration; 