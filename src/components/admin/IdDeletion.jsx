import React, { useState } from 'react';
import Card from '../Card';

const IdDeletion = ({ title, onDelete, type }) => {
    const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (e) => {
        e.preventDefault();
        if (!id) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onDelete(id);
            setIsLoading(false);
            alert(`${type === 'product' ? 'Produit' : 'Info'} supprimé avec succès ! (ID: ${id})`);
            setId('');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card className="bg-[#0a0e27]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-8">
                    {title}
                </h2>

                <form onSubmit={handleDelete} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Identifiant (ID) à supprimer
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Ex: 12345"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={!id || isLoading}
                            className="px-8 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                        >
                            {isLoading ? 'Suppression...' : 'Supprimer'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default IdDeletion;
