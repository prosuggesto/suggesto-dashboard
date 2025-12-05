import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Background from '../components/Background';

const Login = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://n8n.srv862127.hstgr.cloud/webhook/reporting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'reporting': 'reporting.01'
                },
                body: JSON.stringify({ password })
            });

            const responseData = await response.json();

            // Handle array response (as seen in user example) or single object
            const rawData = Array.isArray(responseData) ? responseData[0] : responseData;

            // Check if we have a text field containing the data
            const text = rawData.text || rawData.texte;

            if (text && text.includes('Statut : valid')) {
                const parsedData = parseWebhookText(text);
                navigate('/dashboard', { state: { data: parsedData } });
            } else if (rawData.statut === 'valid') {
                // Handle direct JSON object if sent
                navigate('/dashboard', { state: { data: rawData } });
            } else {
                setError('Mot de passe incorrect.');
            }
        } catch (err) {
            setError('Erreur de connexion.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const parseWebhookText = (text) => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const data = {
            statut: 'valid',
            TopProduitsRecommandes: {},
            TopInfosProduit: {},
            TopProduitsComparés: {},
            QuestionsPosees: {},
            QuestionsCommandeSupport: {},
            QuestionsSupportNonCheck: {},
            QuestionsSupportCheck: {},
            totalRequestUsed: 0,
            MaxRequest: 0,
            entreprise: ''
        };

        let currentSection = null;
        let currentQuestionId = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Global values
            if (line.startsWith('Total requests utilisées :')) {
                data.totalRequestUsed = parseInt(line.split(':')[1].trim()) || 0;
                continue;
            }
            if (line.startsWith('Max request :')) {
                data.MaxRequest = parseInt(line.split(':')[1].trim()) || 0;
                continue;
            }
            if (line.startsWith('Entreprise :')) {
                data.entreprise = line.split(':')[1].trim();
                continue;
            }

            // Section Headers
            if (line.includes('Top produits recommandés :')) { currentSection = 'TopProduitsRecommandes'; continue; }
            if (line.includes('Top infos produit :')) { currentSection = 'TopInfosProduit'; continue; }
            if (line.includes('Top produits comparés :')) { currentSection = 'TopProduitsComparés'; continue; }
            if (line.includes('Questions posées :')) { currentSection = 'QuestionsPosees'; continue; }
            if (line.includes('Questions commande support :')) { currentSection = 'QuestionsCommandeSupport'; continue; }
            if (line.includes('Questions support non check :')) { currentSection = 'QuestionsSupportNonCheck'; continue; }
            if (line.includes('Questions support check :')) { currentSection = 'QuestionsSupportCheck'; continue; }
            if (line === '---') { currentSection = null; continue; }

            if (currentSection) {
                // Ranking Sections
                if (currentSection.startsWith('Top')) {
                    const match = line.match(/^Top (\d+) : (.+)/);
                    if (match) {
                        data[currentSection][`top${match[1]}`] = match[2];
                    }
                }
                // Question Sections
                else if (currentSection.startsWith('Questions')) {
                    // New Question ID
                    const qIdMatch = line.match(/^(Q\d+) :/);
                    if (qIdMatch) {
                        currentQuestionId = qIdMatch[1];
                        data[currentSection][currentQuestionId] = {};
                        continue;
                    }

                    if (currentQuestionId) {
                        if (line.startsWith('Question :')) {
                            data[currentSection][currentQuestionId].question = line.replace('Question :', '').trim();
                        } else if (line.startsWith('Réponse :')) {
                            let responseText = line.replace('Réponse :', '').trim();
                            data[currentSection][currentQuestionId].reponse = responseText;
                        } else if (line.startsWith('reponse:')) {
                            // Handle the weird "titre: ... reponse: ..." format if it appears on new lines
                            if (data[currentSection][currentQuestionId].reponse) {
                                data[currentSection][currentQuestionId].reponse += '\n' + line;
                            }
                        } else if (line.startsWith('Produit concerné :')) {
                            data[currentSection][currentQuestionId].produit = line.replace('Produit concerné :', '').trim();
                        }
                    }
                }
            }
        }

        return data;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050816] relative overflow-hidden font-sans">
            <Background />

            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Login Card */}
            <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <img src={logo} alt="Suggesto Logo" className="h-12 mb-6" />
                    <h1 className="text-3xl font-bold text-white tracking-tight text-center">
                        Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Suggesto Stats</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-center text-sm">Connectez-vous pour accéder à vos données</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            className="w-full px-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-black/30"
                        />
                        {error && (
                            <p className="text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Connexion...</span>
                            </>
                        ) : (
                            <>
                                <span>Accéder au Dashboard</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
