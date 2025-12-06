import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const TrendSection = ({ data }) => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'recommandes',
            title: 'Produits Recommandés',
            description: 'Les produits les plus suggérés par l\'IA.',
            data: data.TopProduitsRecommandes,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            )
        },
        {
            id: 'questionnes',
            title: 'Produits Questionnés',
            description: 'Les produits suscitant le plus d\'intérêt.',
            data: data.TopInfosProduit,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            )
        },
        {
            id: 'compares',
            title: 'Produits Comparés',
            description: 'Les duels de produits les plus fréquents.',
            data: data.TopProduitsComparés,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                    <path d="M16 3h5v5" />
                    <path d="M4 20L21 3" />
                    <path d="M21 16v5h-5" />
                    <path d="M15 15l5 5" />
                    <path d="M4 4l5 5" />
                </svg>
            )
        }
    ];

    const handleCardClick = (category) => {
        navigate(`/dashboard/trend/${category.id}`, {
            state: {
                title: category.title,
                data: category.data,
                dashboardData: data // Pass full data for back navigation
            }
        });
    };

    return (
        <Card className="h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <span className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                </span>
                Tendances Produits
            </h3>

            <div className="flex flex-col gap-4 flex-1">
                {categories.map((category, idx) => (
                    <div
                        key={category.id}
                        onClick={() => handleCardClick(category)}
                        className="group relative bg-[#0a0e27] border border-white/5 rounded-xl p-4 md:p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)] flex-1 flex items-center gap-4 md:gap-6"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Icon Box */}
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-white/10 shrink-0">
                            {category.icon}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base md:text-lg font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                                {category.title}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-400 mt-1 truncate">
                                {category.description}
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="w-8 h-8 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TrendSection;
