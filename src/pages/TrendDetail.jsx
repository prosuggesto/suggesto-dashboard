import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Podium from '../components/Podium';
import Background from '../components/Background';

import { downloadCSV } from '../utils/exportHelpers';

const TrendDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    // Retrieve specific category data AND full dashboard data
    const { title, data, dashboardData } = location.state || {};

    const handleBack = () => {
        // Pass the FULL dashboard data back
        navigate('/dashboard', { state: { data: dashboardData } });
    };

    if (!data || !dashboardData) {
        return (
            <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white font-sans">
                <Background />
                <div className="relative z-10 text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-4">Données non disponibles</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-cyan-500/30 p-6 md:p-10 relative overflow-hidden">
            <Background />

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex items-center gap-4 mb-8">
                <button
                    onClick={handleBack}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-gray-300 hover:text-white hover:scale-105 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {title}
                </h1>
            </header>

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-8 pb-10">
                {/* Top: Grand Podium */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex flex-col justify-center relative overflow-hidden min-h-[400px] shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
                    <Podium title="Top 3" data={data} />
                </div>

                {/* Bottom: Scrollable List (Full Width) */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col overflow-hidden h-[400px] shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <span className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg text-cyan-400 border border-cyan-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                            </span>
                            Classement Complet
                        </h2>
                        <button
                            onClick={() => downloadCSV(data, `${title.replace(/\s+/g, '_')}_classement.csv`)}
                            className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-cyan-400 transition-colors group"
                            title="Exporter en CSV"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {data.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all shrink-0 shadow-lg bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white`}
                                >
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-medium text-gray-200 group-hover:text-white transition-colors break-words">
                                        {item.name || item}
                                    </p>
                                    {item.count && (
                                        <p className="text-xs text-gray-500 group-hover:text-gray-400">
                                            Demandé {item.count} fois
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendDetail;
