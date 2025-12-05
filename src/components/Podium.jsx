import React from 'react';
import Card from './Card';

const PodiumStep = ({ item, rank, height, delay }) => {
    const isInsufficient = item === 'insuffisant' || !item;

    // Dynamic styles based on rank
    const getStyles = () => {
        if (isInsufficient) return {
            bg: 'bg-white/5',
            shadow: '',
            border: 'border-white/5'
        };

        switch (rank) {
            case '1': return {
                bg: 'bg-gradient-to-b from-violet-500 via-violet-600 to-violet-900',
                shadow: 'shadow-[0_0_50px_-10px_rgba(139,92,246,0.5)]',
                border: 'border-violet-400/30'
            };
            case '2': return {
                bg: 'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-900',
                shadow: 'shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]',
                border: 'border-blue-400/30'
            };
            case '3': return {
                bg: 'bg-gradient-to-b from-cyan-500 via-cyan-600 to-cyan-900',
                shadow: 'shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]',
                border: 'border-cyan-400/30'
            };
            default: return { bg: 'bg-gray-800', shadow: '', border: '' };
        }
    };

    const styles = getStyles();

    return (
        <div className="flex flex-col items-center flex-1 mx-2 group relative z-10">
            {/* The Bar */}
            <div
                className={`relative w-full rounded-2xl flex items-start justify-center pt-4 transition-all duration-1000 ease-out border-t border-l border-r ${styles.bg} ${styles.border} ${styles.shadow} backdrop-blur-xl overflow-hidden`}
                style={{
                    height: isInsufficient ? '80px' : height,
                    animation: `growUp 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s backwards`
                }}
            >
                {/* Animated Flow/Sheen Effect */}
                {!isInsufficient && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 animate-pulse pointer-events-none" />
                )}

                {/* Rank Number (Integrated) */}
                <span className={`text-5xl font-black ${isInsufficient ? 'text-gray-700' : 'text-white/20'} mix-blend-overlay`}>
                    {rank}
                </span>

                {/* Inner Glow */}
                {!isInsufficient && (
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                )}
            </div>

            {/* Label/Value */}
            <div className={`mt-4 text-center w-full px-1 transition-all duration-700 ${!isInsufficient ? 'group-hover:-translate-y-1' : ''}`}
                style={{ animation: `fadeIn 0.8s ease-out ${delay + 0.4}s backwards` }}>
                {isInsufficient ? (
                    <span className="text-xs text-gray-600 italic font-medium">Données insuffisantes</span>
                ) : (
                    <div className="flex flex-col gap-2">
                        <span className="text-sm md:text-base font-bold text-white text-center break-words leading-snug drop-shadow-lg">
                            {item.name || item}
                        </span>
                        {item.count && (
                            <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/30 border border-cyan-500/20 py-1 px-3 rounded-full mx-auto inline-block backdrop-blur-sm">
                                {item.count} demandes
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Podium = ({ title, data }) => {
    const top1 = data[0];
    const top2 = data[1];
    const top3 = data[2];

    return (
        <Card className="h-full flex flex-col relative overflow-hidden !bg-[#0a0e27]/40 !border-white/5">
            {/* Ambient Background Particles/Glows */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-10 text-center z-10 tracking-wide">
                {title}
            </h3>

            <div className="flex items-end justify-center flex-1 w-full max-w-3xl mx-auto px-4 pb-6 z-10 gap-2 md:gap-6">
                {/* Rank 2 */}
                <PodiumStep
                    item={top2}
                    rank="2"
                    height="180px"
                    delay={0.2}
                />

                {/* Rank 1 */}
                <PodiumStep
                    item={top1}
                    rank="1"
                    height="240px"
                    delay={0.4}
                />

                {/* Rank 3 */}
                <PodiumStep
                    item={top3}
                    rank="3"
                    height="140px"
                    delay={0.6}
                />
            </div>
        </Card>
    );
};

export default Podium;
