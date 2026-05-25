import { Head, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function ThemesCatalog({ themes }) {
    return (
        <DynamicAdminLayout title="Katalog Tema dari Pusat">
            <Head title="Katalog Tema" />
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-4 sm:p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700">Daftar Tema Global</h3>
                    <p className="text-xs text-gray-400 mt-1">Berikut adalah pilihan desain undangan digital premium dari admin pusat yang dapat dinikmati oleh user client Anda.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes?.map(theme => (
                        <div key={theme.id} className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-[9/16] bg-[#f8f7f4] relative">
                                {theme.thumbnail ? (
                                    <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-[#ddd]">
                                        <svg className="w-10 h-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {theme.is_premium && (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">PREMIUM</div>
                                )}
                            </div>
                            <div className="p-3 flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-[#333] text-sm">{theme.name}</h4>
                                    <span className="text-[10px] text-gray-400 capitalize">{theme.category || 'Undangan'}</span>
                                </div>
                                <a 
                                    href={`/demo/${theme.slug}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs font-bold transition-all"
                                >
                                    Demo
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
