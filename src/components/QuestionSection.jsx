import React from 'react';
import Card from './Card';

const QuestionCard = ({ question }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[280px] md:min-w-[320px] h-32 flex flex-col justify-between hover:bg-white/10 transition-colors snap-start">
        <p className="text-gray-200 text-sm md:text-base line-clamp-3">
            "{question.text || question}"
        </p>
        <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
            <span>{question.date || 'Récemment'}</span>
            {question.status && (
                <span className={`px-2 py-1 rounded-full ${question.status === 'checked' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {question.status}
                </span>
            )}
        </div>
    </div>
);

const QuestionSection = ({ title, questions }) => {
    if (!questions || questions.length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">{title}</h3>
                <div className="text-gray-500 italic">Aucune question enregistrée</div>
            </div>
        );
    }

    return (
        <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
                {title}
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">{questions.length}</span>
            </h3>

            {/* Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {questions.map((q, idx) => (
                    <QuestionCard key={idx} question={q} />
                ))}
            </div>
        </div>
    );
};

export default QuestionSection;
