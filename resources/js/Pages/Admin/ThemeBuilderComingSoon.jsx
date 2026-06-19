import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { Construction, ArrowLeft, Paintbrush } from 'lucide-react';

export default function ThemeBuilderComingSoon() {
    return (
        <DynamicAdminLayout title="Theme Builder">
            <Head title="Theme Builder - Dalam Pengembangan" />
            
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="relative max-w-lg w-full bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-100 shadow-xl overflow-hidden text-center transition-all duration-300 hover:shadow-2xl">
                    {/* Top Accent Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600" />
                    
                    {/* Decorative Background Glows */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-200/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-200/40 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 space-y-6">
                        {/* Beautiful Icon Wrapper */}
                        <div className="inline-flex items-center justify-center p-4 bg-orange-50 rounded-full text-orange-500 animate-bounce">
                            <Paintbrush className="w-12 h-12" strokeWidth={1.5} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Theme Builder (Elementor-Style)
                            </h2>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-700">
                                <Construction className="w-3.5 h-3.5" />
                                Sedang Dalam Pengembangan
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                            Fitur Theme Builder mandiri sedang dirancang dan disempurnakan oleh tim developer. 
                            Anda akan segera dapat membuat dan mengedit template undangan pernikahan dengan alur kerja drag-and-drop yang canggih.
                        </p>
                        
                        {/* Premium Info Panel */}
                        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-left text-xs text-gray-600 space-y-2">
                            <div className="font-bold text-gray-800">Fitur Utama Yang Akan Hadir:</div>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Canvas Drag-and-Drop responsif (Desktop/Tablet/Mobile)</li>
                                <li>Navigator Tree (Section &gt; Kolom &gt; Widget)</li>
                                <li>Panel Editor tab Konten, Gaya, &amp; Lanjutan</li>
                                <li>Export &amp; Import template JSON instan</li>
                            </ul>
                        </div>
                        
                        {/* Action button */}
                        <div>
                            <Link
                                href="/admin/themes"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Katalog Tema
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
