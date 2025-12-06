import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { transformRankedData, transformQuestions } from '../utils/dataHelpers';
import logo from '../assets/logo.png';
import UsageChart from '../components/UsageChart';
import TrendSection from '../components/TrendSection';
import QuestionBlock from '../components/QuestionBlock';
import ProductManagement from '../components/ProductManagement';
import Background from '../components/Background';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rawData = location.state?.data;
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    if (!rawData) {
        return <Navigate to="/" replace />;
    }

    // Transform data safely
    const dashboardData = React.useMemo(() => {
        try {
            // If already transformed (array), return as is
            if (Array.isArray(rawData.TopProduitsRecommandes)) {
                return rawData;
            }



            return {
                ...rawData,
                TopProduitsRecommandes: transformRankedData(rawData.TopProduitsRecommandes),
                TopInfosProduit: transformRankedData(rawData.TopInfosProduit),
                TopProduitsComparés: transformRankedData(rawData.TopProduitsComparés),
                QuestionsPosees: transformQuestions(rawData.QuestionsPosees),
                QuestionsCommandeSupport: transformQuestions(rawData.QuestionsCommandeSupport),
                QuestionsSupportCheck: transformQuestions(rawData.QuestionsSupportCheck),
                QuestionsSupportNonCheck: transformQuestions(rawData.QuestionsSupportNonCheck),
            };
        } catch (err) {
            console.error("Dashboard Data Transformation Error:", err);
            return null;
        }
    }, [rawData]);

    if (!dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h3 className="text-xl font-bold text-red-400 mb-2">Erreur de données</h3>
                    <p className="text-gray-300">Impossible de traiter les données reçues.</p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden">
            <Background />

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/70 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Suggesto Logo" className="h-8" />
                    <span className="text-lg font-bold tracking-wide text-white">SUGGESTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">STATS</span></span>
                </div>

                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="hidden md:flex flex-col items-end gap-1 cursor-pointer group"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-300">En ligne</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        {dashboardData.entreprise && (
                            <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mr-1">
                                {dashboardData.entreprise}
                            </span>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0e27] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="relative z-10 pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">

                {/* Section 1: Consommation (Hero Style) */}
                <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-1 shadow-2xl">
                        <div className="bg-[#050816]/50 rounded-[20px] p-6 md:p-8">
                            <UsageChart
                                used={dashboardData.totalRequestUsed || 0}
                                max={dashboardData.MaxRequest || 100}
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Trends & Questions Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Block: Trends */}
                    <div className="animate-fade-in lg:h-[500px]" style={{ animationDelay: '0.2s' }}>
                        <TrendSection data={dashboardData} />
                    </div>

                    {/* Right Block: Questions */}
                    <div className="animate-fade-in lg:h-[500px]" style={{ animationDelay: '0.3s' }}>
                        <QuestionBlock data={dashboardData} />
                    </div>
                </section>

                {/* Section 3: Product Management (Add/Delete) */}
                <ProductManagement />

            </main>
        </div>
    );
};

export default Dashboard;
