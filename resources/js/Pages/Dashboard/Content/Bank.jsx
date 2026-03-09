import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const emptyAccount = { bank_name: '', account_name: '', account_number: '' };

const popularBanks = [
    'BCA', 'BRI', 'BNI', 'Mandiri', 'BSI', 'CIMB Niaga', 'Danamon',
    'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja',
];

export default function Bank({ bankAccounts }) {
    const { flash } = usePage().props;

    const initial = bankAccounts?.length > 0 ? bankAccounts : [{ ...emptyAccount }];

    const { data, setData, post, processing } = useForm({ accounts: initial });

    const updateAccount = (index, field, value) => {
        const updated = [...data.accounts];
        updated[index] = { ...updated[index], [field]: value };
        setData('accounts', updated);
    };

    const addAccount = () => setData('accounts', [...data.accounts, { ...emptyAccount }]);

    const removeAccount = (index) => {
        if (data.accounts.length <= 1) return;
        setData('accounts', data.accounts.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.bank.save'));
    };

    return (
        <DashboardLayout title="Amplop Digital">
            <Head title="Amplop Digital" />
            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">🏦</span>
                    <div>
                        <div className="font-medium text-amber-800 text-sm">Amplop Digital / E-Wallet</div>
                        <div className="text-amber-600 text-xs mt-0.5">Tambahkan rekening bank atau e-wallet untuk menerima amplop digital dari tamu Anda.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {data.accounts.map((account, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    Rekening #{index + 1}
                                </h4>
                                {data.accounts.length > 1 && (
                                    <button type="button" onClick={() => removeAccount(index)}
                                        className="text-red-400 hover:text-red-600 text-sm">✕ Hapus</button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Bank Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Bank / E-Wallet *</label>
                                    <input type="text" value={account.bank_name} onChange={(e) => updateAccount(index, 'bank_name', e.target.value)}
                                        placeholder="Contoh: BCA, Mandiri, GoPay"
                                        list={`bank-list-${index}`}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" required />
                                    <datalist id={`bank-list-${index}`}>
                                        {popularBanks.map(b => <option key={b} value={b} />)}
                                    </datalist>
                                </div>

                                {/* Account Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Pemilik Rekening *</label>
                                    <input type="text" value={account.account_name} onChange={(e) => updateAccount(index, 'account_name', e.target.value)}
                                        placeholder="Nama sesuai rekening"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" required />
                                </div>

                                {/* Account Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nomor Rekening *</label>
                                    <input type="text" value={account.account_number} onChange={(e) => updateAccount(index, 'account_number', e.target.value)}
                                        placeholder="Nomor rekening / nomor HP e-wallet"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400" required />
                                </div>
                            </div>

                            {/* Preview Card */}
                            {account.bank_name && account.account_number && (
                                <div className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                                    <div className="text-xs font-medium opacity-80 mb-1">{account.bank_name}</div>
                                    <div className="text-lg font-bold tracking-wider">{account.account_number}</div>
                                    <div className="text-sm mt-1">{account.account_name}</div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addAccount}
                        className="w-full py-3 border-2 border-dashed border-amber-200 rounded-xl text-amber-400 hover:border-amber-400 hover:text-amber-500 transition-colors text-sm font-medium">
                        + Tambah Rekening
                    </button>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : '💾 Simpan Rekening'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
