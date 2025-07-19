export default function DashboardFooter() {
    return (
        <footer className='border-t bg-background/80 backdrop-blur-sm px-4 md:px-6 py-4'>
            <div className='flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-2 md:gap-4'>
                <div className='flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left'>
                    <span>© 2024 متجر. جميع الحقوق محفوظة.</span>
                    <span className='hidden md:inline'>•</span>
                    <span>الإصدار 1.0.0</span>
                </div>
                <div className='flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left'>
                    <span>الحالة: متصل</span>
                    <span className='hidden md:inline'>•</span>
                    <span>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</span>
                </div>
            </div>
        </footer>
    );
} 