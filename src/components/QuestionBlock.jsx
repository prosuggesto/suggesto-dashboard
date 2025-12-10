import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const QuestionBlock = ({ data }) => {
    const navigate = useNavigate();

    // We only need the carousel logic for the preview, but the user said "Le carousel, il est parfait".
    // So we keep a simple preview of "Questions Posees" (Produits) as the default view, 
    // or we can cycle through all questions. 
    // However, the user wants buttons to navigate.
    // Let's keep the preview carousel showing "Questions Produits" by default as a teaser.

    const questions = data.QuestionsPosees || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (questions.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % questions.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [questions.length]);

    const tabs = [
        { id: 'produits', label: 'Produits' },
        { id: 'support', label: 'Support' },
        { id: 'commandes', label: 'Commandes' }
    ];

    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">💬</span> Questions Posées
                </h3>
            </div>

            {/* Preview Carousel (Teaser) */}
            <div className="mb-8 relative overflow-hidden h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                {questions.length > 0 ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {questions.map((q, idx) => {
                            let offset = idx - currentIndex;
                            if (offset < 0) offset += questions.length;
                            const isActive = idx === currentIndex;

                            return (
                                <div
                                    key={idx}
                                    className={`absolute transition-all duration-700 ease-in-out transform px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm flex items-center gap-3 max-w-[90%]
                                ${isActive ? 'opacity-100 scale-100 translate-x-0 z-10 bg-violet-600/20 border-violet-500/50' : 'opacity-0 scale-90 translate-x-full z-0'}
                            `}
                                >
                                    <span className="text-xl md:text-2xl shrink-0">🤔</span>
                                    <div className="flex flex-col text-left min-w-0 flex-1">
                                        <span className="text-sm md:text-base font-medium text-white truncate w-full">
                                            {q.text || q}
                                        </span>
                                        {q.reponse && (
                                            <span className="text-[10px] md:text-xs text-gray-400 truncate max-w-[150px] md:max-w-[200px] italic">
                                                "{q.reponse}"
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-500 italic">Aucune question</div>
                )}

                {/* Indicators */}
                <div className="absolute bottom-2 flex gap-1">
                    {questions.map((_, idx) => (
                        <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-violet-500' : 'w-1 bg-gray-600'}`} />
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex p-1 bg-black/20 rounded-xl mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(`/dashboard/questions/${tab.id}`, { state: { data: data } })}
                        className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-lg"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Preview List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[300px]">
                {questions.length > 0 ? (
                    questions.slice(0, 5).map((q, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                            <p className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors truncate">
                                "{q.text || q}"
                            </p>
                            {q.reponse && (
                                <p className="text-xs text-gray-500 italic truncate mt-1 pl-2 border-l border-white/10">
                                    {q.reponse}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        Aucune question trouvée.
                    </div>
                )}
                {questions.length > 5 && (
                    <div className="text-center text-xs text-gray-500 mt-2">
                        + {questions.length - 5} autres questions...
                    </div>
                )}
            </div>
        </Card>
    );
};

export default QuestionBlock;
