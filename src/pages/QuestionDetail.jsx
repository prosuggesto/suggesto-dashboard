import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Background from '../components/Background';

import { downloadCSV } from '../utils/exportHelpers';

const QuestionDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type } = useParams();
    // In QuestionBlock, we passed the full data object as 'data' in state
    // So here 'data' IS the dashboardData. 
    // Wait, let's be consistent with TrendDetail.
    // In QuestionBlock I did: navigate(..., { state: { data: data } }) where data is the full dashboard data.
    // So here, const { data } = location.state gets the full dashboard data.
    const { data } = location.state || {};

    const handleBack = () => {
        navigate('/dashboard', { state: { data } });
    };

    if (!data) {
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

    const getTitle = () => {
        switch (type) {
            case 'produits': return 'Questions Produits';
            case 'support': return 'Questions Support';
            case 'commandes': return 'Questions Commandes';
            default: return 'Détails Questions';
        }
    };

    const renderCarousel = (questions, delay = 0) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            if (!questions || questions.length === 0) return;
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % questions.length);
            }, 5000 + delay);
            return () => clearInterval(interval);
        }, [questions, delay]);

        if (!questions || questions.length === 0) {
            return <div className="h-full flex items-center justify-center text-gray-500 italic">Aucune question</div>;
        }

        return (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {questions.map((q, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                        <div
                            key={idx}
                            className={`absolute transition-all duration-700 ease-in-out transform px-8 py-6 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-center gap-4 text-center max-w-[80%]
                               ${isActive ? 'opacity-100 scale-100 translate-x-0 z-10 bg-violet-600/20 border-violet-500/50 shadow-xl' : 'opacity-0 scale-90 translate-x-full z-0'}
                           `}
                        >
                            <span className="text-4xl">🤔</span>
                            <span className="text-lg font-medium text-white">
                                {q.text || q}
                            </span>
                            {/* Answer hidden in carousel as per user request */}
                            {/* {q.reponse && (
                                <div className="mt-2 p-3 bg-white/10 rounded-xl text-sm text-gray-200 italic">
                                    " {q.reponse} "
                                </div>
                            )} */}
                            {q.produit && (
                                <div className="mt-1 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                                    Concernant : {q.produit}
                                </div>
                            )}
                        </div>
                    );
                })}
                {/* Indicators */}
                <div className="absolute bottom-4 flex gap-1">
                    {questions.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-cyan-500' : 'w-1.5 bg-gray-600'}`} />
                    ))}
                </div>
            </div>
        );
    };

    const renderList = (questions) => (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 h-full">
            {questions && questions.length > 0 ? (
                questions.map((q, idx) => (
                    <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors group">
                        <p className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors mb-1">
                            "{q.text || q}"
                        </p>
                        {q.reponse && (
                            <p className="text-xs text-gray-400 italic pl-2 border-l-2 border-white/20 mb-1">
                                {q.reponse}
                            </p>
                        )}
                        {q.produit && (
                            <p className="text-[10px] text-cyan-500 uppercase tracking-wide">
                                {q.produit}
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">Aucune question trouvée.</div>
            )}
        </div>
    );

    const prepareDataForExport = (data) => {
        if (!data) return [];
        return data.map(item => ({
            Question: item.text || item,
            Réponse: item.reponse || '',
            Produit: item.produit || ''
        }));
    };

    const renderContent = () => {
        if (type === 'support') {
            const checked = data.QuestionsSupportCheck || [];
            const unchecked = data.QuestionsSupportNonCheck || [];

            return (
                <div className="flex flex-col gap-8">
                    {/* Row 1: Traitées */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                        <Card className="flex flex-col relative overflow-hidden !bg-[#0a0e27]/80 !backdrop-blur-md !border-green-500/20">
                            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                ✅ Support Traité
                            </h3>
                            <div className="flex-1 relative min-h-0">
                                {renderCarousel(checked, 0)}
                            </div>
                        </Card>
                        <Card className="flex flex-col !bg-[#0a0e27]/80 !backdrop-blur-md overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-300">Liste Complète</h3>
                                <button
                                    onClick={() => downloadCSV(prepareDataForExport(checked), 'support_traite.csv')}
                                    className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-cyan-400 transition-colors group"
                                    title="Exporter en CSV"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            {renderList(checked)}
                        </Card>
                    </div>

                    {/* Row 2: Non Traitées */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                        <Card className="flex flex-col relative overflow-hidden !bg-[#0a0e27]/80 !backdrop-blur-md !border-red-500/20">
                            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                ⏳ Support Non Traité
                            </h3>
                            <div className="flex-1 relative min-h-0">
                                {renderCarousel(unchecked, 2500)}
                            </div>
                        </Card>
                        <Card className="flex flex-col !bg-[#0a0e27]/80 !backdrop-blur-md overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-300">Liste Complète</h3>
                                <button
                                    onClick={() => downloadCSV(prepareDataForExport(unchecked), 'support_non_traite.csv')}
                                    className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-cyan-400 transition-colors group"
                                    title="Exporter en CSV"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            {renderList(unchecked)}
                        </Card>
                    </div>
                </div>
            );
        } else {
            // Produits or Commandes
            const questions = type === 'produits' ? data.QuestionsPosees : data.QuestionsCommandeSupport;
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
                    {/* Left: Carousel */}
                    <Card className="flex flex-col justify-center relative overflow-hidden !bg-[#0a0e27]/80 !backdrop-blur-md !border-cyan-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent pointer-events-none" />
                        <h3 className="text-xl font-bold text-white mb-6 z-10 text-center">À la une</h3>
                        <div className="flex-1 relative w-full min-h-0">
                            {renderCarousel(questions)}
                        </div>
                    </Card>

                    {/* Right: List */}
                    <Card className="flex flex-col !bg-[#0a0e27]/80 !backdrop-blur-md overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="p-2 bg-white/10 rounded-lg">📋</span> Liste Complète
                            </h3>
                            <button
                                onClick={() => downloadCSV(prepareDataForExport(questions), `${type}_questions.csv`)}
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
                        {renderList(questions)}
                    </Card>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-cyan-500/30 p-6 md:p-10 flex flex-col relative overflow-hidden">
            <Background />

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex items-center gap-4 mb-8 shrink-0">
                <button
                    onClick={handleBack}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-gray-300 hover:text-white hover:scale-105 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {getTitle()}
                </h1>
            </header>

            <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full">
                {renderContent()}
            </div>
        </div>
    );
};

export default QuestionDetail;
