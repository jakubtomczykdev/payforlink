'use client';

import { ActivityItem } from '@/app/admin/actions/activity';
import { getRecentActivity, sendAdminNotification } from '@/app/admin/actions/activity';
import { useEffect, useState, useTransition } from 'react';
import { Activity, Zap, Users, ShieldAlert, Calendar, Bell, Send, Loader2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

export function AdminActivitySidebar() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [notificationOpen, setNotificationOpen] = useState(false);

    // Notification Form State
    const [targetEmail, setTargetEmail] = useState('');
    const [msgTitle, setMsgTitle] = useState('');
    const [msgContent, setMsgContent] = useState('');
    const [isSending, startTransition] = useTransition();

    const fetchActivity = async () => {
        try {
            const data = await getRecentActivity();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activity", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
        const interval = setInterval(fetchActivity, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const handleSendNotification = async () => {
        if (!msgTitle || !msgContent) return;

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('title', msgTitle);
                formData.append('message', msgContent);
                if (targetEmail) formData.append('targetEmail', targetEmail);

                await sendAdminNotification(formData);

                alert("Powiadomienie wysłane!"); // Fallback for now since no toast
                setNotificationOpen(false);
                setMsgTitle('');
                setMsgContent('');
                setTargetEmail('');
            } catch (err) {
                console.error(err);
                alert("Błąd wysyłania powiadomienia");
            }
        });
    };

    return (
        <aside className="w-80 border-l border-white/[0.08] bg-[#09090B]/95 hidden xl:flex flex-col fixed right-0 inset-y-0 z-50">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Kanał Aktywności</h3>
                <div className="flex gap-2">
                    <button onClick={fetchActivity} className="text-zinc-500 hover:text-white transition-colors">
                        <RefreshCw size={14} className={loading && activities.length === 0 ? "animate-spin" : ""} />
                    </button>
                    <Activity size={16} className="text-emerald-500" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
                {loading && activities.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 flex flex-col items-center">
                        <Loader2 className="animate-spin mb-2" />
                        <span className="text-xs">Ładowanie zdarzeń...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                <div className={`p-2 rounded-lg transition-colors ${item.type === 'PAYOUT' ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black' :
                                        item.type === 'USER' ? 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-black' :
                                            'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-black'
                                    }`}>
                                    {item.type === 'PAYOUT' && <Zap size={16} />}
                                    {item.type === 'USER' && <Users size={16} />}
                                    {item.type === 'FLAG' && <ShieldAlert size={16} />}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                                    <div className="text-[10px] text-zinc-500 leading-relaxed break-words">
                                        {item.description}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 mt-2 font-mono flex items-center gap-1">
                                        {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: pl })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/[0.08] space-y-4">
                {/* Notification Widget */}
                <div className={`transition-all duration-300 overflow-hidden ${notificationOpen ? 'max-h-[350px]' : 'max-h-12'}`}>
                    {!notificationOpen ? (
                        <button
                            onClick={() => setNotificationOpen(true)}
                            className="w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-wider"
                        >
                            <Bell size={16} /> Wyślij Powiadomienie
                        </button>
                    ) : (
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-white">Nowe Powiadomienie</span>
                                <button onClick={() => setNotificationOpen(false)} className="text-zinc-500 hover:text-white text-[10px]">Anuluj</button>
                            </div>
                            <input
                                placeholder="Email użytkownika (opcjonalne)"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                                value={targetEmail}
                                onChange={e => setTargetEmail(e.target.value)}
                            />
                            <input
                                placeholder="Tytuł"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                                value={msgTitle}
                                onChange={e => setMsgTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Treść wiadomości..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none h-16"
                                value={msgContent}
                                onChange={e => setMsgContent(e.target.value)}
                            />
                            <button
                                onClick={handleSendNotification}
                                disabled={isSending || !msgTitle || !msgContent}
                                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                            >
                                {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Wyślij
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-purple-500" />
                        <span className="text-xs font-bold text-white">Kalendarz Systemowy</span>
                    </div>
                    <div className="text-2xl font-black text-white">{new Date().getDate()}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">
                        {new Date().toLocaleDateString('pl-PL', { weekday: 'long', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </aside>
    );
}
