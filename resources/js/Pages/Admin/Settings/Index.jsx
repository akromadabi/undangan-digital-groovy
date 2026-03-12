import { Head, useForm, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function Index({ settings }) {
    const { flash, adminRoutePrefix } = usePage().props;

    const allSettings = [];
    if (settings) {
        Object.entries(settings).forEach(([category, items]) => {
            items.forEach(item => allSettings.push({ ...item, category }));
        });
    }

    const { data, setData, post, processing } = useForm({
        settings: allSettings.map(s => ({ key: s.setting_key, value: s.setting_value })),
    });

    const updateValue = (index, value) => {
        const updated = [...data.settings];
        updated[index] = { ...updated[index], value };
        setData('settings', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`${adminRoutePrefix}/settings`);
    };

    const categories = settings ? Object.keys(settings) : [];

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors';

    return (
        <DynamicAdminLayout title="Global Settings">
            <Head title="Admin - Settings" />
            <div className="max-w-2xl space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {categories.map(category => (
                        <div key={category} className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                            <h3 className="font-bold text-[#1a1a1a] text-lg mb-5 capitalize">{category}</h3>
                            <div className="space-y-4">
                                {settings[category].map((setting, si) => {
                                    const globalIndex = allSettings.findIndex(s => s.setting_key === setting.setting_key);
                                    return (
                                        <div key={setting.setting_key}>
                                            <label className="text-xs font-semibold text-[#E5654B] block mb-1.5 tracking-wide">
                                                {setting.setting_key.replace(/_/g, ' ')}
                                                {setting.description && <span className="ml-2 text-[#bbb] font-normal">({setting.description})</span>}
                                            </label>
                                            {setting.data_type === 'text' || setting.data_type === 'json' ? (
                                                <textarea value={data.settings[globalIndex]?.value || ''}
                                                    onChange={(e) => updateValue(globalIndex, e.target.value)}
                                                    className={`${inputClass} font-mono resize-none`} rows={2} />
                                            ) : setting.data_type === 'boolean' ? (
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative inline-flex items-center">
                                                        <input type="checkbox" checked={data.settings[globalIndex]?.value === 'true' || data.settings[globalIndex]?.value === true}
                                                            onChange={(e) => updateValue(globalIndex, e.target.checked ? 'true' : 'false')}
                                                            className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-[#e8e5e0] rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                                                    </div>
                                                    <span className="text-sm text-[#555] font-medium">{data.settings[globalIndex]?.value === 'true' ? 'Aktif' : 'Nonaktif'}</span>
                                                </label>
                                            ) : (
                                                <input type="text" value={data.settings[globalIndex]?.value || ''}
                                                    onChange={(e) => updateValue(globalIndex, e.target.value)}
                                                    className={inputClass} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-[#E5654B] text-white rounded-xl font-semibold hover:bg-[#c94f3a] disabled:opacity-50 transition-colors shadow-sm text-sm">
                        {processing ? 'Menyimpan...' : 'Simpan Settings'}
                    </button>
                </form>
            </div>
        </DynamicAdminLayout>
    );
}
