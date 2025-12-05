import React from 'react';

const UsageChart = ({ used, max }) => {
    const percentage = Math.min(100, Math.max(0, (used / max) * 100));
    const displayPercentage = (percentage > 0 && percentage < 1) ? percentage.toFixed(1) : Math.round(percentage);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-white">Consommation Totale</h2>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {used}
                    </span>
                    <span className="text-xl text-gray-500 font-medium">/ {max}</span>
                </div>
                <p className="text-gray-400 text-sm">Requêtes utilisées sur votre forfait mensuel</p>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * percentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-500 */}
                            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
                        </linearGradient>
                    </defs>
                </svg>

                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{displayPercentage}%</span>
                </div>
            </div>
        </div>
    );
};

export default UsageChart;
