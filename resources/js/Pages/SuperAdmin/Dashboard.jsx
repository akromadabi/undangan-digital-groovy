import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// SVG Icon Helper Component
const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.5 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

// MiniBar Component
const MiniBar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
    );
};

// RingChart Component
const RingChart = ({ value, max, color, size = 56 }) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} stroke="#f3f4f6" strokeWidth={5} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={5} fill="none"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
    );
};

// Animated Count Hook/Component
const AnimatedCounter = ({ value, duration = 1200, formatter }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value, 10) || 0;
        if (start === end) {
            setCount(end);
            return;
        }

        const totalMiliseconds = duration;
        const startTime = performance.now();
        let animationFrameId;

        const updateCount = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / totalMiliseconds, 1);
            // Easing curve (easeOutQuad)
            const easedProgress = progress * (2 - progress);
            const current = Math.floor(easedProgress * end);
            setCount(current);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(updateCount);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrameId);
    }, [value, duration]);

    return <span>{formatter ? formatter(count) : count.toLocaleString('id-ID')}</span>;
};

// Interactive Canvas Particle Network Background
const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const handleResize = () => {
            if (canvas) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        // Mouse interactions
        const mouse = { x: null, y: null, radius: 110 };
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        canvas.parentElement.addEventListener('mousemove', handleMouseMove);
        canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);

        // Particle definitions
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 2 + 1;
                this.baseAlpha = Math.random() * 0.2 + 0.15;
                this.alpha = this.baseAlpha;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce boundaries
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse interaction repulsion/glow
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= dx * force * 0.025;
                        this.y -= dy * force * 0.025;
                        this.alpha = Math.min(this.baseAlpha + force * 0.45, 0.7);
                    } else if (this.alpha > this.baseAlpha) {
                        this.alpha -= 0.01;
                    }
                } else if (this.alpha > this.baseAlpha) {
                    this.alpha -= 0.01;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(Math.floor((width * height) / 9000), 55);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw link connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 90) {
                        const alpha = (1 - dist / 90) * 0.14 * Math.min(particles[i].alpha, particles[j].alpha);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (canvas && canvas.parentElement) {
                canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
                canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-85 z-0" />;
};

// Simulated Live Platform Health Node Widget
const PlatformHealth = () => {
    const [cpu, setCpu] = useState(28);
    const [ram, setRam] = useState(61);
    const [ping, setPing] = useState(14);
    const [requests, setRequests] = useState(48);

    const canvasRef = useRef(null);

    // Oscillation loop for stats
    useEffect(() => {
        const timer = setInterval(() => {
            setCpu((prev) => Math.max(12, Math.min(90, prev + Math.floor(Math.random() * 5) - 2)));
            setRam((prev) => Math.max(55, Math.min(78, prev + (Math.random() > 0.5 ? 0.1 : -0.1))));
            setPing((prev) => Math.max(8, Math.min(24, prev + Math.floor(Math.random() * 3) - 1)));
            setRequests((prev) => Math.max(25, Math.min(95, prev + Math.floor(Math.random() * 7) - 3)));
        }, 2500);

        return () => clearInterval(timer);
    }, []);

    // Live wave graphics loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let animationFrameId;
        let t = 0;

        const points = Array(50).fill(height / 2);

        const handleResize = () => {
            if (canvas) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        const renderWave = () => {
            ctx.clearRect(0, 0, width, height);
            t += 0.08;

            const base = height / 2;
            const mainOscillation = Math.sin(t) * 11;
            const noise = (Math.random() - 0.5) * 4;
            const newPoint = base + mainOscillation + noise;

            points.push(newPoint);
            points.shift();

            // Draw Grid Lines in Canvas
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.07)';
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 25) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
            }
            for (let j = 0; j < height; j += 15) {
                ctx.moveTo(0, j);
                ctx.lineTo(width, j);
            }
            ctx.stroke();

            // Draw Wave line
            ctx.beginPath();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            const step = width / (points.length - 1);
            for (let i = 0; i < points.length; i++) {
                const x = i * step;
                const y = points[i];
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Gradient filling under wave
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            animationFrameId = requestAnimationFrame(renderWave);
        };

        renderWave();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
            <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-xs font-semibold text-[#999] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        Status Platform & Health Node
                    </h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold border border-emerald-100">
                        Operational
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                    <div className="bg-slate-50/70 backdrop-blur-sm p-3 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-semibold text-[#a3a3a3] uppercase">CPU Load</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-lg font-bold text-slate-800">{cpu}%</span>
                            <span className="text-[10px] text-emerald-500 font-medium">Optimal</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${cpu}%` }} />
                        </div>
                    </div>
                    <div className="bg-slate-50/70 backdrop-blur-sm p-3 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-semibold text-[#a3a3a3] uppercase">RAM Usage</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-lg font-bold text-slate-800">{ram.toFixed(1)}%</span>
                            <span className="text-[10px] text-[#999]">of 16 GB</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-[#E5654B] rounded-full transition-all duration-500" style={{ width: `${ram}%` }} />
                        </div>
                    </div>
                    <div className="bg-slate-50/70 backdrop-blur-sm p-3 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-semibold text-[#a3a3a3] uppercase">Database Response</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-lg font-bold text-slate-800">{ping}ms</span>
                            <span className="text-[10px] text-emerald-500 font-medium">Excellent</span>
                        </div>
                    </div>
                    <div className="bg-slate-50/70 backdrop-blur-sm p-3 rounded-xl border border-slate-100/60">
                        <p className="text-[10px] font-semibold text-[#a3a3a3] uppercase">Active Latency</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-lg font-bold text-slate-800">{(ping * 3 + 12)}ms</span>
                            <span className="text-[10px] text-emerald-500 font-medium">Global API</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto relative z-10 border-t border-slate-100 pt-3">
                <p className="text-[10px] font-semibold text-[#999] uppercase mb-1.5">Throughput Live Pulse (RPS)</p>
                <div className="bg-slate-950 rounded-lg p-1.5 overflow-hidden border border-slate-800/80">
                    <canvas ref={canvasRef} className="w-full h-10 block" />
                </div>
                <div className="flex justify-between items-center text-[9px] text-[#999] mt-2 px-1">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-scale" />
                        node-jkt-01
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-scale" />
                        node-sgp-02
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-scale" />
                        node-tky-01
                    </span>
                </div>
            </div>
        </div>
    );
};

// Custom Interactive SVG Area Chart (Revenue Trends)
const InteractiveAreaChart = ({ data, totalRevenue }) => {
    const svgRef = useRef(null);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, show: false });

    const width = 500;
    const height = 180;
    const padding = { top: 25, right: 30, bottom: 30, left: 55 };

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
        const y = height - padding.bottom - (d.value / maxVal) * (height - padding.top - padding.bottom);
        return { x, y, label: d.label, value: d.value };
    });

    const linePath = points.reduce((acc, p, i) => {
        return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    }, '');

    const fillPath = linePath + ` L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    const handleMouseMove = (e) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const svgMouseX = (clientX / rect.width) * width;

        // Find closest point by x coordinate
        let closestIndex = 0;
        let minDiff = Infinity;
        points.forEach((p, index) => {
            const diff = Math.abs(p.x - svgMouseX);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        setHoveredIndex(closestIndex);
        setHoveredPoint(points[closestIndex]);
        setTooltipPos({ x: clientX, y: clientY - 45, show: true });
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
        setHoveredIndex(null);
        setTooltipPos(prev => ({ ...prev, show: false }));
    };

    const formatShortIDR = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium flex flex-col justify-between h-full relative">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xs font-semibold text-[#999] uppercase tracking-wider">Tren Pendapatan</h3>
                        <p className="text-xs text-[#b5b5b5] mt-0.5">Minggu ini vs minggu lalu</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+14.2%</span>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-[180px] my-auto cursor-crosshair">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <defs>
                        {/* Area Gradient */}
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E5654B" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#E5654B" stopOpacity="0.00" />
                        </linearGradient>
                        {/* Grid Line Dash */}
                        <pattern id="gridPattern" width="40" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f1eeea" strokeWidth="1" />
                        </pattern>
                    </defs>

                    {/* Chart Grid Lines */}
                    <g stroke="#f3f0ec" strokeWidth="1">
                        <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} />
                        <line x1={padding.left} y1={(padding.top + height - padding.bottom) / 2} x2={width - padding.right} y2={(padding.top + height - padding.bottom) / 2} />
                        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
                    </g>

                    {/* Left Y-Axis Labels */}
                    <g fill="#999" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                        <text x={padding.left - 8} y={padding.top + 3}>{formatShortIDR(maxVal).replace('Rp', 'Rp ')}</text>
                        <text x={padding.left - 8} y={(padding.top + height - padding.bottom) / 2 + 3}>{formatShortIDR(maxVal / 2).replace('Rp', 'Rp ')}</text>
                        <text x={padding.left - 8} y={height - padding.bottom + 3}>Rp 0</text>
                    </g>

                    {/* Bottom X-Axis Labels */}
                    <g fill="#999" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
                        {points.map((p, i) => (
                            <text key={i} x={p.x} y={height - 10}>{p.label}</text>
                        ))}
                    </g>

                    {/* Line Area Fill with Animation */}
                    <path
                        d={fillPath}
                        fill="url(#areaGrad)"
                        className="transition-all duration-700 ease-out"
                    />

                    {/* Main Stroke Line with Animation */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#E5654B"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-700 ease-out"
                    />

                    {/* Static circular indicators on line */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={i === hoveredIndex ? 6 : 3.5}
                            fill={i === hoveredIndex ? '#E5654B' : '#ffffff'}
                            stroke="#E5654B"
                            strokeWidth={i === hoveredIndex ? 2 : 1.5}
                            className="transition-all duration-200"
                        />
                    ))}

                    {/* Interactive Guideline and Hover Dot */}
                    {hoveredPoint && (
                        <g>
                            <line
                                x1={hoveredPoint.x}
                                y1={padding.top}
                                x2={hoveredPoint.x}
                                y2={height - padding.bottom}
                                stroke="#E5654B"
                                strokeWidth="1"
                                strokeDasharray="3,3"
                            />
                            <circle
                                cx={hoveredPoint.x}
                                cy={hoveredPoint.y}
                                r={10}
                                fill="#E5654B"
                                opacity="0.22"
                                className="animate-ping"
                            />
                        </g>
                    )}
                </svg>

                {/* Floating Tooltip absolute layered */}
                {tooltipPos.show && hoveredPoint && (
                    <div
                        className="absolute bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none transition-all duration-75 border border-slate-700 z-30"
                        style={{
                            left: `${Math.max(10, Math.min(width - 120, tooltipPos.x - 60))}px`,
                            top: `${Math.max(5, tooltipPos.y)}px`
                        }}
                    >
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{hoveredPoint.label} · Hari Ini</div>
                        <div className="text-emerald-400 mt-0.5">{formatShortIDR(hoveredPoint.value)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Custom Interactive SVG Bar Chart (User Growth)
const InteractiveBarChart = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, show: false });

    const width = 500;
    const height = 180;
    const padding = { top: 25, right: 20, bottom: 30, left: 45 };
    const barWidth = 26;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
        const yHeight = (d.value / maxVal) * (height - padding.top - padding.bottom);
        const y = height - padding.bottom - yHeight;
        return { x: x - barWidth / 2, y, yHeight, label: d.label, value: d.value };
    });

    const handleMouseMove = (e, index) => {
        const rect = e.currentTarget.parentElement.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        setHoveredIndex(index);
        setTooltipPos({ x: clientX, y: clientY - 45, show: true });
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setTooltipPos(prev => ({ ...prev, show: false }));
    };

    return (
        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium flex flex-col justify-between h-full relative">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xs font-semibold text-[#999] uppercase tracking-wider">Registrasi User</h3>
                        <p className="text-xs text-[#b5b5b5] mt-0.5">Penambahan anggota baru harian</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+8.9%</span>
                </div>
            </div>

            <div className="relative w-full h-[180px] my-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                >
                    <defs>
                        {/* Gradients */}
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.45" />
                        </linearGradient>
                        <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>

                    {/* Chart Grid Lines */}
                    <g stroke="#f3f0ec" strokeWidth="1">
                        <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} />
                        <line x1={padding.left} y1={(padding.top + height - padding.bottom) / 2} x2={width - padding.right} y2={(padding.top + height - padding.bottom) / 2} />
                        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
                    </g>

                    {/* Y-Axis Labels */}
                    <g fill="#999" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                        <text x={padding.left - 8} y={padding.top + 3}>{maxVal}</text>
                        <text x={padding.left - 8} y={(padding.top + height - padding.bottom) / 2 + 3}>{Math.round(maxVal / 2)}</text>
                        <text x={padding.left - 8} y={height - padding.bottom + 3}>0</text>
                    </g>

                    {/* X-Axis Labels */}
                    <g fill="#999" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
                        {points.map((p, i) => (
                            <text key={i} x={p.x + barWidth / 2} y={height - 10}>{p.label}</text>
                        ))}
                    </g>

                    {/* Render Bars */}
                    {points.map((p, i) => (
                        <rect
                            key={i}
                            x={p.x}
                            y={p.y}
                            width={barWidth}
                            height={Math.max(p.yHeight, 2)} // minimum height of 2px
                            rx={4}
                            fill={hoveredIndex === i ? 'url(#barGradActive)' : 'url(#barGrad)'}
                            className="transition-all duration-200 cursor-pointer"
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={handleMouseLeave}
                        />
                    ))}
                </svg>

                {/* Floating Tooltip */}
                {tooltipPos.show && hoveredIndex !== null && (
                    <div
                        className="absolute bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none transition-all duration-75 border border-slate-700 z-30"
                        style={{
                            left: `${Math.max(10, Math.min(width - 120, tooltipPos.x - 55))}px`,
                            top: `${Math.max(5, tooltipPos.y)}px`
                        }}
                    >
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{data[hoveredIndex].label} · Registrasi</div>
                        <div className="text-blue-400 mt-0.5">{data[hoveredIndex].value} Users Baru</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Dashboard({ stats, recentResellers, recentPayments }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const totalResellers = stats?.total_resellers || 0;
    const totalUsers = stats?.total_users || 0;
    const activeInvitations = stats?.active_invitations || 0;
    const totalRevenue = stats?.total_revenue || 0;
    const pendingPayments = stats?.pending_payments || 0;
    const paidPayments = (recentPayments || []).filter(p => p.status === 'paid').length;
    const totalPayments = (recentPayments || []).length;

    // Generated datasets based on stats variables
    const revenueFactors = [0.08, 0.12, 0.10, 0.18, 0.15, 0.22, 0.15];
    const revenueTrendData = revenueFactors.map((factor, idx) => {
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        return {
            label: days[idx],
            value: Math.round(totalRevenue * factor * (idx === 6 ? 1 : 0.85)) // ensure smooth relative scaling
        };
    });

    const userFactors = [0.07, 0.13, 0.11, 0.19, 0.16, 0.21, 0.13];
    const userTrendData = userFactors.map((factor, idx) => {
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        return {
            label: days[idx],
            value: Math.round((totalUsers || 20) * factor * 2)
        };
    });

    return (
        <SuperAdminLayout title="Dashboard Super Admin">
            <Head title="Super Admin Dashboard" />
            
            <div className="space-y-6 page-enter">

                {/* ═══ Premium Animated Welcome Banner ═══ */}
                <div className="bg-gradient-to-br from-[#E5654B] via-[#d55a42] to-[#b9442f] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-white/10 group animate-glow-pulse">
                    {/* Animated Particle Canvas overlay */}
                    <ParticleCanvas />
                    
                    {/* Glowing decorative gradient blobs */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-xl group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />
                    <div className="absolute -bottom-8 -right-16 w-56 h-56 rounded-full bg-white/5 blur-xl group-hover:-translate-x-6 transition-transform duration-1000 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md animate-float">
                                <Icon d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-extrabold tracking-wide drop-shadow-sm">Dashboard Super Admin</h2>
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                    </span>
                                </div>
                                <p className="text-white/80 text-sm mt-0.5 font-medium">Sistem Monitoring Platform Undangan Digital & Reseller</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2.5 mt-2 md:mt-0">
                            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-2 border border-white/10 transition-colors cursor-default">
                                <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21" className="w-4 h-4 opacity-75" />
                                <AnimatedCounter value={totalResellers} /> Reseller
                            </div>
                            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-2 border border-white/10 transition-colors cursor-default">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493" className="w-4 h-4 opacity-75" />
                                <AnimatedCounter value={totalUsers} /> Users
                            </div>
                            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-2 border border-white/10 transition-colors cursor-default">
                                <Icon d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25" className="w-4 h-4 opacity-75" />
                                <AnimatedCounter value={activeInvitations} /> Undangan
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Stats Grid (Animated Counters + tilt hover effects) ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 stagger-children">
                    {/* Total Reseller */}
                    <Link href="/super-admin/resellers" className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover-card-premium glow-card-violet group relative overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] sm:text-xs font-bold text-[#999] uppercase tracking-wider">Total Reseller</p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] mt-1.5 sm:mt-2 tracking-tight">
                                    <AnimatedCounter value={totalResellers} />
                                </p>
                                <p className="text-[10px] sm:text-xs text-[#a1a1a1] mt-1 sm:mt-1.5 font-medium">Mitra reseller aktif</p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197" className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <MiniBar value={totalResellers} max={Math.max(totalResellers, 6)} color="#8b5cf6" />
                        </div>
                    </Link>

                    {/* Total Users */}
                    <Link href="/super-admin/users" className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover-card-premium glow-card-blue group relative overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] sm:text-xs font-bold text-[#999] uppercase tracking-wider">Total Users</p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] mt-1.5 sm:mt-2 tracking-tight">
                                    <AnimatedCounter value={totalUsers} />
                                </p>
                                <p className="text-[10px] sm:text-xs text-[#a1a1a1] mt-1 sm:mt-1.5 font-medium">Pelanggan terdaftar</p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07" className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <MiniBar value={totalUsers} max={Math.max(totalUsers, 15)} color="#3b82f6" />
                        </div>
                    </Link>

                    {/* Revenue */}
                    <Link href="/super-admin/transactions" className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover-card-premium glow-card-orange group relative overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] sm:text-xs font-bold text-[#999] uppercase tracking-wider">Total Pendapatan</p>
                                <p className="text-xl sm:text-2xl font-extrabold text-[#1a1a1a] mt-2 sm:mt-2.5 tracking-tight">
                                    <AnimatedCounter value={totalRevenue} formatter={formatCurrency} />
                                </p>
                                <p className="text-[10px] sm:text-xs text-[#a1a1a1] mt-1 sm:mt-1.5 font-medium">Gross revenue platform</p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-110 group-hover:bounce transition-transform">
                                <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25" className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <MiniBar value={totalRevenue} max={Math.max(totalRevenue, 1000000)} color="#f97316" />
                        </div>
                    </Link>

                    {/* Pending Payment */}
                    <Link href="/super-admin/transactions?status=waiting_review" className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover-card-premium glow-card-emerald group relative overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] sm:text-xs font-bold text-[#999] uppercase tracking-wider">Pending Payment</p>
                                <p className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] mt-1.5 sm:mt-2 tracking-tight">
                                    <AnimatedCounter value={pendingPayments} />
                                </p>
                                <p className="text-[10px] sm:text-xs mt-1 sm:mt-1.5">
                                    {pendingPayments > 0 ? (
                                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                            butuh verifikasi
                                        </span>
                                    ) : (
                                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            semua beres
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${pendingPayments > 0 ? 'from-amber-500 to-amber-600 shadow-md shadow-amber-500/10' : 'from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/10'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <Icon d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <MiniBar value={pendingPayments} max={Math.max(pendingPayments + paidPayments, 1)} color={pendingPayments > 0 ? '#f59e0b' : '#10b981'} />
                        </div>
                    </Link>
                </div>

                {/* ═══ Charts & System Health Row ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Weekly Revenue Interactive Area Chart */}
                    <div className="lg:col-span-1">
                        <InteractiveAreaChart data={revenueTrendData} totalRevenue={totalRevenue} />
                    </div>
                    {/* Daily Registrations Interactive Bar Chart */}
                    <div className="lg:col-span-1">
                        <InteractiveBarChart data={userTrendData} />
                    </div>
                    {/* Simulated Live System Latency Node Widget */}
                    <div className="lg:col-span-1">
                        <PlatformHealth />
                    </div>
                </div>

                {/* ═══ Overview Infographic Row ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Conversion Rate */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium flex items-center gap-4.5">
                        <div className="relative flex-shrink-0">
                            <RingChart value={activeInvitations} max={Math.max(totalUsers, 1)} color="#10b981" size={60} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#1a1a1a]">{totalUsers > 0 ? Math.round((activeInvitations / totalUsers) * 100) : 0}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#999] uppercase tracking-wider">Rasio Konversi</p>
                            <p className="text-sm font-extrabold text-slate-800 mt-1">{activeInvitations} dari {totalUsers}</p>
                            <p className="text-xs text-[#999] mt-0.5">user membuat undangan aktif</p>
                        </div>
                    </div>

                    {/* Payment Success Rate */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium flex items-center gap-4.5">
                        <div className="relative flex-shrink-0">
                            <RingChart value={paidPayments} max={Math.max(totalPayments, 1)} color="#E5654B" size={60} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#1a1a1a]">{totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#999] uppercase tracking-wider">Pembayaran Sukses</p>
                            <p className="text-sm font-extrabold text-slate-800 mt-1">{paidPayments} dari {totalPayments}</p>
                            <p className="text-xs text-[#999] mt-0.5">transaksi berhasil diproses</p>
                        </div>
                    </div>

                    {/* Avg Revenue per User */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium flex items-center gap-4.5">
                        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-[#E5654B]/10 to-orange-50/50 flex items-center justify-center flex-shrink-0 border border-[#E5654B]/10">
                            <Icon d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25" className="w-6.5 h-6.5 text-[#E5654B] animate-float-fast" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#999] uppercase tracking-wider">Avg Pendapatan / User</p>
                            <p className="text-sm font-extrabold text-slate-800 mt-1">{formatCurrency(activeInvitations > 0 ? Math.round(totalRevenue / activeInvitations) : 0)}</p>
                            <p className="text-xs text-[#999] mt-0.5">rata-rata per undangan aktif</p>
                        </div>
                    </div>
                </div>

                {/* ═══ Two Columns: Recent Resellers + Recent Payments ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Resellers */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden hover-card-premium">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031" className="w-4 h-4 text-violet-600" />
                                </div>
                                <h3 className="font-extrabold text-slate-800 text-sm">Reseller Terbaru</h3>
                            </div>
                            <Link href="/super-admin/resellers" className="text-xs font-semibold text-[#E5654B] hover:text-[#c94f3a] transition-colors inline-flex items-center gap-1">
                                Lihat Semua
                                <Icon d="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-[#f5f3f0]">
                            {(recentResellers || []).map((r, i) => (
                                <Link key={r.id} href={`/super-admin/resellers/${r.id}`} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-all duration-200 block group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover/item:scale-105"
                                            style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-[#333] group-hover/item:text-[#E5654B] transition-colors">{r.name}</div>
                                            <div className="text-xs text-[#999]">{r.email}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-semibold border border-slate-200/50">
                                        {r.reseller_users_count || 0} users
                                    </span>
                                </Link>
                            ))}
                            {(!recentResellers || recentResellers.length === 0) && (
                                <div className="px-6 py-8 text-center">
                                    <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198" className="w-8 h-8 text-[#ddd] mx-auto mb-2 animate-float" />
                                    <p className="text-[#999] text-sm font-medium">Belum ada reseller</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden hover-card-premium">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6" className="w-4 h-4 text-orange-600" />
                                </div>
                                <h3 className="font-extrabold text-slate-800 text-sm">Payment Terbaru</h3>
                            </div>
                            {pendingPayments > 0 && (
                                <span className="bg-amber-50 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-100 animate-pulse">
                                    {pendingPayments} pending
                                </span>
                            )}
                        </div>
                        <div className="divide-y divide-[#f5f3f0]">
                            {(recentPayments || []).map(p => (
                                <div key={p.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-all duration-200 group/item">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover/item:scale-105 ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            <Icon d={p.status === 'paid' ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0'} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-[#333]">{p.user?.name || '-'}</div>
                                            <div className="text-xs text-[#999] font-medium">{p.plan?.name || '-'} · {formatCurrency(p.amount)}</div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold tracking-wide uppercase border ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                            {(!recentPayments || recentPayments.length === 0) && (
                                <div className="px-6 py-8 text-center">
                                    <Icon d="M2.25 8.25h19.5" className="w-8 h-8 text-[#ddd] mx-auto mb-2 animate-float" />
                                    <p className="text-[#999] text-sm font-medium">Belum ada pembayaran</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ Upgraded Animated Quick Actions ═══ */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover-card-premium relative overflow-hidden">
                    <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
                    <h3 className="text-xs font-bold text-[#999] uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                        <Icon d="M3.75 13.5l10.5-11.25L12 10.5h8.25" className="w-4 h-4 text-[#E5654B] animate-float" />
                        Pusat Aksi Cepat Super Admin
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 relative z-10">
                        {[
                            { label: 'Tambah Reseller', href: '/super-admin/resellers/create', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198', color: 'violet' },
                            { label: 'Kelola Paket', href: '/super-admin/plans', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25', color: 'blue' },
                            { label: 'Kelola Tema', href: '/super-admin/themes', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245', color: 'emerald' },
                            { label: 'Pengaturan System', href: '/super-admin/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593', color: 'orange' },
                        ].map(action => {
                            const colorMap = {
                                violet: 'bg-violet-50/80 text-violet-700 hover:bg-violet-100 hover:shadow-violet-100/50 border-violet-100/40',
                                blue: 'bg-blue-50/80 text-blue-700 hover:bg-blue-100 hover:shadow-blue-100/50 border-blue-100/40',
                                emerald: 'bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 hover:shadow-emerald-100/50 border-emerald-100/40',
                                orange: 'bg-orange-50/80 text-orange-700 hover:bg-orange-100 hover:shadow-orange-100/50 border-orange-100/40'
                            };
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border ${colorMap[action.color]} transition-all duration-300 hover:-translate-y-1 hover:shadow-md group/btn`}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100 transition-transform group-hover/btn:scale-110">
                                        <Icon d={action.icon} className="w-4.5 h-4.5 transition-transform group-hover/btn:rotate-6" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs font-bold tracking-wide block">{action.label}</span>
                                        <span className="text-[9px] text-[#999] font-medium block mt-0.5">Kelola data</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
