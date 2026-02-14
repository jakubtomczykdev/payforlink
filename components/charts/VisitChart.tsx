'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';

interface DataPoint {
    date: string;
    visits: number;
    raw: number;
}



export function VisitChart({ data }: { data: DataPoint[] }) {
    const hasData = data.some(d => d.visits > 0 || d.raw > 0);

    return (
        <BentoCard className="h-full flex flex-col overflow-hidden" title="Przegląd Ruchu">
            <div className="flex-1 w-full relative min-h-[300px] mt-4">
                {!hasData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in duration-500">
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 mb-4">
                            <BarChart3 className="w-12 h-12 text-zinc-700" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-zinc-200 font-medium text-lg mb-1">Brak ruchu</h3>
                        <p className="text-zinc-500 text-sm mb-6 text-center max-w-[280px]">
                            Twoje statystyki pojawią się tutaj, gdy Twoje linki zaczną generować kliknięcia.
                        </p>
                        <Link href="/dashboard/create">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/10">
                                <Plus size={18} />
                                Utwórz Pierwszy Link
                            </button>
                        </Link>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                                </linearGradient>
                                <linearGradient id="colorRaw" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
                            <XAxis
                                dataKey="date"
                                stroke="#52525B"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#52525B"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(12, 12, 12, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                                }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                            />
                            <Area
                                name="Ważne Wizyty"
                                type="monotone"
                                dataKey="visits"
                                stroke="#10B981"
                                strokeWidth={2}
                                fill="url(#colorVisits)"
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                            <Area
                                name="Wszystkie Kliknięcia"
                                type="monotone"
                                dataKey="raw"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                fill="url(#colorRaw)"
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </BentoCard>
    );
}
