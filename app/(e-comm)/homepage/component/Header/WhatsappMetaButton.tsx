"use client"
import { Button, ButtonProps } from '../../../../../components/ui/button';
import * as React from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle
} from '../../../../../components/ui/dialog';
import CustomSvgIcon from '../Fotter/CustomSvgIcon';

const WHATSAPP_GREEN = '#25D366';
const MAX_LENGTH = 1000;

interface WhatsappMetaButtonProps extends Omit<ButtonProps, 'onClick'> {
    onSend?: (msg: string) => Promise<void>;
    placeholder?: string;
    buttonText?: string;
}

const WhatsappMetaButton: React.FC<WhatsappMetaButtonProps> = ({ onSend, placeholder = 'اكتب رسالتك هنا...', buttonText = 'إرسال عبر واتساب', ...props }) => {
    const [msg, setMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [feedback, setFeedback] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim()) return;
        setLoading(true);
        setFeedback(null);
        try {
            // Best practice: POST to your backend, which then calls WhatsApp Cloud API
            if (onSend) {
                await onSend(msg);
            } else {
                await fetch('/api/send-whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg })
                });
            }
            setFeedback('تم إرسال الرسالة بنجاح!');
            setMsg('');
            setTimeout(() => setOpen(false), 1200);
        } catch (err) {
            setFeedback('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    style={{
                        backgroundColor: WHATSAPP_GREEN,
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.15)'
                    }}
                    className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:brightness-95 focus:ring-2 focus:ring-[#25D366] transition-all duration-150"
                    size="icon"
                    aria-label="تواصل عبر واتساب"
                    {...props}
                >
                    <CustomSvgIcon name="whatsapp" className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm w-full">
                <DialogTitle className="flex items-center gap-2">
                    <CustomSvgIcon name="whatsapp" className="h-6 w-6" />
                    تواصل معنا عبر واتساب
                </DialogTitle>
                <div className="text-sm text-muted-foreground mb-2">أرسل لنا رسالة وسيتم الرد عليك عبر واتساب في أقرب وقت.</div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                    <textarea
                        className="border rounded-md p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                        rows={4}
                        placeholder={placeholder}
                        value={msg}
                        onChange={e => setMsg(e.target.value.slice(0, MAX_LENGTH))}
                        disabled={loading}
                        maxLength={MAX_LENGTH}
                        aria-label="رسالتك عبر واتساب"
                        required
                        style={{ background: '#fff', color: '#222' }}
                    />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{msg.length} / {MAX_LENGTH} حرف</span>
                        {feedback && <span className={feedback.includes('نجاح') ? 'text-green-600' : 'text-red-600'}>{feedback}</span>}
                    </div>
                    <Button
                        type="submit"
                        style={{ backgroundColor: WHATSAPP_GREEN, color: '#fff' }}
                        className="rounded-md hover:brightness-95 focus:ring-2 focus:ring-[#25D366] flex items-center gap-2 text-base font-bold py-2"
                        size="sm"
                        disabled={loading || !msg.trim()}
                        aria-busy={loading}
                    >
                        <CustomSvgIcon name="whatsapp" className="h-5 w-5" />
                        {loading ? 'جاري الإرسال...' : buttonText}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WhatsappMetaButton; 