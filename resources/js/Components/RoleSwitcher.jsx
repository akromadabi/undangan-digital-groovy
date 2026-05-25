import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function RoleSwitcher({ auth }) {
    if (!auth || !auth.user) return null;

    const originalRole = auth.impersonator ? auth.impersonator.role : auth.user.role;
    const currentRole = auth.user.role;

    // Only original Super Admin or Reseller can switch roles
    if (!['super_admin', 'admin'].includes(originalRole)) {
        return null;
    }

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roleLabels = {
        super_admin: 'Super Admin',
        admin: 'Reseller',
        user: 'User / Client'
    };

    const rolesList = originalRole === 'super_admin'
        ? ['super_admin', 'admin', 'user']
        : ['admin', 'user'];

    const handleRoleSwitch = (role) => {
        if (role === currentRole) return;
        setIsOpen(false);
        router.post(`/impersonate/switch-role/${role}`, {}, {
            onSuccess: () => {
                // Refresh page
            }
        });
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/25 cursor-pointer shadow-sm"
            >
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[11px] text-orange-600/80">Role:</span>
                <span>{roleLabels[currentRole] || currentRole}</span>
                <svg className={`w-3.5 h-3.5 text-orange-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#e8e5e0] py-1.5 z-[999] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-[#f0ede8] mb-1">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Pilih Mode Tes</div>
                    </div>
                    {rolesList.map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleSwitch(role)}
                            className={`flex items-center justify-between w-full px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                                role === currentRole
                                    ? 'bg-orange-50 text-orange-700 font-bold'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <span>{roleLabels[role]}</span>
                            {role === currentRole && (
                                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
