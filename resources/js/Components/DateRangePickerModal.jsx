import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Clock, Check, X } from 'lucide-react';

const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

const MONTHS = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
];

const WEEKDAYS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

const isBetween = (date, start, end) => {
    if (!start || !end) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return d > s && d < e;
};

export default function DateRangePickerModal({
    isOpen,
    onClose,
    initialStartsAt,
    initialExpiresAt,
    onApply
}) {
    // Current viewed calendar month/year
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Selected range dates (local temporary state)
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);

    // Selected time strings (local temporary state)
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');

    // Load initial values when modal opens
    useEffect(() => {
        if (isOpen) {
            let start = null;
            let end = null;
            let sTime = '08:00';
            let eTime = '17:00';

            if (initialStartsAt) {
                const startDateObj = new Date(initialStartsAt);
                if (!isNaN(startDateObj.getTime())) {
                    start = startDateObj;
                    const hours = String(startDateObj.getHours()).padStart(2, '0');
                    const mins = String(startDateObj.getMinutes()).padStart(2, '0');
                    sTime = `${hours}:${mins}`;
                }
            }

            if (initialExpiresAt) {
                const endDateObj = new Date(initialExpiresAt);
                if (!isNaN(endDateObj.getTime())) {
                    end = endDateObj;
                    const hours = String(endDateObj.getHours()).padStart(2, '0');
                    const mins = String(endDateObj.getMinutes()).padStart(2, '0');
                    eTime = `${hours}:${mins}`;
                }
            }

            setTempStartDate(start);
            setTempEndDate(end);
            setStartTime(sTime);
            setEndTime(eTime);

            // Sync calendar month/year to start date if exists, otherwise current date
            const viewDate = start || new Date();
            setCurrentMonth(viewDate.getMonth());
            setCurrentYear(viewDate.getFullYear());
        }
    }, [isOpen, initialStartsAt, initialExpiresAt]);

    if (!isOpen) return null;

    // Helper: Days generator
    const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

    const generateCalendarDays = () => {
        const days = [];
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

        // Previous month days to fill prefix
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                isCurrentMonth: true
            });
        }

        // Next month days to fill suffix (up to 42 cells total)
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({
                date: new Date(nextYear, nextMonth, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const handleDateClick = (date) => {
        // Reset selection if both are already set or none is set
        if ((tempStartDate && tempEndDate) || (!tempStartDate && !tempEndDate)) {
            setTempStartDate(date);
            setTempEndDate(null);
        } else if (tempStartDate && !tempEndDate) {
            if (date.getTime() >= tempStartDate.getTime()) {
                setTempEndDate(date);
            } else {
                setTempStartDate(date);
            }
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleApply = () => {
        if (!tempStartDate) return;

        // Construct starts_at ISO string
        const startYear = tempStartDate.getFullYear();
        const startMonth = String(tempStartDate.getMonth() + 1).padStart(2, '0');
        const startDate = String(tempStartDate.getDate()).padStart(2, '0');
        const startsAtStr = `${startYear}-${startMonth}-${startDate}T${startTime}`;

        let expiresAtStr = '';
        if (tempEndDate) {
            const endYear = tempEndDate.getFullYear();
            const endMonth = String(tempEndDate.getMonth() + 1).padStart(2, '0');
            const endDate = String(tempEndDate.getDate()).padStart(2, '0');
            expiresAtStr = `${endYear}-${endMonth}-${endDate}T${endTime}`;
        }

        onApply(startsAtStr, expiresAtStr);
        onClose();
    };

    const calendarDays = generateCalendarDays();
    const isRangeSelected = tempStartDate && tempEndDate;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 flex flex-col p-5 overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    {isRangeSelected ? (
                        <span className="text-[11px] font-bold text-[#E5654B] flex items-center gap-1.5 bg-[#fdf0ed] px-3 py-1.5 rounded-full">
                            <span className="flex items-center justify-center w-3.5 h-3.5 bg-[#E5654B] text-white rounded-full text-[9px] font-bold">✓</span>
                            Range terpilih — klik ulang untuk ubah
                        </span>
                    ) : (
                        <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Pilih rentang tanggal kegiatan
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Calendar Navigation */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1.5 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="font-extrabold text-sm text-gray-800 tracking-wide uppercase">
                        {MONTHS[currentMonth]} {currentYear}
                    </span>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Weekdays Grid */}
                <div className="grid grid-cols-7 gap-0 text-center mb-1">
                    {WEEKDAYS.map(day => (
                        <span key={day} className="text-[10px] font-bold text-gray-400 py-1">
                            {day}
                        </span>
                    ))}
                </div>

                {/* Days Grid with Continuous Highlight */}
                <div className="grid grid-cols-7 gap-y-1 text-center mb-5">
                    {calendarDays.map((cell, idx) => {
                        const isStart = isSameDay(cell.date, tempStartDate);
                        const isEnd = isSameDay(cell.date, tempEndDate);
                        const isInRange = isBetween(cell.date, tempStartDate, tempEndDate);

                        // Continuous range background styling
                        let wrapperClass = "relative py-1 flex items-center justify-center ";
                        if (isInRange) {
                            wrapperClass += "bg-[#fdf0ed] ";
                        } else if (isStart && tempEndDate) {
                            wrapperClass += "bg-[#fdf0ed] rounded-l-full ";
                        } else if (isEnd) {
                            wrapperClass += "bg-[#fdf0ed] rounded-r-full ";
                        }

                        let buttonClass = "w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full transition-all ";
                        
                        if (isStart || isEnd) {
                            buttonClass += "bg-[#E5654B] text-white shadow-md shadow-[#E5654B]/20 ";
                        } else if (isInRange) {
                            buttonClass += "text-[#E5654B] hover:bg-[#fbdad2] ";
                        } else if (!cell.isCurrentMonth) {
                            buttonClass += "text-gray-300 hover:bg-gray-50 ";
                        } else {
                            buttonClass += "text-gray-700 hover:bg-gray-100 ";
                        }

                        return (
                            <div key={idx} className={wrapperClass}>
                                <button
                                    type="button"
                                    onClick={() => handleDateClick(cell.date)}
                                    className={buttonClass}
                                >
                                    {cell.date.getDate()}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Time Picker Inputs */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mb-4">
                    <div>
                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Jam Mulai</label>
                        <div className="relative">
                            <input
                                type="time"
                                required
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-[#E5654B] pr-8"
                            />
                            <Clock size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Jam Berakhir</label>
                        <div className="relative">
                            <input
                                type="time"
                                required
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-[#E5654B] pr-8"
                            />
                            <Clock size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleApply}
                    disabled={!tempStartDate}
                    className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        tempStartDate
                            ? 'bg-[#E5654B] hover:bg-[#d0533b] text-white shadow-lg shadow-[#E5654B]/20 cursor-pointer'
                            : 'bg-[#f3b2a5] text-white cursor-not-allowed'
                    }`}
                >
                    <Check size={14} />
                    <span>TERAPKAN</span>
                </button>
            </div>
        </div>,
        document.body
    );
}
