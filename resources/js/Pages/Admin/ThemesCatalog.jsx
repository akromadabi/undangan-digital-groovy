import { Head, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

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
                        <ThemePreviewCard key={theme.id} theme={theme} reseller={null} isDemoLink={true} />
                    ))}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
