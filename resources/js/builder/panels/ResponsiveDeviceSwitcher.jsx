import React from 'react';
import { useBuilderStore } from '../state/builderStore';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export default function ResponsiveDeviceSwitcher() {
    const activeBreakpoint = useBuilderStore((state) => state.activeBreakpoint);
    const setActiveBreakpoint = useBuilderStore((state) => state.setActiveBreakpoint);

    const devices = [
        { key: 'desktop', Icon: Monitor, label: 'Desktop (100%)' },
        { key: 'tablet', Icon: Tablet, label: 'Tablet (768px)' },
        { key: 'mobile', Icon: Smartphone, label: 'Mobile (375px)' }
    ];

    return (
        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            {devices.map((device) => {
                const active = activeBreakpoint === device.key;
                return (
                    <button
                        key={device.key}
                        type="button"
                        onClick={() => setActiveBreakpoint(device.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                            active 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                        title={device.label}
                    >
                        <device.Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline capitalize">{device.key}</span>
                    </button>
                );
            })}
        </div>
    );
}
