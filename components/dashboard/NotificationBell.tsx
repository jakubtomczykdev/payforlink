'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertCircle, Gift } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/actions/notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'SYSTEM' | 'BONUS' | 'OFFER' | 'PAYOUT';
    isRead: boolean;
    createdAt: Date;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            // Need to cast because type generation failed locally but data is real
            setNotifications(data as unknown as Notification[]);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleMarkRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        await markAsRead(id);
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        await markAllAsRead();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'BONUS': return <Gift size={16} className="text-emerald-500" />;
            case 'OFFER': return <Info size={16} className="text-blue-500" />;
            case 'PAYOUT': return <Check size={16} className="text-yellow-500" />;
            default: return <AlertCircle size={16} className="text-zinc-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 active:scale-95 duration-200"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#050505] animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#09090B] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="font-semibold text-sm text-white">Powiadomienia</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[10px] text-emerald-500 hover:text-emerald-400 font-medium uppercase tracking-wider hover:underline"
                            >
                                Oznacz wszystkie
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {loading ? (
                            <div className="p-8 text-center text-zinc-500 text-xs animate-pulse">Ładowanie...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-col flex flex-col items-center justify-center text-zinc-500 gap-2">
                                <Bell size={24} className="opacity-20" />
                                <span className="text-xs">Brak nowych powiadomień</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id as string}
                                        className={cn(
                                            "p-4 hover:bg-white/[0.02] transition-colors relative group",
                                            !notification.isRead && "bg-emerald-500/[0.02]"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className={cn("text-xs font-semibold", !notification.isRead ? "text-white" : "text-zinc-400")}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-[10px] text-zinc-600 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: pl })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500 leading-snug break-words">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => handleMarkRead(notification.id as string, e)}
                                                    className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 p-1 hover:bg-white/10 rounded transition-all text-zinc-500 hover:text-white"
                                                    title="Oznacz jako przeczytane"
                                                >
                                                    <Check size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
